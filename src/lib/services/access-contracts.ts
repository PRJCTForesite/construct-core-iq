import type { Role } from '@/content/permission-types';

// Frontend operations only: no transport paths, OAuth scopes or database schemas.
export type AccountRole = Extract<Role, 'Owner' | 'Administrator' | 'Project Manager' | 'Supervisor' | 'Trade' | 'Client'>;
export type AccessAccount = {
  id: string;
  email: string;
  memberships: { organisationId: string; organisationName: string; roles: AccountRole[]; projectIds: string[] }[];
};
export type LoginProvider = 'microsoft' | 'google';
export type PasswordSignIn = { email: string; password: string; remember: boolean };
export type AccessSession = { account: AccessAccount; mode: 'demo' | 'verified'; expiresAt: number | null };
export interface AuthenticationAdapter {
  readonly mode: 'demo' | 'verified';
  readonly providers: readonly LoginProvider[];
  signInWithPassword(input: PasswordSignIn): Promise<AccessSession>;
  beginOAuth(provider: LoginProvider): Promise<void>;
  getSession(): Promise<AccessSession | null>;
  getAccessToken(): Promise<string | null>;
  refreshSession(): Promise<AccessSession | null>;
  signOut(): Promise<void>;
}
export type ConnectionScope = { organisationId: string };
export type Connection = {
  id: string;
  appId: string;
  accountLabel: string;
  status: 'connected' | 'reauthorisation-required' | 'syncing' | 'error';
};
export interface IntegrationAdapter {
  listConnections(scope: ConnectionScope): Promise<Connection[]>;
  beginOAuth(appId: string, scope: ConnectionScope): Promise<void>;
  disconnect(connectionId: string, scope: ConnectionScope): Promise<void>;
}