import { authService } from './authService';
import type { AccessSession, AuthenticationAdapter, ConnectionScope, IntegrationAdapter, LoginProvider, PasswordSignIn } from './access-contracts';

export class AccessUnavailableError extends Error {
  constructor(message = 'Live account connections are awaiting the reviewed backend specifications.') {
    super(message);
    this.name = 'AccessUnavailableError';
  }
}

/** Async adapter boundary. Passwords and tokens are never persisted here. */
export function createAccessServices(authentication: AuthenticationAdapter, integrations?: IntegrationAdapter) {
  async function requireIntegration(scope: ConnectionScope) {
    if (authentication.mode !== 'verified' || !integrations) throw new AccessUnavailableError();
    const session = await authentication.getSession();
    if (!session || session.mode !== 'verified' || (session.expiresAt !== null && session.expiresAt <= Date.now())) {
      throw new AccessUnavailableError('Please sign in with a verified Foresite account.');
    }
    if (!session.account.memberships.some(membership => membership.organisationId === scope.organisationId)) {
      throw new AccessUnavailableError('This organisation is not available to this account.');
    }
    // This is a UI boundary, not authorisation: the backend must enforce access.
    return integrations;
  }
  return {
    mode: authentication.mode,
    providers: authentication.providers,
    integrationsAvailable: authentication.mode === 'verified' && Boolean(integrations),
    signInWithPassword: (input: PasswordSignIn) => authentication.signInWithPassword(input),
    beginOAuth: async (provider: LoginProvider) => {
      if (authentication.mode !== 'verified' || !authentication.providers.includes(provider)) {
        throw new AccessUnavailableError('This sign-in provider is not configured yet.');
      }
      await authentication.beginOAuth(provider);
    },
    getSession: () => authentication.getSession(),
    getAccessToken: () => authentication.mode === 'verified' ? authentication.getAccessToken() : Promise.resolve(null),
    refreshSession: () => authentication.refreshSession(),
    signOut: () => authentication.signOut(),
    listConnections: async (scope: ConnectionScope) => (await requireIntegration(scope)).listConnections(scope),
    connectApp: async (appId: string, scope: ConnectionScope) => (await requireIntegration(scope)).beginOAuth(appId, scope),
    disconnectApp: async (id: string, scope: ConnectionScope) => (await requireIntegration(scope)).disconnect(id, scope),
  };
}

function demoSession(): AccessSession | null {
  const user = authService.getCurrentUser();
  if (!user) return null;
  // Demo memberships already use the six account roles; do not infer live claims.
  const roles = ['Owner', 'Administrator', 'Project Manager', 'Supervisor', 'Trade', 'Client'] as const;
  return { mode: 'demo', expiresAt: null, account: { ...user, memberships: user.memberships.map(membership => ({ ...membership, roles: roles.filter(role => membership.roles.includes(role)) })) } };
}

export const demoAuthenticationAdapter: AuthenticationAdapter = {
  mode: 'demo',
  providers: [],
  async signInWithPassword({ email, remember }) {
    // The demo does not verify, send or retain the password.
    authService.login(email, remember);
    const session = demoSession();
    if (!session) throw new AccessUnavailableError('Demo sign-in could not be opened.');
    return session;
  },
  async beginOAuth() { throw new AccessUnavailableError(); },
  async getSession() { return demoSession(); },
  async getAccessToken() { return null; },
  async refreshSession() { return demoSession(); },
  async signOut() { authService.logout(); },
};

// Composition point: replace only after auth, token lifecycle and API contracts
// are reviewed. No implicit fallback from a failed verified adapter to demo login.
export const accessService = createAccessServices(demoAuthenticationAdapter);