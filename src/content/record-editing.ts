import type { PlatformRecord } from './platform';
import type { DirectoryUser } from './permissions';
export function prepareRecordForSave(record: PlatformRecord): PlatformRecord {
  return record.kind === 'Project' ? { ...record, title: record.title.trim(), project: record.title.trim() } : record;
}
export function availableEmployees(users: DirectoryUser[], query = '') {
  const term = query.trim().toLowerCase();
  return users.filter(user => !['Client', 'Guest', 'Trade', 'Trade Contractor'].includes(user.role) && ['Online', 'Active'].includes(user.status) && `${user.name} ${user.role} ${user.organisation}`.toLowerCase().includes(term));
}
