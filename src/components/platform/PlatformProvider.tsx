import { BETA_PREVIEW_KEY } from '@/content/onboarding';
import { useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { PlatformContext as Context, type LiveDataState } from './platform-context';
import { makeRecord, type PlatformRecord, type RecordKind } from '@/content/platform';
import { createMockRecordService } from '@/lib/services/mockRecordService';
import { createLiveRecordService, isLiveKind, LIVE_KINDS } from '@/lib/services/liveRecordService';
import { createApiClient } from '@/lib/api/apiClient';
import { liveAccessToken } from '@/lib/services/liveAuth';
import { API_URL, liveDataEnabled, readLivePreference, writeLivePreference } from '@/lib/api/config';
import { canUseModule } from '@/lib/services/permissionsService';
import { rolePermissions, type Role, INITIAL_USERS } from '@/content/permissions';

const errorText = (error: unknown) => (error instanceof Error ? error.message : 'Something went wrong talking to the Foresite server.');

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState(createMockRecordService);
  const [records, setRecords] = useState(() => service.getRecords());
  const [role, setRoleState] = useState<Role>('Owner');
  const [permissions, setPermissions] = useState(rolePermissions('Owner'));
  const [editing, edit] = useState<PlatformRecord | null>(null);
  const [notifications, setNotifications] = useState(['Assigned task: waterproofing inspection', 'Defect DEF-0035 requires approval', 'Financial warning: Morrison invoice overdue', 'Project health changed: Oakwood House', 'Kitchen variation awaiting approval']);
  const [liveData, setLiveData] = useState<LiveDataState>({ status: API_URL ? 'off' : 'unconfigured', baseUrl: API_URL, message: '', lastSynced: null, counts: { projects: 0, tasks: 0 }, saving: false });

  // Async work reads the latest store through refs. databaseMode stays true once live data has loaded.
  const serviceRef = useRef(service); serviceRef.current = service;
  const recordsRef = useRef(records); recordsRef.current = records;
  const databaseMode = useRef(false);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const live = useMemo(() => (API_URL ? createLiveRecordService(createApiClient({ baseUrl: API_URL, getAccessToken: liveAccessToken })) : null), []);

  const refreshLive = useCallback(async (quiet = false) => {
    if (!live) return;
    if (!quiet) setLiveData(state => ({ ...state, status: databaseMode.current ? 'live' : 'connecting', message: '' }));
    try {
      const rows = await live.load();
      databaseMode.current = true;
      setRecords(serviceRef.current.replaceKinds(LIVE_KINDS, rows));
      setLiveData(state => ({ ...state, status: 'live', message: '', lastSynced: new Date().toISOString(), counts: { projects: rows.filter(r => r.kind === 'Project').length, tasks: rows.filter(r => r.kind === 'Task').length } }));
    } catch (error) {
      setLiveData(state => ({ ...state, status: 'error', message: errorText(error) }));
    }
  }, [live]);

  useEffect(() => {
    const preview = window.sessionStorage.getItem(BETA_PREVIEW_KEY);
    if (preview === 'administrator') { setRoleState('Administrator'); setPermissions(rolePermissions('Administrator')); }
    else if (preview === 'client' || preview === 'trade') { const r = preview === 'client' ? 'Client' : 'Trade'; setRoleState(r); setPermissions(rolePermissions(r)); }
    if (liveDataEnabled({ url: API_URL, preference: readLivePreference(), isDev: import.meta.env.DEV })) void refreshLive();
  }, [refreshLive]);

  const loadSamples = (seed: PlatformRecord[]) => { if (records.some(r => !service.isSample(r.id))) return; const next = createMockRecordService(seed); setService(next); setRecords(next.getRecords()); };
  const notify = (n: string) => setNotifications(old => [n, ...old]);
  const managed = (r: PlatformRecord) => Boolean(live) && databaseMode.current && isLiveKind(r.kind);

  const save = (r: PlatformRecord, keepOpen = false) => {
    if (!managed(r) || !live) {
      const { records: next, clearedSamples } = service.saveRecord(r);
      setRecords(next);
      if (clearedSamples) toast.success(`Sample ${r.kind.toLowerCase()} records removed — only your data is kept now.`);
      notify(`${r.kind} updated: ${r.title}`);
      if (!keepOpen) edit(null);
      return;
    }
    if (!r.remote) {
      // New database records: wait for the server, keep the form open on failure.
      setLiveData(state => ({ ...state, saving: true }));
      live.save(r, recordsRef.current)
        .then(async () => { toast.success(`${r.kind} saved to your Foresite database`); notify(`${r.kind} created: ${r.title}`); if (!keepOpen) edit(null); await refreshLive(true); })
        .catch(error => toast.error(`${r.kind} not saved: ${errorText(error)}`))
        .finally(() => setLiveData(state => ({ ...state, saving: false })));
      return;
    }
    // Existing database records update on screen straight away; quick repeated edits are combined.
    setRecords(service.saveRecord(r).records);
    if (!keepOpen) edit(null);
    const pending = timers.current.get(r.id);
    if (pending) clearTimeout(pending);
    timers.current.set(r.id, setTimeout(() => {
      timers.current.delete(r.id);
      live.save(r, recordsRef.current)
        .then(() => { if (!keepOpen) toast.success(`${r.kind} updated in your Foresite database`); notify(`${r.kind} updated: ${r.title}`); })
        .catch(error => toast.error(`${r.kind} change not saved: ${errorText(error)}`))
        .finally(() => { void refreshLive(true); });
    }, keepOpen ? 700 : 0));
  };

  const remove = (id: string) => {
    const record = records.find(r => r.id === id);
    setRecords(service.deleteRecord(id));
    if (record && managed(record) && record.remote && live) {
      live.remove(record)
        .then(() => toast.success(`${record.kind} deleted from your Foresite database`))
        .catch(error => toast.error(`${record.kind} not deleted: ${errorText(error)}`))
        .finally(() => { void refreshLive(true); });
    }
  };

  const create = (kind: RecordKind) => {
    const draft = makeRecord(kind, '');
    // In database mode, link new records to a real project rather than a sample name.
    const firstProject = databaseMode.current ? records.find(r => r.kind === 'Project') : undefined;
    const linked = firstProject && kind !== 'Project' ? { ...draft, project: firstProject.title } : draft;
    // Database records start without sample defaults (demo person, fixed date).
    edit(databaseMode.current && isLiveKind(kind) ? { ...linked, date: '', person: 'Unassigned', responsible: '', notified: '' } : linked);
  };

  const connectLiveData = () => { writeLivePreference('on'); void refreshLive(); };
  const disconnectLiveData = () => {
    writeLivePreference('off');
    databaseMode.current = false;
    setRecords(service.restoreSamples(LIVE_KINDS));
    setLiveData(state => ({ ...state, status: 'off', message: '', counts: { projects: 0, tasks: 0 } }));
  };

  const setRole = (r: Role) => { setRoleState(r); setPermissions(rolePermissions(r)); };
  return <Context.Provider value={{ records, loadSamples, role, setRole, permissions, setPermissions, save, remove, create, editing, edit, can: (m, a = 'View') => canUseModule(permissions, m, a), notifications, notify, dismissNotifications: () => setNotifications([]), isSample: service.isSample, liveData, connectLiveData, disconnectLiveData, refreshLiveData: () => { void refreshLive(); } }}>{children}</Context.Provider>;
}
export function usePlatform() { const value = useContext(Context); if (!value) throw new Error('PlatformProvider missing'); return value; }
export function useDemoIdentity() { const { role } = usePlatform(); return INITIAL_USERS.find(u => u.role === role) ?? INITIAL_USERS[0]; }
