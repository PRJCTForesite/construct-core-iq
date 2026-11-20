import { useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { guideForPath } from '@/content/workflow-guides';
import { usePlatform } from '@/components/platform/PlatformProvider';
import { ProgramWalkthrough, WalkthroughHelp, type ProgramStep } from './ProgramWalkthrough';

export function WorkflowGuide() {
  const path = useRouterState({ select: state => state.location.pathname.replace(/\/$/, '') });
  const { editing } = usePlatform();
  const [steps, setSteps] = useState<ProgramStep[]>([]);
  const [replay, setReplay] = useState<string>();
  useEffect(() => {
    if (editing) { setSteps([]); return; }
    const guide = guideForPath(path); if (!guide) return;
    const timer = window.setTimeout(() => {
      const main = document.querySelector('main'); if (!main) return;
      const action = Array.from(main.querySelectorAll<HTMLElement>('button')).find(button => /^(New |Add |Create |Compose)/i.test(button.textContent?.trim() ?? '') && !button.hasAttribute('disabled'));
      const headings = Array.from(main.querySelectorAll<HTMLElement>('h2')).slice(0,3);
      const found: ProgramStep[] = [];
      if (action) found.push({id:'create',target:action,title:action.textContent?.trim() ?? 'Create record',text:/task/i.test(action.textContent ?? '') ? 'Click New Task to create work and assign an employee. Shared employee access is still a preview.' : `Click ${action.textContent?.trim()} to add a record, then follow the field prompts.`});
      headings.forEach((heading,index) => found.push({ id:`section:${heading.textContent}`, target:heading, title:heading.textContent ?? guide.title, text:guide.steps[index] ?? guide.steps[0] }));
      if (!found.length) { const heading = main.querySelector<HTMLElement>('h1'); if (heading) found.push({id:'overview',target:heading,title:guide.title,text:guide.steps[0]}); }
      setSteps(found);
    },100);
    return () => window.clearTimeout(timer);
  }, [path, editing]);
  return <><WalkthroughHelp label="Open tab guide" onYes={() => setReplay(String(Date.now()))} />{!editing && <ProgramWalkthrough scope={`page:${path}`} steps={steps} replay={replay} />}</>;
}