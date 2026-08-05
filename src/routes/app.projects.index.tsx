import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";

import { Avatar, Meter, PageHeading, Panel, Pill, StatusPill, type Tone } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { PROJECT_ROWS } from "@/content/app";

export const Route = createFileRoute("/app/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Foresite OS" },
      { name: "description", content: "All active construction projects with status, progress, budget and AI flags." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProjectsPage,
});

const STATUS_TONE: Record<string, Tone | undefined> = { "At Risk": "warn", Delayed: "bad", "On Track": "good" };

function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Projects"
        meta="7 active · 2 at risk · 2 delayed"
        actions={
          <Button size="sm" className="bg-azure text-azure-foreground hover:bg-azure/90">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        }
      />

      <label className="relative block max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <span className="sr-only">Search projects</span>
        <input
          type="search"
          placeholder="Search projects, clients or addresses"
          className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none focus:border-azure focus:ring-2 focus:ring-azure/20"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PROJECT_ROWS.map((row) => (
          <Link key={row.id} to="/app/projects/$projectId" params={{ projectId: row.id }} className="group">
            <Panel className="h-full transition-colors group-hover:border-azure/40">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <Avatar initials={row.name.split(" ").map((p) => p[0]).join("").slice(0, 2)} className="h-10 w-10 text-xs" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">{row.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">Next: {row.milestone}</span>
                </span>
                <StatusPill tone={STATUS_TONE[row.status] ?? "muted"}>{row.status}</StatusPill>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Completion</span>
                  <span className="tabular-nums text-foreground">{row.progress}%</span>
                </div>
                <Meter value={row.progress} tone={STATUS_TONE[row.status] === "bad" ? "bad" : "info"} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium tabular-nums text-foreground">{row.budget}</span>
                {row.flag && <Pill tone={row.flag.tone}>{row.flag.label}</Pill>}
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}
