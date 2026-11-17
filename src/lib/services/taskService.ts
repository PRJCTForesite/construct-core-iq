import type { RecordService } from './contracts';
import { createModuleService } from './moduleService';
export function createTaskService(records: RecordService) {
  const service = createModuleService(records, 'Task');
  return { ...service, getTasks: service.getRecords, createTask: service.createRecord, updateTask: service.updateRecord };
}