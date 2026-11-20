import { useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { CircleHelp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProgramWalkthrough, type ProgramStep } from './ProgramWalkthrough';

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
const FIELD_DETAILS: Record<string, string> = {
  'Title / name': 'Use a name that makes sense in a list, such as “Kitchen cabinetry change”.',
  'Subject / title': 'Include the topic and location so the conversation is easy to recognise later.',
  Project: 'Check the project before saving so the record appears with the right job.',
  Status: 'Keep this up to date as the work moves forward; choose from the available stages.',
  'Assign user, trade or supervisor': 'Select the person handling the next action. This demo does not send them an invitation or notification.',
  'Assigned party': 'The + picker lists available employees; typing lets you enter another name.',
  Date: 'Use the date the action is due or the event takes place, rather than today unless appropriate.',
  'Weight (%)': 'Higher-weight tasks contribute more to the project’s overall progress. Editing an existing task’s weight updates the session immediately.',
  'Progress (%)': 'Use 0 for not started and 100 for fully complete.',
  Dependencies: 'For example, painting may need plastering to be finished first.',
  'Responsible parties': 'Include supporting people as well as the main assigned person.',
  'Notified parties': 'These names are recorded for reference only; automatic notifications are not connected.',
  Email: 'Check the address spelling before saving the contact.',
  Phone: 'Include the area or country code where needed.',
  'Amount (AUD)': 'Enter a number without a dollar sign; the amount is recorded in AUD.',
  Notes: 'Include useful context, decisions or next actions. Do not enter passwords or payment credentials.',
  'Message / communication details': 'Saving records the discussion only; it does not send the message.',
  Category: 'Use a consistent category to keep related documents together.',
  'Current revision': 'Use the reference printed on the document, such as Rev B.',
  Tags: 'Use consistent keywords, such as the trade, location or document topic.',
  'Share With Client': 'Only explicitly shared documents appear in the client portal preview. Check the content before sharing.',
  'Client document category': 'This controls the section where the client sees the shared document.',
  'Event type': 'Choose the closest match, such as an inspection, delivery or trade booking.',
  'Trade type': 'For example, electrical, plumbing or carpentry.',
  'Insurance expiry': 'Use the date on the current insurance certificate. Saving it does not verify coverage.',
  'Licence expiry': 'Use the date on the licence. Saving it does not verify licence validity.',
  Induction: 'Note whether induction is pending or complete and any relevant reference.',
  'Recipient email': 'This is the intended recipient for an email draft; personal inbox syncing is not connected.',
  'Recipient phone (international format)': 'Include the country code, for example +61 for Australia.',
  'Recipient / participants': 'List the people involved so the saved conversation has a clear audience.',
};

function FieldHelp({ step, open, onOpenChange }: { step: ProgramStep; open: boolean; onOpenChange: (open: boolean) => void }) {
  return <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild><Button type="button" variant="ghost" size="icon-xs" title={`Help with ${step.title}`} aria-label={`Help with ${step.title}`}><CircleHelp /></Button></PopoverTrigger>
    <PopoverContent align="end" sideOffset={8} aria-label={`Help with ${step.title}`} className="z-[80] w-72 max-w-[calc(100vw-2rem)]">
      <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-semibold">{step.title}</h3><Button type="button" variant="ghost" size="icon-xs" aria-label="Close field help" onClick={() => onOpenChange(false)}><X /></Button></div>
      <p className="mt-2 text-xs leading-relaxed">{step.text}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{FIELD_DETAILS[step.title] ?? 'Check the value before saving; changes are kept in this demonstration session only.'}</p>
    </PopoverContent>
  </Popover>;
}
export function RecordWalkthrough({ formRef, kind, scanKey }: { formRef: RefObject<HTMLFormElement | null>; kind: string; scanKey: string }) {
  const [steps, setSteps] = useState<ProgramStep[]>([]);
  const [helps, setHelps] = useState<{id:string;target:HTMLElement}[]>([]);
  const [activeHelp, setActiveHelp] = useState<string>();
  const [manualHelp, setManualHelp] = useState(false);
  useEffect(() => {
    const form = formRef.current; if (!form) return;
    const elements = Array.from(form.querySelectorAll<HTMLElement>('input:not([type="hidden"]),textarea,[role="combobox"],[role="switch"]'));
    const hosts: HTMLElement[] = []; const wrappers: HTMLElement[] = []; const padded: HTMLElement[] = []; const found: ProgramStep[] = [];
    for (const element of elements) {
      const wrapper = element.closest<HTMLElement>('label') ?? element.parentElement;
      if (!wrapper || wrappers.includes(wrapper)) continue;
      const label = element.getAttribute('aria-label') ?? (Array.from(wrapper.childNodes).filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join(' ').trim() || 'Details');
      const id = label.replace(/\s+/g,'-').toLowerCase();
      if (found.some(step => step.id === id)) continue;
      wrapper.classList.add('relative');
      if (!wrapper.classList.contains('pr-7')) { wrapper.classList.add('pr-7'); padded.push(wrapper); }
      const host = document.createElement('span'); host.className = 'absolute right-0 top-0 z-10'; wrapper.appendChild(host); hosts.push(host); wrappers.push(wrapper);
      found.push({ id, target: element, title: label, text: FIELD_HINTS[label] ?? `Enter or choose the ${label.toLowerCase()}.` });
    }
    const save = form.querySelector<HTMLElement>('button[type="submit"]');
    if (save) found.push({ id:'save', target:save, title:'Save', text:'Save the record for this session. Real shared storage is not connected yet.' });
    setSteps(found); setHelps(hosts.map((target,index) => ({ id: found[index]?.id ?? '', target })));
    return () => { hosts.forEach(host => host.remove()); padded.forEach(wrapper => wrapper.classList.remove('pr-7')); };
  }, [formRef, kind, scanKey]);
  return <>{helps.map(help => {
    const step = steps.find(item => item.id === help.id);
    if (!step) return null;
    return createPortal(<FieldHelp step={step} open={activeHelp === help.id} onOpenChange={open => { setActiveHelp(open ? help.id : undefined); if (open) setManualHelp(true); }} />, help.target, help.id);
  })}{!manualHelp && <ProgramWalkthrough scope={`form:${kind}`} steps={steps} />}</>;
}