import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BETA_PREVIEW_KEY } from '@/content/onboarding';
import { startDemoSession } from '@/lib/session';
import { checkTeamAccess } from '@/lib/team-access.functions';
import { TEAM_ACCESS_STORAGE_KEY, TEAM_ACCOUNT_EMAIL } from '@/lib/team-access';

export type TeamAccessState = 'checking' | 'trusted' | 'locked';

/** Asks the server whether this device holds a valid team token; never trusts the browser alone. */
export function useTeamAccess() {
  const check = useServerFn(checkTeamAccess);
  const [state, setState] = useState<TeamAccessState>('checking');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let token = '';
    try { token = window.localStorage.getItem(TEAM_ACCESS_STORAGE_KEY) ?? ''; } catch { token = ''; }
    if (!token) { setState('locked'); return; }
    setState('checking');
    check({ data: { token } })
      .then(result => { if (!active) return; if (!result.trusted) { try { window.localStorage.removeItem(TEAM_ACCESS_STORAGE_KEY); } catch { /* ignore */ } } setState(result.trusted ? 'trusted' : 'locked'); })
      .catch(() => { if (active) setState('locked'); });
    return () => { active = false; };
  }, [check, attempt]);
  return { state, refresh: () => setAttempt(value => value + 1) };
}

export function useEnterTeamWorkspace() {
  const navigate = useNavigate();
  return () => {
    window.sessionStorage.setItem(BETA_PREVIEW_KEY, 'true');
    startDemoSession(TEAM_ACCOUNT_EMAIL, false);
    void navigate({ to: '/app' });
  };
}

/** Rendered on the public sign-in page, but only shows anything on a verified team device. */
export function TeamQuickAccess() {
  const { state } = useTeamAccess();
  const enter = useEnterTeamWorkspace();
  if (state !== 'trusted') return null;
  return <div className="mb-6 flex flex-col items-center gap-2 rounded-lg border border-azure/40 bg-card p-4 text-center">
    <Button size="lg" onClick={enter}><Zap /> Enter beta workspace</Button>
    <p className="text-xs text-muted-foreground">Team device · mock-data environment</p>
  </div>;
}
