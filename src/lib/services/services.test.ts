import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeRecord } from '@/content/platform';
import { createMockRecordService } from './mockRecordService';
import { createProjectService } from './projectService';
import { createTaskService } from './taskService';
import { createDefectService } from './defectService';
import { createDocumentService } from './documentService';
import { createMockUserService } from './userService';
import { mockMemberships } from './authService';
import type { Account } from './contracts';
import { rolePermissions, canSignOff } from './permissionsService';

test('first real defect clears only defect samples; export excludes all samples', () => {
  const store = createMockRecordService();
  const defects = createDefectService(store);
  const projects = createProjectService(store);
  const count = projects.getProjects().length;
  const defect = makeRecord('Defect', 'Actual cracked tile');
  defects.createDefect(defect);
  assert.deepEqual(defects.getDefects(), [defect]);
  assert.equal(projects.getProjects().length, count);
  assert.deepEqual(store.getRealRecords(), [defect]);
});
test('module adapters share edits and cannot write another kind', () => {
  const store = createMockRecordService();
  const defects = createDefectService(store);
  const record = makeRecord('Defect', 'Actual defect');
  defects.createDefect(record);
  defects.updateDefectStatus(record.id, 'In Progress');
  assert.equal(store.getRealRecords()[0]?.status, 'In Progress');
  assert.throws(() => createDocumentService(store).createDocument(record), /Expected Document/);
});
test('task service updates project weighted progress without mutating reads', () => {
  const store = createMockRecordService([]);
  createProjectService(store).createProject(makeRecord('Project', 'Actual project'));
  const tasks = createTaskService(store);
  tasks.createTask(makeRecord('Task', 'Task A', { project: 'Actual project', weight: 1, progress: 100 }));
  tasks.createTask(makeRecord('Task', 'Task B', { project: 'Actual project', weight: 3, progress: 0 }));
  assert.equal(createProjectService(store).getProjects()[0]?.progress, 25);
  const read = tasks.getTasks();
  const first = read[0];
  if (!first) throw new Error('Task missing');
  first.title = 'External mutation';
  assert.notEqual(tasks.getTasks()[0]?.title, 'External mutation');
});
test('mock app stores and user stores are isolated between instances', () => {
  const first = createMockRecordService();
  first.saveRecord(makeRecord('Project', 'My project'));
  assert.equal(createMockRecordService().getRealRecords().length, 0);
  const users = createMockUserService();
  const user = users.getUsers()[0];
  if (!user) throw new Error('User missing');
  users.updateUser({ ...user, name: 'Updated name' });
  assert.equal(users.getUsers()[0]?.name, 'Updated name');
  assert.notEqual(createMockUserService().getUsers()[0]?.name, 'Updated name');
});
test('one account supports multiple organisation memberships and independent role lists', () => {
  const memberships = mockMemberships();
  assert.deepEqual(memberships.map(m => [m.organisationName, m.roles]), [
    ['ABC Electrical', ['Owner']], ['XYZ Builders', ['Trade']], ['DEF Constructions', ['Trade']],
  ]);
  const account: Account = { id: 'test', email: 'test@example.test', memberships };
  account.memberships[0]?.roles.push('Administrator');
  assert.deepEqual(account.memberships[0]?.roles, ['Owner', 'Administrator']);
  assert.deepEqual(account.memberships[1]?.roles, ['Trade']);
  assert.deepEqual(mockMemberships()[0]?.roles, ['Owner']);
});
test('all six requested roles remain available in permission simulation', () => {
  for (const role of ['Owner', 'Administrator', 'Project Manager', 'Supervisor', 'Trade', 'Client'] as const) {
    assert.ok(Object.keys(rolePermissions(role)).length > 0);
  }
  assert.equal(canSignOff('Trade'), false);
  assert.equal(canSignOff('Client'), false);
  assert.equal(canSignOff('Supervisor'), true);
});