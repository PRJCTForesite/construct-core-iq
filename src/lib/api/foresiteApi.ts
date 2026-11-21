import type { ApiClient } from './apiClient';
import { unwrapList, type ApiId, type ApiProject, type ApiTask, type ProjectPayload, type TaskPayload } from './serializers';

/** Confirmed FastAPI resources: Projects and Tasks only. Other modules stay on mock services. */
const path = (resource: string, id?: ApiId) => (id === undefined ? `/${resource}` : `/${resource}/${encodeURIComponent(String(id))}`);

export function createProjectsApi(client: ApiClient) {
  return {
    list: async () => unwrapList<ApiProject>(await client.get<unknown>(path('projects')), 'projects'),
    get: (id: ApiId) => client.get<ApiProject>(path('projects', id)),
    create: (payload: ProjectPayload) => client.post<ApiProject>(path('projects'), payload),
    update: (id: ApiId, payload: ProjectPayload) => client.put<ApiProject>(path('projects', id), payload),
    remove: (id: ApiId) => client.delete(path('projects', id)),
    progress: (id: ApiId) => client.get<unknown>(`${path('projects', id)}/progress`),
  };
}

export function createTasksApi(client: ApiClient) {
  return {
    list: async () => unwrapList<ApiTask>(await client.get<unknown>(path('tasks')), 'tasks'),
    get: (id: ApiId) => client.get<ApiTask>(path('tasks', id)),
    create: (payload: TaskPayload) => client.post<ApiTask>(path('tasks'), payload),
    update: (id: ApiId, payload: TaskPayload) => client.put<ApiTask>(path('tasks', id), payload),
    remove: (id: ApiId) => client.delete(path('tasks', id)),
  };
}

export const health = (client: ApiClient) => client.get<unknown>('/health');
