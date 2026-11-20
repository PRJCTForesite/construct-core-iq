import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouterState } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, CircleHelp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { guideForPath } from '@/content/workflow-guides';
import { preferenceKey } from '@/lib/workspace-preferences';
import { authService } from '@/lib/services/authService';

export function WorkflowGuide() {
  const path = useRouterState({ select: state => state.location.pathname.replace(/\/$/, '') });
  const guide = guideForPath(path);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    setStep(0); setOpen(false); setKey(null);
    const user = authService.getCurrentUser();
    if (!guide || !user) return;
    const storageKey = preferenceKey(user.id, `guide:${guide.key}`); setKey(storageKey);
    try { setOpen(localStorage.getItem(storageKey) !== 'seen'); } catch { /* Help remains available if storage is blocked. */ }
  }, [path, guide?.key]);
  if (!guide) return null;
  function dismiss() { setOpen(false); if (key) { try { localStorage.setItem(key, 'seen'); } catch { /* No record or account data is affected. */ } } }
  return <>
    <Button variant="ghost" size="icon-sm" title="Tab guide" aria-label="Open tab guide" onClick={() => { setStep(0); setOpen(true); }}><CircleHelp /></Button>
    {open && createPortal(<aside role="dialog" aria-modal="false" aria-label={guide.title} className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-border bg-card p-5 text-card-foreground shadow-panel">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-azure">Tab guide · {step + 1} of 3</p><h2 className="mt-1 text-base font-semibold">{guide.title}</h2></div><Button variant="ghost" size="icon-xs" aria-label="Close tab guide" title="Close guide" onClick={dismiss}><X /></Button></div>
      <p className="my-4 text-sm leading-relaxed text-muted-foreground">{guide.steps[step]}</p>
      <div className="flex items-center justify-between gap-2"><Button variant="ghost" size="sm" onClick={dismiss}>Skip guide</Button><div className="flex gap-2">{step > 0 && <Button variant="outline" size="icon-sm" aria-label="Previous guide step" title="Previous step" onClick={() => setStep(current => current - 1)}><ArrowLeft /></Button>}<Button size="sm" onClick={() => step === 2 ? dismiss() : setStep(current => current + 1)}>{step === 2 ? 'Got it' : 'Next'}{step < 2 && <ArrowRight />}</Button></div></div>
    </aside>, document.body)}
  </>;
}