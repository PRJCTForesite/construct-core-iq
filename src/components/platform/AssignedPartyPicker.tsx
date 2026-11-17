import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useUsers } from '@/components/users/UsersProvider';
import { availableEmployees } from '@/content/record-editing';
export function AssignedPartyPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { users } = useUsers();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const employees = availableEmployees(users, query);
  return <div className="grid gap-1.5 text-xs"><Label htmlFor="assigned-party" className="text-xs">Assigned party</Label><div className="flex min-w-0 gap-2"><Input id="assigned-party" value={value} onChange={event => onChange(event.target.value)} /><Popover open={open} onOpenChange={next => { setOpen(next); setQuery(''); }}><PopoverTrigger asChild><Button type="button" variant="outline" size="icon" className="shrink-0" aria-label="Choose assigned employee" title="Choose assigned employee"><Plus /></Button></PopoverTrigger><PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)] p-3"><h3 className="mb-3 text-sm font-semibold">Available employees</h3><Input aria-label="Search employees" placeholder="Search name, role or organisation" value={query} onChange={event => setQuery(event.target.value)} /><div className="mt-2 max-h-56 overflow-y-auto">{employees.map(employee => <Button type="button" key={employee.id} variant="ghost" className="h-auto w-full justify-between whitespace-normal py-3 text-left" onClick={() => { onChange(employee.name); setOpen(false); }}><span><span className="block text-sm">{employee.name}</span><span className="block text-xs text-muted-foreground">{employee.role} · {employee.organisation}</span></span>{value === employee.name && <Check className="size-4 shrink-0 text-azure" />}</Button>)}{!employees.length && <p className="py-4 text-sm text-muted-foreground">No available employees found.</p>}</div></PopoverContent></Popover></div></div>;
}
