import type { RecordService } from './contracts';
import { createModuleService } from './moduleService';
export function createProjectService(records: RecordService) {
  const service = createModuleService(records, 'Project');
  return { ...service, getProjects: service.getRecords, createProject: service.createRecord, updateProject: service.updateRecord };
}