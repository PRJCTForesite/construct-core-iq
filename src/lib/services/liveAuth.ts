/**
 * Verified sign-in against the Foresite FastAPI service (POST /auth/login, GET /auth/me).
 * /auth/me is the source of truth for user, organisation and role. The JWT is kept only in
 * this browser's storage for the session; passwords are never stored.
 */
import { createApiClient, type ApiClient } from '@/lib/api/apiClient';
import { API_URL, liveDataEnabled, readLivePreference } from '@/lib/api/config';
import type { AccountRole } from './access-contracts';
import type { Account } from './contracts';

export const LIVE_SESSION_KEY = 'foresite.live-session.v1';
const ROLES: AccountRole[] = ['Owner', 'Administrator', 'Project Manager', 'Supervisor', 'Trade', 'Client'];

export type ApiMe = {
  user_id: number | string; email: string; first_name?: string | null; last_name?: string | null;
  organisation_id?: number | string | null; organisation_name?: string | null; role?: string | null;
};
export type LiveSession = { token: string; me: ApiMe; at: number };

export function liveAuthAvailable() {
  if (typeof window === 'undefined') return false;
  return liveDataEnabled({ url: API_URL, preference: readLivePreference(), isDev: import.meta.env.DEV });
}

export function accountFromMe(me: ApiMe): Account {
  const role = ROLES.find(r => r.toLowerCase() === String(me.role ?? '').trim().toLowerCase());
  const name = [me.first_name, me.last_name].filter(Boolean).join(' ').trim();
  return {
    id: `api-user-${me.user_id}`,
    email: me.email,
    ...(name ? { name } : {}),
    memberships: me.organisation_id == null ? [] : [{
      organisationId: `api-org-${me.organisation_id}`,
      organisationName: me.organisation_name ?? 'Organisation',
      roles: role ? [role] : [],
      projectIds: [],
    }],
  } as Account;
}

export function readLiveSession(): LiveSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LIVE_SESSION_KEY) || window.sessionStorage.getItem(LIVE_SESSION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as LiveSession;
    return typeof value?.token === 'string' && value.me && typeof value.me.email === 'string' ? value : null;
  } catch { return null; }
}
export function clearLiveSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(LIVE_SESSION_KEY);
  window.sessionStorage.removeItem(LIVE_SESSION_KEY);
}
export const liveAccessToken = () => readLiveSession()?.token ?? null;

export async function liveSignIn(email: string, password: string, remember: boolean, client?: ApiClient): Promise<LiveSession> {
  const api = client ?? createApiClient({ baseUrl: API_URL ?? '' });
  const login = await api.post<{ access_token?: string }>('/auth/login', { email, password });
  const token = login?.access_token;
  if (!token) throw new Error('The Foresite server did not return a sign-in token.');
  const authed = client ?? createApiClient({ baseUrl: API_URL ?? '', getAccessToken: () => token });
  const me = await authed.get<ApiMe>('/auth/me');
  if (!me || typeof me.email !== 'string') throw new Error('The Foresite server did not return your account details.');
  const session: LiveSession = { token, me, at: Date.now() };
  clearLiveSession();
  (remember ? window.localStorage : window.sessionStorage).setItem(LIVE_SESSION_KEY, JSON.stringify(session));
  return session;
}
