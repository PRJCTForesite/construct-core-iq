import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CircleHelp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/services/authService';
import { recordShown, unseenSteps, walkthroughKey } from '@/lib/walkthrough';

export type ProgramStep = { id: string; target: HTMLElement; title: string; text: string };
export function ProgramWalkthrough({ scope, steps, replay, onClose }: { scope: string; steps: ProgramStep[]; replay?: string | undefined; onClose?: () => void }) {
  const [queue, setQueue] = useState<ProgramStep[]>([]);
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState<{left:number;top:number; width:number}>();
  const tip = useRef<HTMLDivElement>(null);
  const seen = useRef<string[]>([]);
  const key = useRef('');
  const current = queue[index];
  useEffect(() => {
    const account = authService.getCurrentUser();
    if (!account) return;
    key.current = walkthroughKey(account.id, scope);
    try { const value = JSON.parse(localStorage.getItem(key.current) || '[]'); seen.current = Array.isArray(value) ? value.filter(id => typeof id === 'string') : []; } catch { seen.current = []; }
    setQueue(replay ? steps : unseenSteps(steps, seen.current)); setIndex(0);
  }, [scope, steps, replay]);
  useEffect(() => {
    if (!current) return;
    seen.current = recordShown(seen.current, current.id);
    try { localStorage.setItem(key.current, JSON.stringify(seen.current)); } catch { /* Browser-only preference. */ }
    current.target.classList.add('program-walkthrough-target');
    current.target.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    return () => current.target.classList.remove('program-walkthrough-target');
  }, [current]);
  useLayoutEffect(() => {
    if (!current) return;
    function place() {
      if (!current) return;
      const rect = current.target.getBoundingClientRect();
      const dialog = current.target.closest<HTMLElement>('[data-record-form-dialog]');
      const bounds = dialog?.getBoundingClientRect();
      const width = Math.min(300, (bounds?.width ?? innerWidth) - 32);
      const height = tip.current?.offsetHeight ?? 180;
      let left = Math.max(16, Math.min(rect.left, innerWidth - width - 16));
      let top = rect.bottom + 10;
      if (top + height > innerHeight - 16) top = Math.max(16, rect.top - height - 10);
      if (bounds && dialog) {
        left = Math.max(bounds.left + 12, Math.min(left, bounds.right - width - 12));
        top = Math.max(bounds.top + 12, Math.min(top, bounds.bottom - height - 12));
      }
      setPosition({left: left - (bounds?.left ?? 0), top: top - (bounds?.top ?? 0) + (dialog?.scrollTop ?? 0), width});
    }
    place(); window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    const observer = new ResizeObserver(place); if (tip.current) observer.observe(tip.current);
    return () => { observer.disconnect(); window.removeEventListener('resize',place); window.removeEventListener('scroll',place,true); };
  }, [current]);
  if (!current) return null;
  const container = current.target.closest<HTMLElement>('[data-record-form-dialog]') ?? document.body;
  function close() { setQueue([]); onClose?.(); }
  return createPortal(<div ref={tip} role="dialog" aria-modal="false" aria-label="Program walkthrough" style={{ ...position, position: container === document.body ? 'fixed' : 'absolute', visibility: position ? 'visible' : 'hidden' }} className="z-[70] rounded-lg border border-azure/40 bg-card p-4 text-card-foreground shadow-raised">
    <div className="flex items-start justify-between gap-2"><div><p className="text-xs font-medium text-azure">Program walkthrough · {index + 1}/{queue.length}</p><h3 className="mt-1 text-sm font-semibold">{current.title}</h3></div><Button type="button" variant="ghost" size="icon-xs" title="Close walkthrough" aria-label="Close walkthrough" onClick={close}><X /></Button></div>
    <p className="my-3 text-xs leading-relaxed text-muted-foreground">{current.text}</p>
    <div className="flex justify-between gap-2"><Button type="button" variant="ghost" size="sm" onClick={() => { seen.current = recordShown(seen.current, current.id); const all = [...new Set([...seen.current, ...queue.map(step => step.id)])]; try { localStorage.setItem(key.current,JSON.stringify(all)); } catch {} close(); }}>Skip walkthrough</Button><Button type="button" size="sm" onClick={() => index + 1 < queue.length ? setIndex(index + 1) : close()}>{index + 1 < queue.length ? 'Next' : 'Done'}</Button></div>
  </div>, container);
}

export function WalkthroughHelp({ onYes, label = 'Page walkthrough' }: { onYes: () => void; label?: string }) {
  const [ask, setAsk] = useState(false);
  return <span className="relative inline-flex"><Button type="button" variant="ghost" size="icon-xs" title={label} aria-label={label} onClick={() => setAsk(value => !value)}><CircleHelp /></Button>{ask && <span role="dialog" aria-label="Walkthrough confirmation" className="absolute right-0 top-full z-[80] mt-1 w-56 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-panel"><span className="block text-xs font-medium">Do you need a page walkthrough?</span><span className="mt-2 flex justify-end gap-2"><Button type="button" size="sm" variant="ghost" onClick={() => setAsk(false)}>No</Button><Button type="button" size="sm" onClick={() => {setAsk(false);onYes();}}>Yes</Button></span></span>}</span>;
}