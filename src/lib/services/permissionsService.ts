import { ACTIONS, MODULES, type PermissionMap, type Role } from '@/content/permission-types';

/** UI simulation only. A future backend must independently enforce access. */
export function rolePermissions(role: Role): PermissionMap {
  return Object.fromEntries(MODULES.map(module => {
    if (role === 'Owner') return [module, [...ACTIONS]];
    if (['Client', 'Trade', 'Trade Contractor'].includes(role)) return [module, module === (role === 'Client' ? 'Client Portal' : 'Trade Portal') ? ['View'] : []];
    if (module === 'Billing' || module === 'Organisation') return [module, []];
    if (role === 'Administrator') return [module, [...ACTIONS]];
    if (['Users', 'Client Portal', 'Trade Portal', 'Clients'].includes(module)) return [module, []];
    if (module === 'Administration' || (module === 'Financials' && role !== 'Project Manager')) return [module, []];
    if (role === 'Guest') return [module, ['Projects', 'Documents', 'Communications'].includes(module) ? ['View'] : []];
    if (role === 'Project Manager') return [module, ['View', 'Create', 'Edit', 'Assign', 'Approve']];
    if (role === 'Foreman' || role === 'Supervisor') return [module, ['Tasks', 'Trades', 'Defects', 'Documents', 'Communications'].includes(module) ? ['View', 'Create', 'Edit', 'Assign'] : module === 'Projects' ? ['View'] : []];
    return [module, module === 'Reports' ? [] : ['View', 'Create']];
  }));
}
export function canUseModule(permissions: PermissionMap, module: string, action = 'View') {
  return permissions[module]?.includes(action) ?? ['Calendar', 'Clients', 'Trades', 'Settings'].includes(module);
}
export function canSignOff(role: string) { return ['Owner', 'Administrator', 'Project Manager', 'Supervisor', 'Foreman'].includes(role); }
export function canManageCompany(role: string) { return ['Owner', 'Administrator'].includes(role); }
export function canUseClientPortal(role: Role, action: string) {
  if (canManageCompany(role)) return true;
  if (role === 'Project Manager') return action !== 'Configure';
  return role === 'Client' && ['View', 'Comment', 'Approve', 'Reject', 'Submit defect'].includes(action);
}
export function assignmentRights(role: Role) { return ['Client', 'Trade'].includes(role) ? ['View'] : ['View', 'Edit']; }
export function previewPortal(role: Role): '/app/client-portal' | '/app/trade-portal' | null {
  return role === 'Client' ? '/app/client-portal' : ['Trade', 'Trade Contractor'].includes(role) ? '/app/trade-portal' : null;
}