import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ACTIONS, MODULES, type PermissionMap } from "@/content/permissions";

export function Choice({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="w-full min-w-0 bg-background"><SelectValue placeholder={label} /></SelectTrigger><SelectContent>{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>;
}

export function PermissionGrid({ permissions, onChange }: { permissions: PermissionMap; onChange?: (module: string, action: string, enabled: boolean) => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead><tr className="border-b border-border text-xs text-muted-foreground"><th className="px-3 py-3 text-left font-medium">Module</th>{ACTIONS.map(action => <th key={action} className="px-2 py-3 text-center font-medium">{action}</th>)}</tr></thead><tbody>{MODULES.map(module => <tr key={module} className="border-b border-border last:border-0"><th className="px-3 py-3 text-left text-xs font-medium">{module}</th>{ACTIONS.map(action => <td key={action} className="px-2 py-3 text-center"><Checkbox aria-label={`${module} ${action}`} checked={permissions[module]?.includes(action) ?? false} disabled={!onChange} onCheckedChange={checked => onChange?.(module, action, checked === true)} /></td>)}</tr>)}</tbody></table></div>;
}