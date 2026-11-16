import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_USERS, PROJECTS, rolePermissions } from './permissions';
import { assignProjects, displayStatus, togglePermission, userChanges } from './users';
test('Owner can manage organisation, users, billing and permissions', () => {
  const p = rolePermissions('Owner');
  for (const m of ['Organisation', 'Users', 'Billing', 'Administration']) assert.equal(p[m]?.includes('Administer'), true);
});
test('Administrator manages projects, users, documents and defects but cannot manage billing', () => {
  const p = rolePermissions('Administrator');
  for (const m of ['Projects', 'Users', 'Documents', 'Defects']) assert.equal(p[m]?.includes('Edit'), true);
  assert.deepEqual(p['Billing'], []);
});
test('Project Manager can manage projects, assign tasks and manage defects', () => {
  const p = rolePermissions('Project Manager');
  assert.equal(p['Projects']?.includes('Edit'), true); assert.equal(p['Tasks']?.includes('Assign'), true); assert.equal(p['Defects']?.includes('Edit'), true);
});
test('Supervisor can manage tasks, trades and defects', () => {
  const p = rolePermissions('Supervisor'); for (const m of ['Tasks', 'Trades', 'Defects']) assert.equal(p[m]?.includes('Edit'), true);
});
test('Trade template has Trade Portal access only', () => {
  assert.deepEqual(Object.entries(rolePermissions('Trade')).filter(([, actions]) => actions.length), [['Trade Portal', ['View']]]);
});
test('Client template has Client Portal access only', () => {
  assert.deepEqual(Object.entries(rolePermissions('Client')).filter(([, actions]) => actions.length), [['Client Portal', ['View']]]);
});
test('Users can be assigned one, multiple or all organisation projects', () => {
  const user = INITIAL_USERS[0]; if (!user) throw new Error('Missing seed');
  assert.equal(assignProjects(user, [PROJECTS[0] ?? '']).assignments.length, 1);
  assert.equal(assignProjects(user, PROJECTS.slice(0, 2)).assignments.length, 2);
  const all = assignProjects(user, [], true); assert.deepEqual(all.assignments.map(a => a.project), PROJECTS); assert.equal(all.assignmentScope, 'Entire Organisation');
});
test('Custom permission toggles preserve view prerequisite and can be revoked', () => {
  const p = togglePermission({}, 'Billing', 'Administer', true); assert.deepEqual(p['Billing'], ['View', 'Administer']);
  assert.equal(togglePermission(p, 'Billing', 'Administer', false)['Billing']?.includes('Administer'), false);
});
test('Role, permission, assignment and removal changes produce audit records', () => {
  const user = INITIAL_USERS[0]; if (!user) throw new Error('Missing seed');
  const next = { ...user, role: 'Client' as const, permissions: rolePermissions('Client'), assignments: [] };
  const changes = userChanges(user, next); assert.equal(changes.some(a => a.change === 'Role Changed'), true); assert.equal(changes.some(a => a.change === 'Permission Updated'), true); assert.equal(changes.filter(a => a.change === 'Removed From Project').length, 4);
});
test('Legacy online and invited statuses map to active and pending invitation', () => {
  assert.equal(displayStatus('Online'), 'Active'); assert.equal(displayStatus('Invited'), 'Pending Invitation'); assert.equal(displayStatus('Suspended'), 'Suspended');
});