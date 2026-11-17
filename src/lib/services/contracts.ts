import type { PlatformRecord, RecordKind } from '@/content/platform';
import type { DirectoryUser, Role } from '@/content/permissions';

// Frontend domain models, not HTTP request/response contracts.
export type WorkspaceMembership = { organisationId: string; organisationName: string; roles: Role[]; projectIds: string[] };
export type Account = { id: string; email: string; memberships: WorkspaceMembership[] };
export interface AuthService {
  login(email: string, remember: boolean): Account;
  logout(): void;
  getCurrentUser(): Account | null;
}
export interface RecordService {
  getRecords(): PlatformRecord[];
  saveRecord(record: PlatformRecord): { records: PlatformRecord[]; clearedSamples: number };
  deleteRecord(id: string): PlatformRecord[];
  isSample(id: string): boolean;
  getRealRecords(): PlatformRecord[];
}
export interface ModuleService {
  getRecords(): PlatformRecord[];
  createRecord(record: PlatformRecord): ReturnType<RecordService['saveRecord']>;
  updateRecord(record: PlatformRecord): ReturnType<RecordService['saveRecord']>;
  deleteRecord(id: string): PlatformRecord[];
}
export interface UserService {
  getUsers(): DirectoryUser[];
  replaceUsers(users: DirectoryUser[]): void;
  updateUser(user: DirectoryUser): void;
}
export type ModuleServices = Record<RecordKind, ModuleService>;