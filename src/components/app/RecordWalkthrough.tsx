import { useEffect, useMemo, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { ProgramWalkthrough, WalkthroughHelp, type ProgramStep } from './ProgramWalkthrough';

const FIELD_HINTS: Record<string,string> = {
  'Title / name': 'Give this record a short, recognisable name.', 'Subject / title': 'Summarise the conversation.',
  Project: 'Choose the project this record belongs to.', Status: 'Choose its current stage.',
  'Assign user, trade or supervisor': 'Choose who is responsible for the work. Employee access is still a preview.',
  'Assigned party': 'Type a name or use + to choose an employee.', Date: 'Choose the due or scheduled date.',
  'Weight (%)': 'Set how much this task contributes to project progress.', 'Progress (%)': 'Enter how much of the work is complete.',
  Dependencies: 'List work that must finish first.', 'Responsible parties': 'Name anyone else responsible.', 'Notified parties': 'List who should be kept informed. This does not send notifications yet.',
  Email: 'Enter the contact email.', Phone: 'Enter the contact phone number.', 'Amount (AUD)': 'Enter the value in Australian dollars.',
  Notes: 'Add any extra details the team needs.', 'Message / communication details': 'Write the message or record what was discussed.',
  Category: 'Choose the document category.', 'Current revision': 'Enter the latest revision reference.', Tags: 'Add words that make this document easier to find.',
  'Share With Client': 'Turn on only for documents the client should see.', 'Client document category': 'Choose where the shared document appears in the client portal.',
  'Event type': 'Choose what is happening.', 'Trade type': 'Enter the trade specialty.', 'Insurance expiry': 'Choose the insurance expiry date.', 'Licence expiry': 'Choose the licence expiry date.', Induction: 'Record induction status.',
};
export function RecordWalkthrough({ formRef, kind, scanKey }: { formRef: RefObject<HTMLFormElement | null>; kind: string; scanKey: string }) {
  const [steps, setSteps] = useState<ProgramStep[]>([]);
  const [helps, setHelps] = useState<{id:string;target:HTMLElement}[]>([]);
  const [replay, setReplay] = useState<string>();
  const [startAt, setStartAt] = useState('');
  const orderedSteps = useMemo(() => {
    const index = steps.findIndex(step => step.id === startAt);
    return index > 0 ? [...steps.slice(index), ...steps.slice(0,index)] : steps;
  }, [steps, startAt]);
  useEffect(() => {
    const form = formRef.current; if (!form) return;
    const elements = Array.from(form.querySelectorAll<HTMLElement>('input:not([type="hidden"]),textarea,[role="combobox"],[role="switch"]'));
    const hosts: HTMLElement[] = []; const wrappers: HTMLElement[] = []; const found: ProgramStep[] = [];
    for (const element of elements) {
      const wrapper = element.closest<HTMLElement>('label') ?? element.parentElement;
      if (!wrapper || wrappers.includes(wrapper)) continue;
      const label = element.getAttribute('aria-label') ?? wrapper.textContent?.trim().split('\n')[0]?.trim() ?? 'Details';
      const id = label.replace(/\s+/g,'-').toLowerCase();
      if (found.some(step => step.id === id)) continue;
      wrapper.classList.add('relative');
      const host = document.createElement('span'); host.className = 'absolute right-0 top-0 z-10'; wrapper.appendChild(host); hosts.push(host); wrappers.push(wrapper);
      found.push({ id, target: element, title: label, text: FIELD_HINTS[label] ?? `Enter or choose the ${label.toLowerCase()}.` });
    }
    const save = form.querySelector<HTMLElement>('button[type="submit"]');
    if (save) found.push({ id:'save', target:save, title:'Save', text:'Save the record for this session. Real shared storage is not connected yet.' });
    setSteps(found); setHelps(hosts.map((target,index) => ({ id: found[index]?.id ?? '', target })));
    return () => hosts.forEach(host => host.remove());
  }, [formRef, kind, scanKey]);
  return <>{helps.map(help => createPortal(<WalkthroughHelp label={`Help with ${steps.find(step => step.id === help.id)?.title ?? 'field'}`} onYes={() => { setStartAt(help.id); setReplay(String(Date.now())); }} />,help.target,help.id))}<ProgramWalkthrough scope={`form:${kind}`} steps={orderedSteps} replay={replay} /></>;
}