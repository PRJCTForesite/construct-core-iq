import type { RecordKind } from '@/content/platform';
import type { ModuleService, RecordService } from './contracts';

export function createModuleService(service: RecordService, kind: RecordKind): ModuleService {
  const save: ModuleService['createRecord'] = record => {
    if (record.kind !== kind) throw new Error(`Expected ${kind} record`);
    return service.saveRecord(record);
  };
  return {
    getRecords: () => service.getRecords().filter(record => record.kind === kind),
    createRecord: save,
    updateRecord: save,
    deleteRecord(id) {
      if (!service.getRecords().some(record => record.id === id && record.kind === kind)) throw new Error(`${kind} record not found`);
      return service.deleteRecord(id);
    },
  };
}