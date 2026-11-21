import { describe, expect, it } from 'vitest';
import { makeRecord } from '@/content/platform';
import { createMockRecordService } from '@/lib/services/mockRecordService';
import { createLiveRecordService, LIVE_KINDS } from '@/lib/services/liveRecordService';
import { ApiError, createApiClient } from './apiClient';
import { liveDataEnabled, normaliseApiUrl } from './config';
import { projectFromApi, projectToApi, taskFromApi, taskToApi, unwrapList } from './serializers';

const project = { project_id: 7, organisation_id: 2, client_id: 9, project_name: 'Bayview Duplex', project_address: '1 Bay St', project_value: '650000.00', start_date: '2026-02-01', expected_completion: '2026-12-15T00:00:00', work_progress_percent: 42.4, programme_progress_percent: 50, project_status: 'Active', created_at: '2026-01-10T09:00:00' };
const task = { task_id: 31, project_id: 7, task_name: 'Frame inspection', task_description: 'Book certifier', assigned_to: 'Daniel Lee', task_status: 'In Progress', priority: 'High', due_date: '2026-03-04', completed_date: null, work_weight: 5, created_at: null };

function fakeFetch(handler: (url: string, init: RequestInit) => Response) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetch = (async (input: RequestInfo | URL, init?: RequestInit) => { calls.push({ url: String(input), init: init ?? {} }); return handler(String(input), init ?? {}); }) as typeof globalThis.fetch;
  return { fetch, calls };
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('API address', () => {
  it('reads the configured address and drops a trailing slash', () => {
    expect(normaliseApiUrl('http://127.0.0.1:8000/')).toBe('http://127.0.0.1:8000');
    expect(normaliseApiUrl('')).toBeNull();
    expect(normaliseApiUrl('ftp://example.com')).toBeNull();
  });
  it('published sites only auto-connect to public addresses; a device choice always wins', () => {
    expect(liveDataEnabled({ url: 'http://127.0.0.1:8000', preference: null, isDev: false })).toBe(false);
    expect(liveDataEnabled({ url: 'http://127.0.0.1:8000', preference: null, isDev: true })).toBe(true);
    expect(liveDataEnabled({ url: 'https://api.foresiteos.com.au', preference: null, isDev: false })).toBe(true);
    expect(liveDataEnabled({ url: 'http://127.0.0.1:8000', preference: 'on', isDev: false })).toBe(true);
    expect(liveDataEnabled({ url: 'https://api.foresiteos.com.au', preference: 'off', isDev: false })).toBe(false);
    expect(liveDataEnabled({ url: null, preference: 'on', isDev: true })).toBe(false);
  });
});

describe('serializers', () => {
  it('uses project_id as the project identifier and maps validated fields', () => {
    const record = projectFromApi(project);
    expect(record.remote?.id).toBe(7);
    expect(record).toMatchObject({ kind: 'Project', title: 'Bayview Duplex', amount: 650000, progress: 42, date: '2026-12-15', startDate: '2026-02-01', address: '1 Bay St', status: 'Active' });
    expect(projectToApi(record)).toEqual({ project_name: 'Bayview Duplex', project_address: '1 Bay St', project_value: 650000, start_date: '2026-02-01', expected_completion: '2026-12-15', work_progress_percent: 42, project_status: 'Active', organisation_id: 2, client_id: 9, programme_progress_percent: 50 });
  });
  it('uses task_id as the task identifier and links tasks to projects by project_id', () => {
    const record = taskFromApi(task, new Map([['7', 'Bayview Duplex']]));
    expect(record.remote?.id).toBe(31);
    expect(record).toMatchObject({ kind: 'Task', title: 'Frame inspection', project: 'Bayview Duplex', person: 'Daniel Lee', weight: 5, priority: 'High', notes: 'Book certifier' });
    expect(taskToApi(record, new Map([['Bayview Duplex', 7]]))).toMatchObject({ project_id: 7, task_name: 'Frame inspection', assigned_to: 'Daniel Lee', task_status: 'In Progress', work_weight: 5, due_date: '2026-03-04' });
  });
  it('refuses to send a task whose project is not in the database', () => {
    expect(() => taskToApi(makeRecord('Task', 'Orphan', { project: 'Smith Residence' }), new Map())).toThrow(ApiError);
  });
  it('accepts plain or wrapped lists', () => {
    expect(unwrapList([1], 'projects')).toEqual([1]);
    expect(unwrapList({ items: [2] }, 'projects')).toEqual([2]);
    expect(() => unwrapList({ nope: true }, 'projects')).toThrow(ApiError);
  });
});

