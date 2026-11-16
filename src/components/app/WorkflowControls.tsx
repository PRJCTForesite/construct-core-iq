import { useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, TriangleAlert, Clock, FileText, LayoutGrid, List, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { workflowHealth, documentType, type HealthState } from '@/content/workflow';

const healthStyles: Record<HealthState, string> = {
  'On Track': 'text-health-good bg-health-good/10 border-health-good/30',
  'Attention Required': 'text-health-attention bg-health-attention/10 border-health-attention/30',
  'Delayed': 'text-health-delayed bg-health-delayed/10 border-health-delayed/30',
  'Critically Delayed': 'text-health-critical bg-health-critical/10 border-health-critical/30',
};
export function HealthBadge({ status, severity, health }: { status?: string; severity?: string; health?: HealthState }) {
  const state = health ?? workflowHealth(status ?? '', severity);
  const Icon = state === 'On Track' ? CheckCircle2 : state === 'Attention Required' ? TriangleAlert : state === 'Delayed' ? Clock : AlertCircle;
  return <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs font-semibold ${healthStyles[state]}`}><Icon className="h-4 w-4 shrink-0"/>{state}</span>;
}
export function Openable({ children, onOpen, label, className = '' }: { children: ReactNode; onOpen: () => void; label: string; className?: string }) {
  return <div role="button" tabIndex={0} aria-label={label} className={`cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring hover:border-azure/50 ${className}`} onClick={e => { if ((e.target as HTMLElement).closest('button,input,select,textarea,a,[role=switch],[role=combobox]')) return; onOpen(); }} onKeyDown={e => { if (e.target === e.currentTarget && ['Enter', ' '].includes(e.key)) { e.preventDefault(); onOpen(); } }}>{children}</div>;
}
export type DocumentItem = { id: string; title: string; category: string; date: string; owner: string; size?: string };
export function DocumentBrowser({ items, onOpen }: { items: DocumentItem[]; onOpen: (id: string) => void }) {
  const [view, setView] = useState<'Preview' | 'List'>('Preview');
  return <div className="space-y-4"><div role="group" aria-label="Document view" className="flex gap-1">{(['Preview', 'List'] as const).map(v => <Button key={v} size="sm" variant={view === v ? 'secondary' : 'ghost'} aria-pressed={view === v} onClick={() => setView(v)}>{v === 'Preview' ? <LayoutGrid/> : <List/>}{v} View</Button>)}</div><div className={view === 'Preview' ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'divide-y divide-border'}>{items.map(d => <Button key={d.id} variant="ghost" aria-label={`Open ${d.title}`} onClick={() => onOpen(d.id)} className={view === 'Preview' ? 'block h-auto min-w-0 overflow-hidden whitespace-normal rounded-lg border border-border p-0 text-left' : 'flex h-auto w-full min-w-0 justify-start gap-3 whitespace-normal py-3 text-left'}>{view === 'Preview' ? <span className="flex aspect-[5/2] items-center justify-center border-b border-border bg-surface"><span className="flex items-center gap-3"><FileText className="h-10 w-10 text-azure"/><span className="text-xs font-semibold text-muted-foreground">{documentType(d.title,d.category)}</span></span></span> : <FileText className="h-6 w-6 shrink-0 text-azure"/>}<span className={`block min-w-0 flex-1 ${view === 'Preview' ? 'p-3' : ''}`}><span className="block break-words text-sm font-semibold">{d.title}</span><span className="mt-1 block text-xs text-muted-foreground">{documentType(d.title,d.category)} · {d.date}</span><span className="mt-1 block text-xs text-muted-foreground">Owner: {d.owner}{view === 'List' ? ` · ${d.size ?? 'Size not supplied'}` : ''}</span></span>{view === 'List' && <ChevronRight className="h-4 w-4 shrink-0"/>}</Button>)}</div>{!items.length && <p className="py-6 text-sm text-muted-foreground">No shared documents match.</p>}</div>;
}
export function ReadDetail({ title, children, onClose }: { title: string | null; children: ReactNode; onClose: () => void }) {
  return <Dialog open={Boolean(title)} onOpenChange={v => !v && onClose()}><DialogContent className="max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>{children}</DialogContent></Dialog>;
}