/** Browser-safe API configuration. The address comes only from VITE_API_URL. */
export const LIVE_DATA_KEY = 'foresite.live-data.v1';
export type LivePreference = 'on' | 'off' | null;

export function normaliseApiUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString().replace(/\/+$/, '');
  } catch {
    return null;
  }
}

export const API_URL = normaliseApiUrl(import.meta.env['VITE_API_URL']);

/** Loopback or private-network addresses only work on the machine/network running the server. */
export function isLocalAddress(url: string) {
  const host = new URL(url).hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.local')
    || /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
}

/**
 * A device choice always wins. Without one, the preview (dev) connects automatically and
 * published sites connect only to public addresses, so visitors are never asked for local-network access.
 */
export function liveDataEnabled({ url, preference, isDev }: { url: string | null; preference: LivePreference; isDev: boolean }) {
  if (!url) return false;
  if (preference) return preference === 'on';
  return isDev || !isLocalAddress(url);
}

export function readLivePreference(): LivePreference {
  try {
    const value = window.localStorage.getItem(LIVE_DATA_KEY);
    return value === 'on' || value === 'off' ? value : null;
  } catch {
    return null;
  }
}

export function writeLivePreference(value: 'on' | 'off') {
  try { window.localStorage.setItem(LIVE_DATA_KEY, value); } catch { /* storage unavailable */ }
}
