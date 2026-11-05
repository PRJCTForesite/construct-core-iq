import { createContext } from 'react';
import type { PlatformRecord, RecordKind } from '@/content/platform';
import type { PermissionMap, Role } from '@/content/permissions';

export type PlatformStore = {
  records: PlatformRecord[];
  role: Role;
  setRole: (role: Role) => void;
  save: (record: PlatformRecord) => void;
  remove: (id: string) => void;
  create: (kind: RecordKind) => void;
  editing: PlatformRecord | null;
  edit: (record: PlatformRecord | null) => void;
  can: (module: string, action?: string) => boolean;
  permissions: PermissionMap;
  setPermissions: (permissions: PermissionMap) => void;
  notifications: string[];
  notify: (notification: string) => void;
  dismissNotifications: () => void;
};

// Keep context identity outside the hot-reloaded provider/component module.
export const PlatformContext = createContext<PlatformStore | null>(null);