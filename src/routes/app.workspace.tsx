import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Plus, Sparkles } from "lucide-react";

import { Avatar, DOT_TONE, Panel, PageHeading, Pill, StatTile } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  APPROVALS_WAITING,
  ASSIGNED_DEFECTS_SHORT,
  DAILY_BRIEF,
  DEMO_USER,
  PINNED_PROJECTS,
  RECENT_DOCUMENTS,
  TODAY_LABEL,
  UNREAD_COMMS,
  WORKSPACE_CALLS,
  WORKSPACE_KPIS,
  WORKSPACE_TASKS,
} from "@/content/app";

export const Route = createFileRoute("/app/workspace")({
  head: () => ({
    meta: [
      { title: "My Workspace — Foresite OS" },
      { name: "description", content: "Your AI daily brief, tasks, calls, approvals and pinned projects." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkspacePage,
});

const PRIORITY_TONE = { High: "bad", Medium: "warn", Low: "info", Done: "good" } as const;

function WorkspacePage() {
  return (
    <div className="space-y-6">
      <PageHeading
        title="My Workspace"
        meta={`${DEMO_USER.name} · ${DEMO_USER.role} · ${TODAY_LABEL}`}
        actions={
          <Button size="sm" className="bg-azure text-azure-foreground hover:bg-azure/90">
            <Plus className="h-4 w-4" /> New Task
          </Button>
        }
      />

      <div className="rounded-xl border border-azure/25 bg-azure/[0.05] p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-azure" /> AI Daily Brief
        </p>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-secondary-foreground">{DAILY_BRIEF}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {WORKSPACE_KPIS.map((kpi) => (
          <StatTile key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel title="My Tasks" action="View all" bodyClassName="p-0 sm:p-0">
            {WORKSPACE_TASKS.map((group) => (
              <div key={group.group}>
                <p className="border-b border-border bg-surface px-5 py-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.group} · {group.items.length}
                </p>
                <ul className="divide-y divide-border">
                  {group.items.map((task) => (
                    <li key={task.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5">
                      <Checkbox defaultChecked={task.priority === "Done"} aria-label={task.title} />
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-medium ${task.priority === "Done" ? "text-muted-foreground line-through" : "text-foreground"}`}
                        >
                          {task.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">{task.meta}</span>
                      </span>
                      <Pill tone={PRIORITY_TONE[task.priority as keyof typeof PRIORITY_TONE]}>{task.priority}</Pill>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Panel>

          <div className="grid gap-4 sm:grid-cols-2">
            <Panel title="Today's Calls" bodyClassName="space-y-3">
              {WORKSPACE_CALLS.map((call) => (
                <div key={call.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <Avatar initials={call.name.split(" ").map((p) => p[0]).join("")} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">{call.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{call.meta}</span>
                  </span>
                  <Button variant="outline" size="icon" aria-label={`Call ${call.name}`}>
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </Panel>

            <Panel title="My Defects" action={<Link to="/app/defects">Board</Link>} bodyClassName="space-y-3">
              {ASSIGNED_DEFECTS_SHORT.map((defect) => (
                <div key={defect.title} className="rounded-lg border border-border bg-surface p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <p className="text-sm font-medium text-foreground">{defect.title}</p>
                    <Pill tone={defect.severity === "Critical" ? "bad" : "warn"}>{defect.severity}</Pill>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{defect.meta}</p>
                </div>
              ))}
            </Panel>
          </div>

          <Panel title="Unread Communications" action={<Link to="/app/communications">Open inbox</Link>} bodyClassName="p-0 sm:p-0">
            <ul className="divide-y divide-border">
              {UNREAD_COMMS.map((item) => (
                <li key={item.name + item.time} className="px-5 py-3.5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {item.name} <span className="font-normal text-muted-foreground">· {item.project}</span>
                    </p>
                    <span className="flex shrink-0 items-center gap-2">
                      <Pill tone="info">{item.channel}</Pill>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.preview}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Approvals Waiting" bodyClassName="space-y-3">
            {APPROVALS_WAITING.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-surface p-3">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
                <button className="mt-2 text-xs font-semibold text-azure">{item.action}</button>
              </div>
            ))}
          </Panel>

          <Panel title="Pinned Projects" bodyClassName="space-y-3">
            {PINNED_PROJECTS.map((project) => (
              <div key={project.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <Avatar initials={project.initials} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">{project.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{project.meta}</span>
                </span>
                <span className={`h-2 w-2 shrink-0 rounded-full ${DOT_TONE[project.tone]}`} aria-hidden="true" />
              </div>
            ))}
          </Panel>

          <Panel title="Recent Documents" bodyClassName="space-y-3">
            {RECENT_DOCUMENTS.map((doc) => (
              <div key={doc.title}>
                <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{doc.meta}</p>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
