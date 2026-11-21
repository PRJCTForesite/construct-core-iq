/**
 * Central HTTP client for the Foresite FastAPI service. Components never call fetch directly:
 * resource modules (foresiteApi.ts) use this client and serializers map the responses.
 * JWT and refresh hooks are optional so verified authentication can be attached later
 * without changing callers; no auth routes are assumed here.
 */
export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly detail?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type ApiRequest = { method: ApiMethod; url: string; headers: Headers; body?: unknown };
export type RequestInterceptor = (request: ApiRequest) => ApiRequest | Promise<ApiRequest>;
export type ResponseInterceptor = (response: Response, request: ApiRequest) => Response | Promise<Response>;

export type ApiClientOptions = {
  baseUrl: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
  /** Future JWT support: return the current access token, or null when signed out. */
  getAccessToken?: () => string | null | Promise<string | null>;
  /** Future refresh support: return true when a new token was obtained and the request may retry once. */
  refreshAccessToken?: () => Promise<boolean>;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
};

export type ApiClient = ReturnType<typeof createApiClient>;

/** Turns FastAPI error bodies ({detail: string | [{loc,msg}]}) into a readable sentence. */
export async function readApiError(response: Response): Promise<{ message: string; detail?: unknown }> {
  const fallback = `The Foresite server returned an error (${response.status}).`;
  try {
    const text = await response.text();
    if (!text) return { message: fallback };
    const body: unknown = JSON.parse(text);
    const detail = body && typeof body === 'object' && 'detail' in body ? (body as { detail: unknown }).detail : body;
    if (typeof detail === 'string') return { message: detail, detail };
    if (Array.isArray(detail)) {
      const parts = detail.map(item => {
        if (!item || typeof item !== 'object') return String(item);
        const { loc, msg } = item as { loc?: unknown; msg?: unknown };
        const field = Array.isArray(loc) ? loc.filter(part => part !== 'body').join('.') : '';
        return field ? `${field}: ${String(msg)}` : String(msg);
      });
      return { message: parts.join('; ') || fallback, detail };
    }
    return { message: fallback, detail };
  } catch {
    return { message: fallback };
  }
}

export function createApiClient(options: ApiClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/+$/, '');
  const fetchImpl: typeof fetch = options.fetch ?? ((input, init) => globalThis.fetch(input, init));
  const timeoutMs = options.timeoutMs ?? 10000;
  const requestInterceptors = [...(options.requestInterceptors ?? [])];
  const responseInterceptors = [...(options.responseInterceptors ?? [])];

  async function send<T>(method: ApiMethod, path: string, body?: unknown, retried = false): Promise<T> {
    let request: ApiRequest = {
      method,
      url: `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`,
      headers: new Headers({ Accept: 'application/json' }),
      ...(body === undefined ? {} : { body }),
    };
    if (body !== undefined) request.headers.set('Content-Type', 'application/json');
    const token = await options.getAccessToken?.();
    if (token) request.headers.set('Authorization', `Bearer ${token}`);
    for (const intercept of requestInterceptors) request = await intercept(request);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response: Response;
    try {
      const init: RequestInit = { method: request.method, headers: request.headers, signal: controller.signal };
      if (request.body !== undefined) init.body = JSON.stringify(request.body);
      response = await fetchImpl(request.url, init);
    } catch (error) {
      throw new ApiError(controller.signal.aborted ? 'The Foresite server took too long to respond.' : 'Could not reach the Foresite server.', 0, error);
    } finally {
      clearTimeout(timer);
    }
    for (const intercept of responseInterceptors) response = await intercept(response, request);

    if (response.status === 401 && !retried && options.refreshAccessToken && await options.refreshAccessToken()) {
      return send<T>(method, path, body, true);
    }
    if (!response.ok) {
      const { message, detail } = await readApiError(response);
      throw new ApiError(message, response.status, detail);
    }
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError('The Foresite server sent a response that could not be read.', response.status, text);
    }
  }

  return {
    baseUrl,
    get: <T>(path: string) => send<T>('GET', path),
    post: <T>(path: string, body: unknown) => send<T>('POST', path, body),
    put: <T>(path: string, body: unknown) => send<T>('PUT', path, body),
    delete: <T = void>(path: string) => send<T>('DELETE', path),
    addRequestInterceptor: (intercept: RequestInterceptor) => { requestInterceptors.push(intercept); },
    addResponseInterceptor: (intercept: ResponseInterceptor) => { responseInterceptors.push(intercept); },
  };
}
