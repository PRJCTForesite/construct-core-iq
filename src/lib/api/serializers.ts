import { makeRecord, type PlatformRecord } from '@/content/platform';
import { ApiError } from './apiClient';

/** Validated SQLAlchemy Project and Task fields (source of truth for mapping). */
export type ApiId = string | number;
export type ApiProject = {
  project_id: ApiId;
  organisation_id?: ApiId | null;
  client_id?: ApiId | null;
  project_name: string;
  project_address?: string | null;
  project_value?: number | string | null;
  start_date?: string | null;
  expected_completion?: string | null;
  work_progress_percent?: number | string | null;
  programme_progress_percent?: number | string | null;
  project_status?: string | null;
  created_at?: string | null;
};
export type ApiTask = {
  task_id: ApiId;
  project_id: ApiId;
  task_name: string;
  task_description?: string | null;
  assigned_to?: string | null;
  task_status?: string | null;
  priority?: string | null;
  due_date?: string | null;
  completed_date?: string | null;
  work_weight?: number | string | null;
  created_at?: string | null;
};
export type ProjectPayload = Omit<ApiProject, 'project_id' | 'created_at'>;
export type TaskPayload = Omit<ApiTask, 'task_id' | 'created_at'>;

export const projectRecordId = (id: ApiId) => `api-project-${id}`;
export const taskRecordId = (id: ApiId) => `api-task-${id}`;

const num = (value: unknown, fallback = 0) => {
  const n = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : NaN;
  return Number.isFinite(n) ? n : fallback;
};
const percent = (value: unknown) => Math.max(0, Math.min(100, Math.round(num(value))));
const day = (value: unknown) => (typeof value === 'string' && value ? value.slice(0, 10) : '');
const text = (value: unknown) => (typeof value === 'string' ? value : value == null ? '' : String(value));
const orNull = (value: string | undefined) => (value && value.trim() ? value.trim() : null);
const DONE = /complete|signed off|done|closed/i;

/** Accepts a bare array or a {items|data|results|<resource>} wrapper. */
export function unwrapList<T>(value: unknown, resource: string): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') {
    const body = value as Record<string, unknown>;
    for (const key of [resource, 'items', 'data', 'results']) if (Array.isArray(body[key])) return body[key] as T[];
  }
  throw new ApiError(`The Foresite server returned ${resource} in an unexpected format.`, 200, value);
}

export function projectFromApi(project: ApiProject): PlatformRecord {
  const name = text(project.project_name) || `Project ${project.project_id}`;
  return {
    ...makeRecord('Project', name, {
      project: name,
      status: text(project.project_status) || 'Active',
      progress: percent(project.work_progress_percent),
      amount: num(project.project_value),
      date: day(project.expected_completion),
      notes: '',
      person: '',
      responsible: '',
      notified: '',
      category: 'Project',
      address: text(project.project_address),
      startDate: day(project.start_date),
    }),
    id: projectRecordId(project.project_id),
    remote: {
      source: 'foresite-api',
      id: project.project_id,
      organisationId: project.organisation_id ?? null,
      clientId: project.client_id ?? null,
      programmeProgress: project.programme_progress_percent == null ? null : percent(project.programme_progress_percent),
      createdAt: project.created_at ?? null,
    },
  };
}

export function projectToApi(record: PlatformRecord): ProjectPayload {
  const payload: ProjectPayload = {
    project_name: record.title.trim(),
    project_address: orNull(record.address),
    project_value: num(record.amount),
    start_date: orNull(record.startDate),
    expected_completion: orNull(record.date),
    work_progress_percent: percent(record.progress),
    project_status: orNull(record.status),
  };
  const remote = record.remote;
  if (remote?.organisationId != null) payload.organisation_id = remote.organisationId;
  if (remote?.clientId != null) payload.client_id = remote.clientId;
  if (remote?.programmeProgress != null) payload.programme_progress_percent = remote.programmeProgress;
  return payload;
}

/** projectNames maps String(project_id) to the project's name, which links tasks in the UI. */
export function taskFromApi(task: ApiTask, projectNames: ReadonlyMap<string, string>): PlatformRecord {
  const status = text(task.task_status) || 'Pending';
  return {
    ...makeRecord('Task', text(task.task_name) || `Task ${task.task_id}`, {
      project: projectNames.get(String(task.project_id)) ?? `Project ${task.project_id}`,
      status,
      person: text(task.assigned_to) || 'Unassigned',
      responsible: '',
      notified: '',
      notes: text(task.task_description),
      date: day(task.due_date),
      weight: num(task.work_weight, 1),
      progress: task.completed_date || DONE.test(status) ? 100 : 0,
      category: 'Task',
      dependencies: '',
      priority: text(task.priority),
    }),
    id: taskRecordId(task.task_id),
    remote: { source: 'foresite-api', id: task.task_id, completedDate: task.completed_date ?? null, createdAt: task.created_at ?? null },
  };
}

/** projectIds maps a project name (as chosen in the form) to its database project_id. */
export function taskToApi(record: PlatformRecord, projectIds: ReadonlyMap<string, ApiId>): TaskPayload {
  const projectId = projectIds.get(record.project);
  if (projectId === undefined) throw new ApiError('Choose one of your database projects for this task.', 0);
  const person = record.person.trim();
  return {
    project_id: projectId,
    task_name: record.title.trim(),
    task_description: orNull(record.notes),
    assigned_to: person && person !== 'Unassigned' ? person : null,
    task_status: orNull(record.status),
    priority: orNull(record.priority),
    due_date: orNull(record.date),
    completed_date: record.remote?.completedDate ?? null,
    work_weight: num(record.weight, 1),
  };
}
