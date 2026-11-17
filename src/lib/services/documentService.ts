import type { RecordService } from './contracts';
import { createModuleService } from './moduleService';
export function createDocumentService(records: RecordService) {
  const service = createModuleService(records, 'Document');
  return { ...service, getDocuments: service.getRecords, createDocument: service.createRecord, updateDocument: service.updateRecord };
}