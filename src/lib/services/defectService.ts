import type { RecordService } from './contracts';
import { createModuleService } from './moduleService';
export function createDefectService(records: RecordService) {
  const service = createModuleService(records, 'Defect');
  return { ...service, getDefects: service.getRecords, createDefect: service.createRecord, updateDefect: service.updateRecord,
    updateDefectStatus(id: string, status: string) {
      const defect = service.getRecords().find(record => record.id === id);
      if (!defect) throw new Error('Defect not found');
      return service.updateRecord({ ...defect, status });
    },
  };
}