describe('apiClient', () => {
  it('joins the base address, sends JSON and attaches a future access token', async () => {
    const { fetch, calls } = fakeFetch(() => json({ ok: true }));
    const client = createApiClient({ baseUrl: 'http://127.0.0.1:8000/', fetch, getAccessToken: () => 'jwt-1' });
    await client.post('/projects', { project_name: 'A' });
    expect(calls[0]?.url).toBe('http://127.0.0.1:8000/projects');
    const headers = new Headers(calls[0]?.init.headers);
    expect(headers.get('Authorization')).toBe('Bearer jwt-1');
    expect(calls[0]?.init.body).toBe('{"project_name":"A"}');
  });
  it('turns FastAPI validation errors into a readable message', async () => {
    const { fetch } = fakeFetch(() => json({ detail: [{ loc: ['body', 'project_name'], msg: 'Field required' }] }, 422));
    await expect(createApiClient({ baseUrl: 'http://x', fetch }).get('/projects')).rejects.toMatchObject({ status: 422, message: 'project_name: Field required' });
  });
  it('retries once after a successful token refresh', async () => {
    let n = 0;
    const { fetch, calls } = fakeFetch(() => (++n === 1 ? json({ detail: 'expired' }, 401) : json([])));
    await createApiClient({ baseUrl: 'http://x', fetch, refreshAccessToken: async () => true }).get('/tasks');
    expect(calls).toHaveLength(2);
  });
  it('reports an unreachable server', async () => {
    const fetch = (async () => { throw new TypeError('Failed to fetch'); }) as typeof globalThis.fetch;
    await expect(createApiClient({ baseUrl: 'http://x', fetch }).get('/projects')).rejects.toMatchObject({ status: 0, message: 'Could not reach the Foresite server.' });
  });
});

describe('live projects and tasks', () => {
  it('replace only project and task samples; other modules keep their samples', async () => {
    const { fetch } = fakeFetch(url => json(url.endsWith('/projects') ? [project] : [task]));
    const live = createLiveRecordService(createApiClient({ baseUrl: 'http://x', fetch }));
    const store = createMockRecordService();
    const defects = store.getRecords().filter(r => r.kind === 'Defect').length;
    const next = store.replaceKinds(LIVE_KINDS, await live.load());
    expect(next.filter(r => r.kind === 'Project').map(r => r.title)).toEqual(['Bayview Duplex']);
    expect(next.filter(r => r.kind === 'Task').map(r => r.id)).toEqual(['api-task-31']);
    expect(next.filter(r => r.kind === 'Defect')).toHaveLength(defects);
    expect(store.getRealRecords().map(r => r.id).sort()).toEqual(['api-project-7', 'api-task-31']);
    expect(store.restoreSamples(LIVE_KINDS).some(r => r.id.startsWith('api-'))).toBe(false);
  });
  it('updates an existing task with PUT /tasks/{task_id}', async () => {
    const { fetch, calls } = fakeFetch(() => json(task));
    const live = createLiveRecordService(createApiClient({ baseUrl: 'http://x', fetch }));
    const projects = [projectFromApi(project)];
    await live.save(taskFromApi(task, new Map([['7', 'Bayview Duplex']])), projects);
    expect(calls[0]).toMatchObject({ url: 'http://x/tasks/31', init: { method: 'PUT' } });
  });
});
