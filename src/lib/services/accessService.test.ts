import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAccessServices, demoAuthenticationAdapter } from './accessService';
import type { AccessSession, AuthenticationAdapter, IntegrationAdapter, PasswordSignIn } from './access-contracts';

function fixture() {
  const account: AccessSession['account'] = { id: 'verified-user', email: 'user@example.test', memberships: [{ organisationId: 'org-1', organisationName: 'Test builder', roles: ['Owner', 'Administrator', 'Project Manager', 'Supervisor', 'Trade', 'Client'], projectIds: [] }] };
  let session: AccessSession | null = { account, mode: 'verified', expiresAt: Date.now() + 60_000 };
  const calls: unknown[] = [];
  const authentication: AuthenticationAdapter = {
    mode: 'verified', providers: ['microsoft', 'google'],
    async signInWithPassword(input) { calls.push(input); if (!session) throw new Error('Invalid credentials'); return session; },
    async beginOAuth(provider) { calls.push(provider); },
    async getSession() { return session; },
    async getAccessToken() { return 'opaque-test-jwt'; },
    async refreshSession() { return session; },
    async signOut() { session = null; },
  };
  const integrations: IntegrationAdapter = {
    async listConnections(scope) { calls.push(scope); return [{ id: 'connection-1', appId: 'xero', accountLabel: 'Test builder', status: 'connected' }]; },
    async beginOAuth(appId, scope) { calls.push([appId, scope]); },
    async disconnect(id, scope) { calls.push([id, scope]); },
  };
  return { authentication, integrations, calls, account, setSession(value: AccessSession | null) { session = value; } };
}

test('email/password sign-in delegates without prescribing an endpoint or storing credentials', async () => {
  const f = fixture();
  const service = createAccessServices(f.authentication);
  const input: PasswordSignIn = { email: 'user@example.test', password: 'test-password', remember: true };
  assert.equal((await service.signInWithPassword(input)).account.id, 'verified-user');
  assert.deepEqual(f.calls, [input]);
  f.setSession(null);
  await assert.rejects(service.signInWithPassword(input), /Invalid credentials/);
  assert.equal(await service.getSession(), null);
});

test('future Microsoft OAuth delegates only when the verified adapter enables it', async () => {
  const f = fixture();
  await createAccessServices(f.authentication).beginOAuth('microsoft');
  assert.deepEqual(f.calls, ['microsoft']);
  await assert.rejects(createAccessServices({ ...f.authentication, providers: [] }).beginOAuth('microsoft'), /not configured/);
});

test('future Google OAuth delegates only when the verified adapter enables it', async () => {
  const f = fixture();
  await createAccessServices(f.authentication).beginOAuth('google');
  assert.deepEqual(f.calls, ['google']);
  await assert.rejects(createAccessServices(demoAuthenticationAdapter).beginOAuth('google'), /not configured/);
});

test('JWT retrieval, refresh and sign-out remain adapter responsibilities', async () => {
  const f = fixture();
  const service = createAccessServices(f.authentication);
  assert.equal(await service.getAccessToken(), 'opaque-test-jwt');
  assert.equal((await service.refreshSession())?.mode, 'verified');
  await service.signOut();
  assert.equal(await service.getSession(), null);
  assert.equal(await service.refreshSession(), null);
  assert.equal(await createAccessServices(demoAuthenticationAdapter).getAccessToken(), null);
});

test('account abstraction carries exactly the six requested membership roles without inventing permissions', async () => {
  const f = fixture();
  const session = await createAccessServices(f.authentication).getSession();
  assert.deepEqual(session?.account.memberships[0]?.roles, ['Owner', 'Administrator', 'Project Manager', 'Supervisor', 'Trade', 'Client']);
});

test('Xero, Gmail, Outlook and Microsoft 365 consent delegates to the injected integration adapter', async () => {
  const f = fixture();
  const service = createAccessServices(f.authentication, f.integrations);
  const scope = { organisationId: 'org-1' };
  for (const app of ['xero', 'google_mail', 'microsoft_outlook', 'microsoft_onedrive', 'microsoft_sharepoint']) await service.connectApp(app, scope);
  assert.deepEqual(f.calls, ['xero', 'google_mail', 'microsoft_outlook', 'microsoft_onedrive', 'microsoft_sharepoint'].map(app => [app, scope]));
  assert.deepEqual(await service.listConnections(scope), [{ id: 'connection-1', appId: 'xero', accountLabel: 'Test builder', status: 'connected' }]);
  await service.disconnectApp('connection-1', scope);
  assert.deepEqual(f.calls.at(-1), ['connection-1', scope]);
});

test('unconfigured, demo, expired and wrong-organisation sessions cannot reach personal integrations', async () => {
  const f = fixture();
  const scope = { organisationId: 'org-1' };
  assert.equal(createAccessServices(f.authentication).integrationsAvailable, false);
  await assert.rejects(createAccessServices(f.authentication).connectApp('xero', scope), /awaiting/);
  await assert.rejects(createAccessServices(demoAuthenticationAdapter, f.integrations).connectApp('xero', scope), /awaiting/);
  const service = createAccessServices(f.authentication, f.integrations);
  await assert.rejects(service.listConnections({ organisationId: 'other-org' }), /not available/);
  f.setSession({ account: f.account, mode: 'verified', expiresAt: Date.now() - 1 });
  await assert.rejects(service.connectApp('xero', scope), /verified Foresite account/);
  f.setSession(null);
  await assert.rejects(service.disconnectApp('connection-1', scope), /verified Foresite account/);
  assert.deepEqual(f.calls, []);
});