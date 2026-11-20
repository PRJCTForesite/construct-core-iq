import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Link2, LockKeyhole, Search } from 'lucide-react';
import { categoriesForScope, visibleCategoryApps, type AppCategory, type ConnectedApp, type DirectoryCategory } from '@/content/connected-apps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function AppLogo({ app }: { app: ConnectedApp }) {
  const [failed, setFailed] = useState(false);
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-surface text-azure">{app.logo && !failed ? <img src={app.logo} alt={`${app.name} logo`} width={32} height={32} className="h-8 w-8 object-contain" loading="lazy" onError={() => setFailed(true)}/> : <span className="text-sm font-semibold" aria-label={app.name}>{app.name.slice(0, 2).toUpperCase()}</span>}</span>;
}

function AppSetup({ app, onClose }: { app: ConnectedApp; onClose: () => void }) {
  return <section aria-label={`${app.name} connection setup`} className="space-y-4">
    <Button variant="ghost" size="sm" onClick={onClose}>← All apps</Button>
    <div className="flex items-start gap-3"><AppLogo app={app}/><div><h3 className="text-lg font-semibold">Connect {app.name}</h3><p className="mt-2 text-sm text-muted-foreground">{app.data}</p></div></div>
    <div role="status" className="flex gap-3 border-y border-border py-4"><LockKeyhole className="h-5 w-5 shrink-0 text-construction"/><div><p className="text-sm font-semibold">Not connected · awaiting account setup</p><p className="mt-1 text-sm text-muted-foreground">Foresite currently has demo sign-in only. Personal connections are unavailable while the external account service is being reviewed. No account access is requested here.</p></div></div>
    <ol className="list-decimal space-y-3 pl-5 text-sm text-secondary-foreground">
      <li>Connect Foresite’s real sign-in and secure personal-account storage.</li>
      <li>Complete this provider’s account consent setup once Foresite’s external account service is ready. A shared company connection is not used for personal accounts.</li>
      <li>Authorise your account, then verify an account read before showing it as connected.</li>
    </ol>
    <Button asChild variant="outline" size="sm"><a href={app.setupUrl} target="_blank" rel="noopener noreferrer">Provider setup <ExternalLink className="h-4 w-4"/></a></Button>
    <p className="text-xs text-muted-foreground">No account access has been granted. No messages, files or financial records have been imported.</p>
  </section>;
}

export function ConnectedAppsDirectory({ category = 'All' }: { category?: AppCategory | 'All' }) {
  const [filter, setFilter] = useState<DirectoryCategory | 'All'>('All');
  const [expanded, setExpanded] = useState<DirectoryCategory[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ConnectedApp | null>(null);
  if (selected) return <AppSetup app={selected} onClose={() => setSelected(null)}/>;
  const availableCategories = categoriesForScope(category);
  const groups = (filter === 'All' ? availableCategories : availableCategories.filter(group => group === filter)).map(group => ({ category: group, ...visibleCategoryApps(group, query, expanded.includes(group)) })).filter(group => group.total > 0);
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">0 connected accounts</p><span className="text-xs text-muted-foreground">Personal connections · setup required</span></div>
    <div className="max-w-sm"><Select value={filter} onValueChange={value => { if (value === 'All' || availableCategories.some(item => item === value)) setFilter(value as DirectoryCategory | 'All'); }}><SelectTrigger aria-label="App category" className="w-full"><SelectValue placeholder="All categories"/></SelectTrigger><SelectContent><SelectItem value="All">All categories</SelectItem>{availableCategories.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input aria-label="Search connected apps" placeholder="Search apps…" value={query} onChange={event => setQuery(event.target.value)} className="pl-9"/></div>
    {groups.map(group => <section key={group.category} aria-label={group.category} className="space-y-3 border-t border-border pt-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-base font-semibold">{group.category}</h3><span className="text-xs text-muted-foreground">{query.trim() ? `${group.total} matches` : 'Most popular'}</span></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{group.apps.map(app => {
      return <article key={app.id} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-4">
        <div className="flex items-start gap-3"><AppLogo app={app}/><div className="min-w-0"><h4 className="break-words text-sm font-semibold">{app.name}</h4><p className="mt-1 text-xs text-muted-foreground">{group.category}</p></div></div>
        <p className="mt-4 flex-1 text-sm text-secondary-foreground">{app.summary}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3"><span className="text-xs text-muted-foreground">Not connected</span><Button size="sm" variant="outline" onClick={() => setSelected(app)} aria-label={`Set up ${app.name}`}><Link2 className="h-3.5 w-3.5"/> Set up</Button></div>
      </article>;
    })}</div>{group.total > 5 && !query.trim() && <Button variant="ghost" size="sm" aria-label={`${expanded.includes(group.category) ? 'See less' : 'See more'} ${group.category}`} onClick={() => setExpanded(current => current.includes(group.category) ? current.filter(item => item !== group.category) : [...current, group.category])}>{expanded.includes(group.category) ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}{expanded.includes(group.category) ? 'See less' : `See more (${group.total - 5})`}</Button>}</section>)}
    {groups.length === 0 && <p role="status" className="py-8 text-center text-sm text-muted-foreground">No apps match your search.</p>}
  </div>;
}

export function ConnectAppsButton({ category }: { category: AppCategory }) {
  return <Dialog><DialogTrigger asChild><Button variant="outline" size="sm"><Link2 className="h-4 w-4"/> Connect Apps</Button></DialogTrigger><DialogContent className="max-h-[88dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto"><DialogHeader><DialogTitle>{category} apps</DialogTitle><DialogDescription>Personal accounts · no services connected yet.</DialogDescription></DialogHeader><ConnectedAppsDirectory category={category}/></DialogContent></Dialog>;
}