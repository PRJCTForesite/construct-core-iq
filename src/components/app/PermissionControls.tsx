import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ACTIONS, MODULES, type PermissionMap } from "@/content/permissions";

export function Choice({
  label,
  value,
  options,
  optionLabels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="w-full min-w-0 bg-background">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {optionLabels?.[option] ?? option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PermissionGrid({
  permissions,
  onChange,
}: {
  permissions: PermissionMap;
  onChange?: (module: string, action: string, enabled: boolean) => void;
}) {
  return (
    <div className="@container">
      <ul className="divide-y divide-border @min-[40rem]:hidden" aria-label="Permissions by module">
        {MODULES.map((module) => (
          <li key={module} className="py-3">
            <p className="text-xs font-medium">{module}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {ACTIONS.map((action) => (
                <label key={action} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Checkbox
                    aria-label={`${module} ${action}`}
                    checked={permissions[module]?.includes(action) ?? false}
                    disabled={!onChange}
                    onCheckedChange={(checked) => onChange?.(module, action, checked === true)}
                  />
                  {action}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <table className="hidden w-full text-sm @min-[40rem]:table">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-3 py-3 text-left font-medium">Module</th>
            {ACTIONS.map((action) => (
              <th key={action} className="px-2 py-3 text-center font-medium">
                {action}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MODULES.map((module) => (
            <tr key={module} className="border-b border-border last:border-0">
              <th className="px-3 py-3 text-left text-xs font-medium">{module}</th>
              {ACTIONS.map((action) => (
                <td key={action} className="px-2 py-3 text-center">
                  <Checkbox
                    aria-label={`${module} ${action}`}
                    checked={permissions[module]?.includes(action) ?? false}
                    disabled={!onChange}
                    onCheckedChange={(checked) => onChange?.(module, action, checked === true)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
