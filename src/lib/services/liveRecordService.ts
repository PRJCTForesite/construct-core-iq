import type { PlatformRecord, RecordKind } from '@/content/platform';
import type { ApiClient } from '@/lib/api/apiClient';
import { createProjectsApi, createTasksApi } from '@/lib/api/foresiteApi';
import { projectFromApi, projectToApi, taskFromApi, taskToApi, type ApiId } from '@/lib/api/serializers';

/** Only these modules are approved for the live FastAPI service. */
export const LIVE_KINDS: readonly RecordKind[] = ['Project', 'Task'];
export const isLiveKind = (kind: RecordKind) => LIVE_KINDS.includes(kind);

export function createLiveRecordService(client: ApiClient) {
  const projects = createProjectsApi(client);
  const tasks = createTasksApi(client);
  return {
    baseUrl: client.baseUrl,
    async load(): Promise<PlatformRecord[]> {
      const [projectRows, taskRows] = await Promise.all([projects.list(), tasks.list()]);
      const names = new Map(projectRows.map(project => [String(project.project_id), project.project_name]));
      return [...projectRows.map(projectFromApi), ...taskRows.map(task => taskFromApi(task, names))];
    },
    /** Creates or updates one record. `current` supplies project IDs for task links. */
    async save(record: PlatformRecord, current: PlatformRecord[]) {
      if (record.kind === 'Project') {
        const payload = projectToApi(record);
        return record.remote ? projects.update(record.remote.id, payload) : projects.create(payload);
      }
      if (record.kind === 'Task') {
        const ids = new Map<string, ApiId>();
        for (const row of current) if (row.kind === 'Project' && row.remote) ids.set(row.title, row.remote.id);
        const payload = taskToApi(record, ids);
        return record.remote ? tasks.update(record.remote.id, payload) : tasks.create(payload);
      }
      throw new Error(`${record.kind} records are not connected to the Foresite server yet.`);
    },
    async remove(record: PlatformRecord) {
      if (!record.remote) return;
      if (record.kind === 'Project') await projects.remove(record.remote.id);
      else if (record.kind === 'Task') await tasks.remove(record.remote.id);
    },
  };
}
export type LiveRecordService = ReturnType<typeof createLiveRecordService>;
