import { INITIAL_RECORDS, type PlatformRecord } from '@/content/platform';
import { commitRecord, realRecords } from '@/content/sample-data';
import { weightedProgress } from '@/content/workflow';
import { prepareRecordForSave } from '@/content/record-editing';
import type { RecordService } from './contracts';

/** One instance per mounted app: no global mutable record store or network calls. */
export function createMockRecordService(seed = INITIAL_RECORDS): RecordService {
  let records = structuredClone(seed);
  const samples = new Set(seed.map(record => record.id));
  return {
    getRecords: () => structuredClone(records),
    getRealRecords: () => structuredClone(realRecords(records, samples)),
    isSample: id => samples.has(id),
    saveRecord(record: PlatformRecord) {
      // New projects stand alone even when created through a module adapter.
      // Existing records are not rewritten as a side effect of this rule.
      if (record.kind === 'Project' && !records.some(row => row.id === record.id)) record = prepareRecordForSave(record);
      const previousProject = records.find(row => row.id === record.id)?.project;
      const result = commitRecord(records, structuredClone(record), samples);
      records = record.kind === 'Task' ? result.records.map(project => project.kind === 'Project' && [record.project, previousProject].includes(project.title)
        ? { ...project, progress: weightedProgress(result.records.filter(task => task.kind === 'Task' && task.project === project.title)) } : project) : result.records;
      return { records: structuredClone(records), clearedSamples: result.clearedSamples };
    },
    deleteRecord(id) { records = records.filter(record => record.id !== id); return structuredClone(records); },
    replaceKinds(kinds, next) {
      records = [...structuredClone(next), ...records.filter(record => !kinds.includes(record.kind))];
      return structuredClone(records);
    },
    restoreSamples(kinds) {
      records = [...seed.filter(record => kinds.includes(record.kind)).map(record => structuredClone(record)), ...records.filter(record => !kinds.includes(record.kind))];
      return structuredClone(records);
    },
  };
}