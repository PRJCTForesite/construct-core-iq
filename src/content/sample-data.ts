import type { PlatformRecord } from "@/content/platform";

/** Sample records ship with every new workspace and are tagged by their seed ID prefix or a project seed ID. */
export function isSample(record: PlatformRecord, sampleIds: ReadonlySet<string>) {
  return sampleIds.has(record.id);
}

/**
 * Saves a record. When a user creates their first real record of a kind, every
 * sample record of that same kind is removed; other modules keep their samples.
 */
export function commitRecord(
  records: PlatformRecord[],
  record: PlatformRecord,
  sampleIds: ReadonlySet<string>,
): { records: PlatformRecord[]; clearedSamples: number } {
  const exists = records.some((r) => r.id === record.id);
  if (exists) return { records: records.map((r) => (r.id === record.id ? record : r)), clearedSamples: 0 };
  const isFirstReal = !isSample(record, sampleIds);
  const kept = isFirstReal ? records.filter((r) => !(r.kind === record.kind && sampleIds.has(r.id))) : records;
  return { records: [record, ...kept], clearedSamples: records.length - kept.length };
}

/** Records that should be sent to the live data service (never sample data). */
export function realRecords(records: PlatformRecord[], sampleIds: ReadonlySet<string>) {
  return records.filter((r) => !sampleIds.has(r.id));
}
