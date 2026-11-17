import { makeRecord } from './platform';
import { INITIAL_USERS, rolePermissions, type DirectoryUser } from './permissions';
export const DEMO_PROJECTS = ['8 Webber Parade, Keilor', '24 Riverside Drive, Essendon', '6 Station Road, Sunshine'];
export function onboardingDemoRecords() {
  const projects = DEMO_PROJECTS.map((title, i) => makeRecord('Project', title, { id: `onboarding-sample-project-${i}`, project: title, progress: i === 0 ? 62 : 20, person: 'Lochy Davies' }));
  const tasks = Array.from({ length: 15 }, (_, i) => makeRecord('Task', ['Site preparation', 'Electrical rough-in', 'Framing inspection', 'Plumbing inspection', 'Client selections'][i % 5] ?? 'Site task', { id: `onboarding-sample-task-${i}`, project: DEMO_PROJECTS[Math.floor(i / 5)] ?? DEMO_PROJECTS[0] ?? '', person: 'ABC Electrical', progress: 62 }));
  const documents = Array.from({ length: 8 }, (_, i) => makeRecord('Document', `Project drawing ${i + 1}`, { id: `onboarding-sample-document-${i}`, project: DEMO_PROJECTS[i % 3] ?? '', category: 'Drawings', shareWithClient: false }));
  const defects = Array.from({ length: 4 }, (_, i) => makeRecord('Defect', ['Power point alignment', 'Door adjustment', 'Paint touch-up', 'Sealant finish'][i] ?? 'Defect', { id: `onboarding-sample-defect-${i}`, project: DEMO_PROJECTS[i < 3 ? 0 : 1] ?? '', status: 'Reported' }));
  return [...projects, ...tasks, ...documents, ...defects, makeRecord('Client', 'John Smith', { id: 'onboarding-sample-client', project: DEMO_PROJECTS[0] ?? '' }), makeRecord('Trade', 'ABC Electrical', { id: 'onboarding-sample-trade', project: DEMO_PROJECTS[0] ?? '' })];
}
export function onboardingDemoUsers(): DirectoryUser[] {
  return INITIAL_USERS.slice(0, 5).map((user, i) => ({ ...structuredClone(user), id: `onboarding-sample-user-${i}`, name: ['Lochy Davies', 'Emma Wilson', 'James Hartley', 'John Smith', 'ABC Electrical'][i] ?? user.name, organisation: 'Foresite Construction', role: i === 0 ? 'Administrator' : user.role, permissions: rolePermissions(i === 0 ? 'Administrator' : user.role), assignments: [], email: `sample-${i + 1}@example.test` }));
}
