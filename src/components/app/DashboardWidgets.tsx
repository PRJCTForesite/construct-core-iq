import { useEffect, useState, type ReactNode } from 'react';
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Eye, Minus, LayoutDashboard, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/services/authService';
import { defaultLayout, moveWidget, normaliseLayout, preferenceKey, type DashboardLayout, type WidgetId } from '@/lib/workspace-preferences';
import { cn } from '@/lib/utils';

export type DashboardWidget = { id: WidgetId; title: string; size?: 'small' | 'wide'; content: ReactNode };
function SortableWidget({ widget, editing, onHide }: { widget: DashboardWidget; editing: boolean; onHide: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id, disabled: !editing });
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} data-widget={widget.id} className={cn('relative min-w-0', widget.size === 'wide' ? 'md:col-span-2 xl:col-span-4' : widget.size === 'small' ? '' : 'md:col-span-2', isDragging && 'z-30')}>
    <div className={cn('relative rounded-xl', editing && 'outline outline-1 outline-azure/40', isDragging && 'dashboard-widget-lifted shadow-raised ring-2 ring-azure')}>
      <div inert={editing || undefined} className={cn(editing && !isDragging && 'dashboard-widget-edit')}>{widget.content}</div>
      {editing && <>
        <Button variant="ghost" className={cn('absolute inset-0 z-10 h-full w-full rounded-xl p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-azure select-none', isDragging ? 'cursor-grabbing' : 'cursor-grab')} aria-label={`Drag ${widget.title}`} title={`Move ${widget.title}`} {...attributes} {...listeners} />
        <Button variant="secondary" size="icon-xs" className="absolute -left-2 -top-2 z-20 rounded-full border border-border shadow-panel" aria-label={`Hide ${widget.title}`} title="Hide widget" onClick={onHide}><Minus /></Button>
      </>}
    </div>
  </div>;
}
export function DashboardWidgets({ widgets }: { widgets: DashboardWidget[] }) {
  const [layout, setLayout] = useState<DashboardLayout>(defaultLayout);
  const [saved, setSaved] = useState<DashboardLayout>(defaultLayout);
  const [editing, setEditing] = useState(false);
  const [storageKey, setStorageKey] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) return;
    const key = preferenceKey(user.id, 'dashboard'); setStorageKey(key);
    try { const restored = normaliseLayout(JSON.parse(localStorage.getItem(key) || 'null')); setLayout(restored); setSaved(restored); } catch { setStatus('Your default layout is ready.'); }
  }, []);
  const visible = layout.order.flatMap(id => { const widget = widgets.find(widget => widget.id === id); return widget && !layout.hidden.includes(id) ? [widget] : []; });
  function save() {
    try {
      if (!storageKey) throw new Error('No account');
      localStorage.setItem(storageKey, JSON.stringify(layout)); setSaved(layout); setEditing(false); setStatus('Layout saved for this account in this browser.');
    } catch { setStatus('Could not save your layout. Browser storage may be unavailable; try again.'); }
  }
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-3">
      <div><span className="text-sm font-medium">Your dashboard</span><p className="text-xs text-muted-foreground">{editing ? `${visible.length} visible widgets · browser-only preferences` : 'Sample operational figures · project health reflects session records'}</p></div>
      <div className="flex flex-wrap gap-2">
        {editing ? <><Button variant="ghost" size="icon-sm" aria-label="Reset dashboard layout" title="Reset to default" onClick={() => setLayout(defaultLayout())}><RotateCcw /></Button><Button variant="outline" size="sm" onClick={() => { setLayout(saved); setEditing(false); setStatus(''); }}><X /> Cancel</Button><Button size="sm" onClick={save}><Check /> Save layout</Button></> : <Button variant="outline" size="sm" disabled={!storageKey} onClick={() => { setEditing(true); setStatus(''); }}><LayoutDashboard /> Edit dashboard</Button>}
      </div>
    </div>
    {editing && layout.hidden.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Hidden widgets">{layout.hidden.map(id => <Button key={id} variant="outline" size="sm" onClick={() => setLayout(current => ({ ...current, hidden: current.hidden.filter(item => item !== id) }))}><Eye />{widgets.find(widget => widget.id === id)?.title}</Button>)}</div>}
    <p role="status" className={cn('text-xs text-muted-foreground', !status && 'sr-only')}>{status}</p>
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => { if (over && active.id !== over.id) setLayout(current => moveWidget(current, active.id as WidgetId, over.id as WidgetId)); }}>
      <SortableContext items={visible.map(widget => widget.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">{visible.map(widget => <SortableWidget key={widget.id} widget={widget} editing={editing} onHide={() => setLayout(current => ({ ...current, hidden: [...current.hidden, widget.id] }))} />)}</div>
      </SortableContext>
    </DndContext>
    {!visible.length && <p className="py-10 text-center text-sm text-muted-foreground">No widgets selected.</p>}
  </div>;
}