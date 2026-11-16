import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { DirectoryUser, AuditEntry } from '@/content/permissions';
export type UsersStore = {
  users: DirectoryUser[]; setUsers: Dispatch<SetStateAction<DirectoryUser[]>>;
  audit: AuditEntry[]; setAudit: Dispatch<SetStateAction<AuditEntry[]>>;
  saveUser: (user: DirectoryUser) => void;
};
export const UsersContext = createContext<UsersStore | null>(null);