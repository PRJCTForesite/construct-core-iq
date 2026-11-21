import { Database, RefreshCw, Unplug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pill, type Tone } from '@/components/app/primitives';
import { usePlatform } from './PlatformProvider';
import type { LiveDataStatus } from './platform-context';

const LABEL: Record<LiveDataStatus, { text: string; tone: Tone }> = {
  unconfigured: { text: 'Not set up', tone: 'muted' },
  off: { text: 'Sample data', tone: 'muted' },
  connecting: { text: 'Connecting…', tone: 'info' },
  live: { text: 'Live database', tone: 'good' },
  error: { text: 'Cannot reach database', tone: 'bad' },
};
const time = (iso: string | null) => (iso ? new Date(iso).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }) : '');

/** One-line status shown above the Projects and Tasks lists. */
export function LiveDataNotice() {
  const { liveData, refreshLiveData } = usePlatform();
  if (liveData.status === 'unconfigured' || liveData.status === 'off') return null;
  const label = LABEL[liveData.status];
  return (
    <div role="status" className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground">
      <Database className="h-4 w-4 shrink-0" aria-hidden="true" />
      <Pill tone={label.tone}>{label.text}</Pill>
      <span className="min-w-0 flex-1 basis-48">
        {liveData.status === 'live' && `Projects and tasks come from your Foresite database${liveData.lastSynced ? ` · updated ${time(liveData.lastSynced)}` : ''}.`}
        {liveData.status === 'connecting' && 'Loading projects and tasks from your Foresite database.'}
        {liveData.status === 'error' && `${liveData.message} ${liveData.lastSynced ? 'Showing the last loaded records.' : 'Showing sample records instead.'}`}
      </span>
      {liveData.status !== 'connecting' && <Button size="sm" variant="ghost" onClick={refreshLiveData}><RefreshCw /> Refresh</Button>}
    </div>
  );
}

/** Settings panel: connect or disconnect this device from the Foresite database. */
export function LiveDataPanel() {
  const { liveData, connectLiveData, disconnectLiveData, refreshLiveData } = usePlatform();
  const label = LABEL[liveData.status];
  const connected = liveData.status === 'live' || liveData.status === 'connecting' || (liveData.status === 'error' && Boolean(liveData.lastSynced));
  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-semibold">Foresite database</h2>
        <Pill tone={label.tone}>{label.text}</Pill>
      </div>
      <p className="text-sm text-muted-foreground">Projects and tasks can load from and save to your Foresite database. Every other area keeps using sample data until it is connected.</p>
      {liveData.status === 'unconfigured' ? (
        <p className="text-sm text-muted-foreground">No server address is set for this site yet.</p>
      ) : (
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_minmax(0,1fr)]">
          <dt className="text-muted-foreground">Server address</dt><dd className="break-all font-medium">{liveData.baseUrl}</dd>
          {liveData.status === 'live' && <><dt className="text-muted-foreground">Loaded</dt><dd className="font-medium">{liveData.counts.projects} {liveData.counts.projects === 1 ? 'project' : 'projects'} · {liveData.counts.tasks} {liveData.counts.tasks === 1 ? 'task' : 'tasks'}{liveData.lastSynced ? ` · ${time(liveData.lastSynced)}` : ''}</dd></>}
          {liveData.status === 'error' && <><dt className="text-muted-foreground">Problem</dt><dd className="font-medium text-destructive">{liveData.message}</dd></>}
        </dl>
      )}
      {liveData.status !== 'unconfigured' && (
        <div className="flex flex-wrap gap-2">
          {connected
            ? <><Button onClick={refreshLiveData} disabled={liveData.status === 'connecting'}><RefreshCw /> Refresh now</Button><Button variant="outline" onClick={disconnectLiveData}><Unplug /> Use sample data on this device</Button></>
            : <Button onClick={connectLiveData}><Database /> Connect this device</Button>}
        </div>
      )}
      {liveData.status === 'error' && (
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Check the server is running on the computer you are using.</li>
          <li>The server must allow this website's address (its CORS setting).</li>
          <li>If your browser asks to access devices on your network, choose Allow.</li>
        </ul>
      )}
    </div>
  );
}
