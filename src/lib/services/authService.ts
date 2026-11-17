import { ACCESS_WORKSPACES } from '@/content/access';
import type { Account, AuthService, WorkspaceMembership } from './contracts';

export const SESSION_KEY = 'foresite.session';
export function mockMemberships(): WorkspaceMembership[] {
  return ACCESS_WORKSPACES.map((workspace, index) => ({ organisationId: `demo-workspace-${index + 1}`, organisationName: workspace.organisation, roles: [workspace.role], projectIds: [] }));
}
function account(email: string): Account { return { id: `demo-account:${email.toLowerCase()}`, email, memberships: mockMemberships() }; }
/** Browser-only mock; passwords are never stored and memberships do not grant access. */
export const authService: AuthService = {
  login(email, remember) {
    if (typeof window === 'undefined') throw new Error('Mock sign-in requires a browser');
    this.logout();
    const user = account(email.trim());
    const storage = remember ? window.localStorage : window.sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, at: Date.now(), demo: true }));
    return user;
  },
  logout() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  },
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(SESSION_KEY) || window.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      return session.demo === true && typeof session.email === 'string' ? account(session.email) : null;
    } catch { return null; }
  },
};