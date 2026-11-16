import { PROJECTS, type DirectoryUser, type Role, type PermissionMap, type AuditEntry } from './permissions';

export const STANDARD_ROLES: Role[] = ['Owner', 'Administrator', 'Project Manager', 'Supervisor', 'Trade', 'Client'];
export const USER_PERMISSIONS = [
  ['Create Projects', 'Projects', 'Create'], ['Delete Projects', 'Projects', 'Delete'],
  ['Delete Tasks', 'Tasks', 'Delete'], ['Manage Documents', 'Documents', 'Edit'],
  ['Approve Variations', 'Variations', 'Approve'], ['Invite Users', 'Users', 'Create'],
  ['View Financials', 'Financials', 'View'], ['Manage Billing', 'Billing', 'Administer'],
  ['Manage Trades', 'Trades', 'Edit'], ['Manage Clients', 'Clients', 'Edit'],
  ['Manage Organisation', 'Organisation', 'Administer'], ['Manage Permissions', 'Administration', 'Administer'],
] as const;
export const WORKSPACES = [
  { name: 'ABC Electrical', role: 'Owner', projects: 'Company-wide access' },
  { name: 'XYZ Builders', role: 'Trade', projects: '2 assigned projects' },
  { name: 'DEF Constructions', role: 'Trade', projects: '1 assigned project' },
] as const;
export function displayStatus(status: DirectoryUser['status']) {
  return status === 'Online' ? 'Active' : status === 'Invited' ? 'Pending Invitation' : status;
}
export function togglePermission(permissions: PermissionMap, module: string, action: string, enabled: boolean): PermissionMap {
  const actions = new Set(permissions[module] ?? []);
  if (enabled) { actions.add('View'); actions.add(action); } else actions.delete(action);
  return { ...permissions, [module]: [...actions] };
}
export function assignProjects(user: DirectoryUser, projects: string[], entireOrganisation = false): DirectoryUser {
  const selected = entireOrganisation ? PROJECTS : projects;
  return { ...user, assignmentScope: entireOrganisation ? 'Entire Organisation' : 'Selected Projects', assignments: selected.map(project => user.assignments.find(a => a.project === project) ?? {
    project, role: user.role, status: 'Active', date: new Date().toLocaleDateString('en-AU'), rights: user.role === 'Client' || user.role === 'Trade' ? ['View'] : ['View', 'Edit'],
  }) };
}
export function userChanges(before: DirectoryUser, after: DirectoryUser): AuditEntry[] {
  const changes: [string, string, string][] = [];
  if (before.role !== after.role) changes.push(['Role Changed', before.role, after.role]);
  if (before.status !== after.status) changes.push(['Status Changed', displayStatus(before.status), displayStatus(after.status)]);
  if (JSON.stringify(before.permissions) !== JSON.stringify(after.permissions)) changes.push(['Permission Updated', 'Previous permission set', 'Custom permission set saved']);
  if (before.permissionTemplate !== after.permissionTemplate) changes.push(['Template Changed', before.permissionTemplate ?? before.role, after.permissionTemplate ?? after.role]);
  if (before.assignmentScope !== after.assignmentScope) changes.push(['Assignment Scope Changed', before.assignmentScope ?? 'Selected Projects', after.assignmentScope ?? 'Selected Projects']);
  for (const project of PROJECTS) {
    const previous = before.assignments.find(a => a.project === project);
    const next = after.assignments.find(a => a.project === project);
    if (!previous && next) changes.push(['Assigned To Project', 'Unassigned', project]);
    else if (previous && !next) changes.push(['Removed From Project', project, 'Unassigned']);
    else if (previous && next && previous.role !== next.role) changes.push(['Project Role Changed', `${project}: ${previous.role}`, `${project}: ${next.role}`]);
  }
  if (['name', 'email', 'mobile', 'organisation', 'position'].some(key => before[key as keyof DirectoryUser] !== after[key as keyof DirectoryUser])) changes.push(['Profile Updated', 'Previous profile', 'Contact and organisation details saved']);
  return changes.map(([change, previous, next]) => ({ id: crypto.randomUUID(), actor: 'Lachlan Davies (demo owner)', user: after.name, change, previous, next, date: new Date().toLocaleString('en-AU') }));
}