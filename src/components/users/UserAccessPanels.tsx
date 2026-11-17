import { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Choice, PermissionGrid } from '@/components/app/PermissionControls';
import { Pill } from '@/components/app/primitives';
import { ROLES, rolePermissions, type DirectoryUser, type Role } from '@/content/permissions';

type Props = { users: DirectoryUser[]; onReview: (user: DirectoryUser) => void };

export function RoleTemplates({ users, onReview }: Props) {
  const [template, setTemplate] = useState<Role>('Project Manager');
  const [userId, setUserId] = useState(users[0]?.id ?? '');
  const selected = users.find(user => user.id === userId);
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">Role Templates</h2>
      <div className="flex w-full flex-wrap gap-3 sm:w-auto">
        <div className="min-w-48 flex-1"><Choice label="Select user for template" value={userId} options={users.map(user => user.id)} optionLabels={Object.fromEntries(users.map(user => [user.id, user.name]))} onChange={setUserId} /></div>
        <Button disabled={!selected} onClick={() => { if (selected) onReview({ ...structuredClone(selected), role: template, permissionTemplate: template, permissions: rolePermissions(template) }); }}><ShieldCheck className="h-4 w-4" />Review Template Assignment</Button>
      </div>
    </div>
    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">{ROLES.map(role => <Button key={role} variant={template === role ? 'secondary' : 'outline'} aria-pressed={template === role} onClick={() => setTemplate(role)} className="h-auto flex-col items-start gap-2 whitespace-normal p-4 text-left"><ShieldCheck className="h-4 w-4 text-azure" /><span>{role}</span><span className="text-xs font-normal text-muted-foreground">{Object.values(rolePermissions(role)).filter(actions => actions.length).length} accessible modules</span></Button>)}</div>
    <section className="border-t border-border pt-5"><h3 className="mb-3 text-sm font-semibold">{template} permission template</h3><PermissionGrid permissions={rolePermissions(template)} /></section>
  </div>;
}

export function SecurityReview({ users, onReview }: Props) {
  const reviews = [
    { title: 'Inactive users', people: users.filter(user => user.status === 'Inactive') },
    { title: 'Full financial access', people: users.filter(user => user.permissions['Financials']?.includes('Administer')) },
    { title: 'Guests with elevated permissions', people: users.filter(user => user.role === 'Guest' && (user.permissions['Financials']?.length || user.permissions['Administration']?.length)) },
    { title: 'Unassigned accounts', people: users.filter(user => !user.assignments.length) },
    { title: 'Permission conflicts', people: users.filter(user => Object.values(user.permissions).some(actions => actions.some(action => action !== 'View') && !actions.includes('View'))) },
  ];
  return <div className="space-y-5"><h2 className="text-lg font-semibold">Security Review</h2><div className="grid gap-5 md:grid-cols-2">{reviews.map(review => <section key={review.title} className="border-t border-border pt-4"><div className="mb-3 flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-azure" /><h3 className="text-sm font-semibold">{review.title}</h3><Pill tone={review.people.length ? 'warn' : 'good'}>{review.people.length}</Pill></div>{review.people.length ? review.people.map(user => <Button key={user.id} variant="ghost" className="h-auto w-full justify-between gap-3 whitespace-normal py-3 text-left" onClick={() => onReview(user)}>{user.name}<ArrowRight className="h-4 w-4 shrink-0" /></Button>) : <p className="text-xs text-muted-foreground">No accounts to review.</p>}</section>)}</div></div>;
}