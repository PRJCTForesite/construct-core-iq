import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareRecordForSave, availableEmployees } from './record-editing';
import { makeRecord } from './platform';
import { INITIAL_USERS } from './permissions';
import { createMockRecordService } from '@/lib/services/mockRecordService';
import { createProjectService } from '@/lib/services/projectService';
test('a new project refers to its own name, not an existing project', () => {
 const record=makeRecord('Project',' New build ',{project:'Smith Residence'});
 const saved=prepareRecordForSave(record);
 assert.equal(saved.title,'New build'); assert.equal(saved.project,'New build'); assert.equal(record.project,'Smith Residence');
});
test('records within a project keep their selected project', () => assert.equal(prepareRecordForSave(makeRecord('Task','Inspection',{project:'Existing build'})).project,'Existing build'));
test('employee picker searches live names and excludes inactive users and external roles', () => {
 assert.deepEqual(availableEmployees(INITIAL_USERS,'Sarah Chen').map(user=>user.name),['Sarah Chen']);
 assert.equal(availableEmployees(INITIAL_USERS,'Oliver Taylor').length,0);
 assert.equal(availableEmployees(INITIAL_USERS,'Sophie Smith').length,0);
 assert.ok(availableEmployees(INITIAL_USERS).some(user=>user.name==='James Hartley'));
});
test('project service creation needs no existing project', () => {
 const store=createMockRecordService([]);
 createProjectService(store).createProject(makeRecord('Project','Standalone build',{project:'Unrelated build'}));
 assert.equal(store.getRecords()[0]?.project,'Standalone build');
});
test('new-project correction leaves existing closed records unchanged', () => {
 const closed=makeRecord('Project','Completed build',{project:'Original link',status:'Closed'});
 const store=createMockRecordService([closed]);
 store.saveRecord({...closed,notes:'Unchanged link'});
 assert.equal(store.getRecords()[0]?.project,'Original link');
 assert.equal(store.getRecords()[0]?.status,'Closed');
});
