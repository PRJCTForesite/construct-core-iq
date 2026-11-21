import { createContext } from 'react';
import type { PlatformRecord, RecordKind } from '@/content/platform';
import type { PermissionMap, Role } from '@/content/permissions';

export type LiveDataStatus = 'unconfigured' | 'off' | 'connecting' | 'live' | 'error';
export type LiveDataState = {
  status: LiveDataStatus;
  baseUrl: string | null;
  message: string;
  lastSynced: string | null;
  counts: { projects: number; tasks: number };
  saving: boolean;
};

export type PlatformStore = {
  liveData: LiveDataState;
  connectLiveData: () => void;
  disconnectLiveData: () => void;
  refreshLiveData: () => void;
  records: PlatformRecord[];
  loadSamples: (records: PlatformRecord[]) => void;
  role: Role;
  setRole: (role: Role) => void;
  save: (record: PlatformRecord, keepOpen?: boolean) => void;
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
  isSample: (id: string) => boolean;
};

// Keep context identity outside the hot-reloaded provider/component module.
export const PlatformContext = createContext<PlatformStore | null>(null);