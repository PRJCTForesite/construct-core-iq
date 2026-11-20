import { useEffect, useLayoutEffect, useState } from 'react';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { guideForPath } from '@/content/workflow-guides';
import { usePlatform } from '@/components/platform/PlatformProvider';
import { replayForScope } from '@/lib/walkthrough';
import { ProgramWalkthrough, WalkthroughHelp, type ProgramStep } from './ProgramWalkthrough';

export function WorkflowGuide() {
  const router = useRouter();
  const path = useRouterState({ select: state => state.location.pathname.replace(/\/$/, '') });
  const { editing } = usePlatform();
  const [page, setPage] = useState<{ path: string; steps: ProgramStep[] }>();
  const [replay, setReplay] = useState<{ scope: string; token: string }>();
  const [navigating, setNavigating] = useState(false);
  useEffect(() => {
    const before = router.subscribe('onBeforeNavigate', event => {
      if (event.pathChanged) { setNavigating(true); setPage(undefined); setReplay(undefined); }
    });
    const resolved = router.subscribe('onResolved', () => setNavigating(false));
    return () => { before(); resolved(); };
  }, [router]);
  useLayoutEffect(() => {
    setPage(undefined);
    setReplay(undefined);
    if (editing || navigating) return;
    const guide = guideForPath(path); if (!guide) return;
    const collect = () => {
      const main = document.querySelector('main'); if (!main) return;
      const action = Array.from(main.querySelectorAll<HTMLElement>('button')).find(button => /^(New |Add |Create |Compose)/i.test(button.textContent?.trim() ?? '') && !button.hasAttribute('disabled'));
      const headings = Array.from(main.querySelectorAll<HTMLElement>('h2')).slice(0,3);
      const found: ProgramStep[] = [];
      if (action) found.push({id:'create',target:action,title:action.textContent?.trim() ?? 'Create record',text:/task/i.test(action.textContent ?? '') ? 'Click New Task to create work and assign an employee. Shared employee access is still a preview.' : `Click ${action.textContent?.trim()} to add a record, then follow the field prompts.`});
      headings.forEach((heading,index) => found.push({ id:`section:${heading.textContent}`, target:heading, title:heading.textContent ?? guide.title, text:guide.steps[index] ?? guide.steps[0] }));
      if (!found.length) { const heading = main.querySelector<HTMLElement>('h1'); if (heading) found.push({id:'overview',target:heading,title:guide.title,text:guide.steps[0]}); }
      setPage({ path, steps: found });
      return found.length > 0;
    }
    const observer = new MutationObserver(() => { if (collect()) observer.disconnect(); });
    const frame = requestAnimationFrame(() => {
      if (!collect()) observer.observe(document.body, { childList: true, subtree: true });
    });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [path, editing, navigating]);
  return <><WalkthroughHelp resetKey={path} label="Open tab guide" onYes={() => setReplay({ scope: path, token: String(Date.now()) })} />{!navigating && !editing && page?.path === path && <ProgramWalkthrough key={path} pageGuide scope={`page:${path}`} steps={page.steps} replay={replayForScope(path, replay)} />}</>;
}