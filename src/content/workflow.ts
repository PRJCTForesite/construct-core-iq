import type { PlatformRecord } from './platform';

export type HealthState = 'On Track' | 'Attention Required' | 'Delayed' | 'Critically Delayed';
export function workflowHealth(status: string, severity = ''): HealthState {
  if (['Closed', 'Completed', 'Completed & Signed Off', 'Approved'].includes(status)) return 'On Track';
  if (severity === 'Critical' || status === 'Critically Delayed') return 'Critically Delayed';
  if (/Delayed|Overdue/i.test(status)) return 'Delayed';
  if (/Review|Approval|Sign Off|Reported|Open|Rejected|Inspection/i.test(status)) return 'Attention Required';
  return 'On Track';
}
export function taskMatches(status: string, filter: string) {
  if (filter === 'All statuses') return true;
  if (filter === 'Open') return ['Open', 'Pending', 'Assigned'].includes(status);
  if (filter === 'Completed') return status === 'Completed & Signed Off';
  return status === filter;
}
export function weightedProgress(tasks: Pick<PlatformRecord, 'progress' | 'weight'>[]) {
  const weight = tasks.reduce((sum, task) => sum + Math.max(0, task.weight), 0);
  return weight ? Math.round(tasks.reduce((sum, task) => sum + Math.min(100, Math.max(0, task.progress)) * Math.max(0, task.weight), 0) / weight) : 0;
}
export function clampWeight(value: number) { return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0)); }
export { canSignOff } from '@/lib/services/permissionsService';
export function documentType(name: string, category = '') {
  const extension = name.match(/\.(pdf|docx?|xlsx?|jpe?g|png|dwg)$/i)?.[1];
  return extension?.toUpperCase() ?? (/Photos/i.test(category) ? 'JPG' : /Programs|Financial/i.test(category) ? 'XLSX' : 'PDF');
}