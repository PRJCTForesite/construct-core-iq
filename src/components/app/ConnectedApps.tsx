import { useState } from 'react';
import { ExternalLink, FileText, Link2, LockKeyhole, Mail, Search, Wallet } from 'lucide-react';
import { APP_CATEGORIES, appsForCategory, type AppCategory, type ConnectedApp } from '@/content/connected-apps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ICONS = { Communications: Mail, Financials: Wallet, Documents: FileText };

function AppSetup({ app, onClose }: { app: ConnectedApp; onClose: () => void }) {
  return <section aria-label={`${app.name} connection setup`} className="space-y-4">
    <Button variant="ghost" size="sm" onClick={onClose}>← All apps</Button>
    <div><h3 className="text-lg font-semibold">Connect {app.name}</h3><p className="mt-2 text-sm text-muted-foreground">{app.data}</p></div>
    <div role="status" className="flex gap-3 border-y border-border py-4"><LockKeyhole className="h-5 w-5 shrink-0 text-construction"/><div><p className="text-sm font-semibold">Not connected · setup required</p><p className="mt-1 text-sm text-muted-foreground">Foresite currently has demo sign-in only. Your personal account cannot be linked until verified sign-in and secure account storage are connected to your external service.</p></div></div>
    <ol className="list-decimal space-y-3 pl-5 text-sm text-secondary-foreground">
      <li>Connect Foresite’s real sign-in and secure personal-account storage.</li>
      <li>{app.personalConnector ? 'Create and link the provider’s developer registration in workspace App User Connectors settings, with offline access enabled.' : 'Complete a dedicated per-customer consent integration with this provider. A shared company connection is not used for personal accounts.'}</li>
      <li>Authorise your account, then verify an account read before showing it as connected.</li>
    </ol>
    {app.personalConnector && <p className="break-words text-xs text-muted-foreground">Provider callback: https://connector-gateway.lovable.dev/api/v1/app-users/oauth2/callback</p>}
    <Button asChild variant="outline" size="sm"><a href={app.setupUrl} target="_blank" rel="noopener noreferrer">Provider setup <ExternalLink className="h-4 w-4"/></a></Button>
    <p className="text-xs text-muted-foreground">No account access has been granted. No messages, files or financial records have been imported.</p>
  </section>;
}

export function ConnectedAppsDirectory({ category = 'All' }: { category?: AppCategory | 'All' }) {
  const [filter, setFilter] = useState<AppCategory | 'All'>(category);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ConnectedApp | null>(null);
  if (selected) return <AppSetup app={selected} onClose={() => setSelected(null)}/>;
  const apps = appsForCategory(category === 'All' ? filter : category, query);
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">0 connected accounts</p><span className="text-xs text-muted-foreground">Personal connections · setup required</span></div>
    {category === 'All' && <Tabs value={filter} onValueChange={value => { if (value === 'All' || APP_CATEGORIES.some(item => item === value)) setFilter(value as AppCategory | 'All'); }}><TabsList className="flex h-auto flex-wrap justify-start">{(['All', ...APP_CATEGORIES] as const).map(value => <TabsTrigger key={value} value={value}>{value}</TabsTrigger>)}</TabsList></Tabs>}
    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input aria-label="Search connected apps" placeholder="Search apps…" value={query} onChange={event => setQuery(event.target.value)} className="pl-9"/></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{apps.map(app => {
      const Icon = ICONS[app.category];
      return <article key={app.id} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-4">
        <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-surface text-azure"><Icon className="h-5 w-5"/></span><div className="min-w-0"><h3 className="text-sm font-semibold">{app.name}</h3><p className="mt-1 text-xs text-muted-foreground">{app.category}</p></div></div>
        <p className="mt-4 flex-1 text-sm text-secondary-foreground">{app.summary}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3"><span className="text-xs text-muted-foreground">Not connected</span><Button size="sm" variant="outline" onClick={() => setSelected(app)} aria-label={`Set up ${app.name}`}><Link2 className="h-3.5 w-3.5"/> Set up</Button></div>
      </article>;
    })}</div>
    {apps.length === 0 && <p role="status" className="py-8 text-center text-sm text-muted-foreground">No apps match your search.</p>}
  </div>;
}

export function ConnectAppsButton({ category }: { category: AppCategory }) {
  return <Dialog><DialogTrigger asChild><Button variant="outline" size="sm"><Link2 className="h-4 w-4"/> Connect Apps</Button></DialogTrigger><DialogContent className="max-h-[88dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto"><DialogHeader><DialogTitle>{category} apps</DialogTitle><DialogDescription>Personal accounts · no services connected yet.</DialogDescription></DialogHeader><ConnectedAppsDirectory category={category}/></DialogContent></Dialog>;
}