import { useState } from "react";
import { ArrowUp, ArrowDown, Save, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Choice } from "@/components/app/PermissionControls";
import { usePortal, type ProjectPortal } from "./PortalProvider";
import { CONTACTS, type PortalTemplate } from "@/content/client-portal";

export function TemplateEditor({
  projectId,
  config,
}: {
  projectId: string;
  config: ProjectPortal;
}) {
  const store = usePortal();
  const initial = store.templates.find((t) => t.id === config.templateId) ?? store.templates[0];
  const [draft, setDraft] = useState<PortalTemplate | undefined>(
    initial ? structuredClone(initial) : undefined,
  );
  const [customName, setCustomName] = useState("");
  if (!draft) return null;
  const updateWidget = (index: number, values: Partial<PortalTemplate["widgets"][number]>) =>
    setDraft({
      ...draft,
      widgets: draft.widgets.map((w, i) => (i === index ? { ...w, ...values } : w)),
    });
  const move = (index: number, delta: number) => {
    const widgets = [...draft.widgets];
    const item = widgets[index];
    const target = index + delta;
    if (!item || target < 0 || target >= widgets.length) return;
    widgets.splice(index, 1);
    widgets.splice(target, 0, item);
    setDraft({ ...draft, widgets });
  };
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Portal configuration</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Subscriber settings · Changes last for this demonstration session
          </p>
        </div>
        <Button
          onClick={() => {
            store.saveTemplate(draft);
            store.updateProject(projectId, (p) => ({ ...p, templateId: draft.id }));
            toast.success("Template saved and applied to this project");
          }}
        >
          <Save className="h-4 w-4" /> Save & apply
        </Button>
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section>
          <div className="grid gap-3 sm:grid-cols-2">
            <Choice
              label="Dashboard template"
              value={draft.id}
              options={store.templates.map((t) => t.id)}
              optionLabels={Object.fromEntries(store.templates.map((t) => [t.id, t.name]))}
              onChange={(id) => {
                const t = store.templates.find((t) => t.id === id);
                if (t) setDraft(structuredClone(t));
              }}
            />
            <Input
              aria-label="Template name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{draft.audience}</p>
          <div className="mt-5 divide-y divide-border border-y border-border">
            {draft.widgets.map((w, i) => (
              <div key={w.id} className="flex items-center gap-2 py-3">
                <span className="w-5 shrink-0 text-xs text-muted-foreground">{i + 1}</span>
                <Switch
                  checked={w.enabled}
                  aria-label={`Enable ${w.name}`}
                  onCheckedChange={(enabled) => updateWidget(i, { enabled })}
                />
                <Input
                  aria-label={`Widget name ${w.id}`}
                  className="min-w-0 flex-1"
                  value={w.name}
                  onChange={(e) => updateWidget(i, { name: e.target.value })}
                />
                <Button
                  title={`Move ${w.name} up`}
                  aria-label={`Move ${w.name} up`}
                  size="icon"
                  variant="ghost"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  title={`Move ${w.name} down`}
                  aria-label={`Move ${w.name} down`}
                  size="icon"
                  variant="ghost"
                  disabled={i === draft.widgets.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Input
              aria-label="Custom template name"
              placeholder="Custom template name"
              className="min-w-0 flex-1"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <Button
              variant="outline"
              disabled={!customName.trim()}
              onClick={() => {
                const t = {
                  ...draft,
                  id: crypto.randomUUID(),
                  name: customName.trim(),
                  audience: "Custom subscriber template",
                };
                store.saveTemplate(t);
                setDraft(t);
                setCustomName("");
                toast.success("Custom template created");
              }}
            >
              <Copy className="h-4 w-4" /> Save as new
            </Button>
          </div>
        </section>
        <section>
          <h2 className="mb-4 font-semibold">Dashboard preview</h2>
          <ol className="space-y-3">
            {draft.widgets
              .filter((w) => w.enabled)
              .map((w, i) => (
                <li key={w.id} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-medium">
                    <span className="mr-3 text-muted-foreground">{i + 1}</span>
                    {w.name}
                  </p>
                  <div className="mt-3 h-1.5 w-2/3 rounded bg-muted" />
                </li>
              ))}
          </ol>
          {!draft.widgets.some((w) => w.enabled) && (
            <p className="py-6 text-sm text-muted-foreground">No widgets enabled</p>
          )}
        </section>
      </div>
      <section className="border-t border-border pt-6">
        <h2 className="font-semibold">Stage weighting</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Total allocation: {config.stages.reduce((sum, s) => sum + s.weight, 0)}%
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-5">
          {config.stages.map((stage, i) => (
            <label key={stage.name} className="grid gap-2 text-sm">
              {stage.name}
              <Input
                type="number"
                min="0"
                max="100"
                aria-label={`${stage.name} weight`}
                value={stage.weight}
                onChange={(e) =>
                  store.updateProject(projectId, (p) => ({
                    ...p,
                    stages: p.stages.map((s, index) =>
                      index === i
                        ? { ...s, weight: Math.max(0, Math.min(100, Number(e.target.value))) }
                        : s,
                    ),
                  }))
                }
              />
            </label>
          ))}
        </div>
      </section>
      <section className="border-t border-border pt-6">
        <h2 className="font-semibold">Visible project contacts</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACTS.map((c) => (
            <label key={c.role} className="flex items-center justify-between gap-3 text-sm">
              {c.role}
              <Switch
                aria-label={`Show ${c.role}`}
                checked={config.contacts.includes(c.role)}
                disabled={["Builder", "Project Manager"].includes(c.role)}
                onCheckedChange={(checked) =>
                  store.updateProject(projectId, (p) => ({
                    ...p,
                    contacts: checked
                      ? [...p.contacts, c.role]
                      : p.contacts.filter((x) => x !== c.role),
                  }))
                }
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
