import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Eye, Minus, MoreHorizontal, LayoutDashboard, RotateCcw, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/services/authService';
import { defaultLayout, moveWidget, normaliseLayout, preferenceKey, type DashboardLayout, type WidgetId, type WidgetOptions, type WidgetSize, type WidgetColour } from '@/lib/workspace-preferences';
import { cn } from '@/lib/utils';

export type DashboardWidget = { id: WidgetId; title: string; size?: 'small' | 'wide'; content: ReactNode };
const COLOURS: {id:WidgetColour; label:string; swatch:string}[] = [{id:'default',label:'White / default',swatch:'bg-card'}, {id:'navy',label:'Deep navy',swatch:'bg-primary'}, {id:'slate',label:'Slate',swatch:'bg-secondary-foreground'}, {id:'azure',label:'Azure blue',swatch:'bg-azure'}, {id:'orange',label:'Construction orange',swatch:'bg-construction'}];
function SortableWidget({ widget, editing, options, onOptions, onHide }: { widget: DashboardWidget; editing: boolean; options: WidgetOptions; onOptions: (options: WidgetOptions) => void; onHide: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id, disabled: !editing });
  const size = options.size ?? (widget.size === 'wide' ? 'large' : widget.size === 'small' ? 'small' : 'medium');
  const measure = useRef<HTMLDivElement>(null);
  const [rows,setRows] = useState(1);
  useLayoutEffect(() => {
    const element = measure.current; if (!element) return;
    const observer = new ResizeObserver(() => setRows(Math.ceil((element.getBoundingClientRect().height + 16) / 24)));
    observer.observe(element); return () => observer.disconnect();
  }, []);
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, gridRowEnd: `span ${rows}` }} data-widget={widget.id} data-size={size} data-colour={options.colour ?? 'default'} className={cn('relative min-w-0', size === 'large' ? 'md:col-span-2 xl:col-span-4' : size === 'small' ? '' : 'md:col-span-2', isDragging && 'z-30')}>
    <div ref={measure} className={cn('relative rounded-xl widget-preset', `widget-colour-${options.colour ?? 'default'}`, editing && 'outline outline-1 outline-azure/40', isDragging && 'dashboard-widget-lifted shadow-raised ring-2 ring-azure')}>
      <div inert={editing || undefined} className={cn('widget-content', size === 'small' ? 'max-h-48 overflow-auto' : size === 'medium' ? 'max-h-96 overflow-auto' : 'max-h-[40rem] overflow-auto', editing && !isDragging && 'dashboard-widget-edit')}>{widget.content}</div>
      {editing && <>
        <Button variant="ghost" className={cn('absolute inset-0 z-10 h-full w-full rounded-xl p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-azure select-none', isDragging ? 'cursor-grabbing' : 'cursor-grab')} aria-label={`Drag ${widget.title}`} title={`Move ${widget.title}`} {...attributes} {...listeners} />
        <Button variant="secondary" size="icon-xs" className="absolute -left-2 -top-2 z-20 rounded-full border border-border shadow-panel" aria-label={`Hide ${widget.title}`} title="Hide widget" onClick={onHide}><Minus /></Button>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="secondary" size="icon-xs" className="absolute -right-2 -top-2 z-20 rounded-full border border-border shadow-panel" aria-label={`Options for ${widget.title}`} title="Widget options"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Widget size</DropdownMenuLabel><DropdownMenuRadioGroup value={size} onValueChange={value => onOptions({...options,size:value as WidgetSize})}>{(['small','medium','large'] as const).map(value => <DropdownMenuRadioItem key={value} value={value}>{value.charAt(0).toUpperCase()+value.slice(1)}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup>
          <DropdownMenuSeparator /><DropdownMenuLabel>Background colour</DropdownMenuLabel><DropdownMenuRadioGroup value={options.colour ?? 'default'} onValueChange={value => onOptions({...options,colour:value as WidgetColour})}>{COLOURS.map(colour => <DropdownMenuRadioItem key={colour.id} value={colour.id}><span className={cn('h-3 w-3 rounded-full border border-border',colour.swatch)} />{colour.label}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup>
          <DropdownMenuSeparator /><DropdownMenuItem onSelect={() => onOptions({})}><RotateCcw /> Reset this widget</DropdownMenuItem><DropdownMenuItem onSelect={onHide}><Eye /> Hide widget</DropdownMenuItem>
        </DropdownMenuContent></DropdownMenu>
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
      const upgraded = normaliseLayout(layout);
      localStorage.setItem(storageKey, JSON.stringify(upgraded)); setLayout(upgraded); setSaved(upgraded); setEditing(false); setStatus('Layout saved for this account in this browser.');
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
        <div className="grid grid-flow-row-dense auto-rows-[8px] grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">{visible.map(widget => <SortableWidget key={widget.id} widget={widget} editing={editing} options={layout.options?.[widget.id] ?? {}} onOptions={options => setLayout(current => ({...current,options:{...current.options,[widget.id]:options}}))} onHide={() => setLayout(current => ({ ...current, hidden: [...current.hidden, widget.id] }))} />)}</div>
      </SortableContext>
    </DndContext>
    {!visible.length && <p className="py-10 text-center text-sm text-muted-foreground">No widgets selected.</p>}
  </div>;
}