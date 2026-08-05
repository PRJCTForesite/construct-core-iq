import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, MapPin, Sparkles } from "lucide-react";

import {
  Avatar,
  DOT_TONE,
  Meter,
  PageHeading,
  Panel,
  Pill,
  Ring,
  StatusPill,
} from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { PROJECT_DETAIL, PROJECT_ROWS } from "@/content/app";

export const Route = createFileRoute("/app/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project overview — Foresite OS" },
      { name: "description", content: "Project programme, budget, defects, photos and activity in one view." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProjectDetailPage,
  notFoundComponent: () => <p className="text-sm text-muted-foreground">Project not found.</p>,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const row = PROJECT_ROWS.find((item) => item.id === projectId);
  const project = { ...PROJECT_DETAIL, name: row?.name ?? PROJECT_DETAIL.name, status: row?.status ?? PROJECT_DETAIL.status };

  return (
    <div className="space-y-6">
      <Link to="/app/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <div className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar initials={project.initials} className="h-12 w-12 rounded-xl text-sm" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">{project.name}</h1>
                <StatusPill tone={project.status === "On Track" ? "good" : project.status === "Delayed" ? "bad" : "warn"}>
                  {project.status}
                </StatusPill>
              </div>
              <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {project.address} · {project.client}
              </p>
              <p className="text-xs text-muted-foreground">
                {project.dates} · {project.contract}
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-azure text-azure-foreground hover:bg-azure/90">
            Update client
          </Button>
        </div>

        <nav className="mt-5 -mb-1 flex gap-1 overflow-x-auto" aria-label="Project sections">
          {project.tabs.map((tab, index) => (
            <button
              key={tab}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                index === 0 ? "bg-azure/10 text-azure" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
        <Panel title="Completion">
          <div className="flex flex-col items-center gap-5">
            <Ring value={project.completion} label={`${project.completion}%`} sub="complete" />
            <ul className="w-full space-y-3">
              {project.health.map((item) => (
                <li key={item.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                  <Meter value={item.share} tone={item.tone} className="mt-1.5" />
                  <p className="mt-1 text-[0.6875rem] text-muted-foreground">{item.meta}</p>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-azure" /> AI Project Summary
              </span>
            }
            className="border-azure/25 bg-azure/[0.04]"
          >
            <p className="text-sm leading-relaxed text-secondary-foreground">{project.aiSummary}</p>
          </Panel>

          <Panel title="Project Programme" action="Full Gantt">
            <div className="space-y-3">
              {project.programme.map((phase) => (
                <div key={phase.phase} className="grid grid-cols-[minmax(7rem,10rem)_minmax(0,1fr)] items-center gap-3">
                  <span className="truncate text-xs text-secondary-foreground">{phase.phase}</span>
                  <span className="relative block h-6 rounded bg-muted">
                    <span
                      className={`absolute inset-y-0 flex items-center justify-center rounded px-2 text-[0.625rem] font-medium text-background ${DOT_TONE[phase.tone]}`}
                      style={{ left: `${phase.start}%`, width: `${phase.width}%` }}
                    >
                      <span className="truncate">{phase.state}</span>
                    </span>
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-[minmax(7rem,10rem)_minmax(0,1fr)] gap-3">
                <span />
                <span className="flex justify-between text-[0.6875rem] text-muted-foreground">
                  {project.programmeMonths.map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Recent Photos" action="Upload" subtitle={project.photos.last}>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid aspect-square place-items-center rounded-lg bg-surface">
                <Camera className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {project.photos.count} · <span className="text-construction">{project.photos.note}</span>
          </p>
        </Panel>

        <Panel title="Budget Summary">
          <dl className="grid grid-cols-2 gap-4">
            {[
              ["Contract", project.budget.contract],
              ["Spent", project.budget.spent],
              ["Variations", project.budget.variations],
              ["Margin", project.budget.margin],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="text-sm font-semibold tabular-nums text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <Meter value={project.budget.spentShare} className="mt-5" />
          <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground">
            <span>{project.budget.spentLabel}</span>
            <span>{project.budget.remainingLabel}</span>
          </div>

          <ul className="mt-5 space-y-3 border-t border-border pt-4">
            {project.actions.map((item) => (
              <li key={item.title}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <Pill tone={item.tone}>{item.tag}</Pill>
                </div>
                <p className="text-xs text-muted-foreground">{item.meta}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel title="Activity" bodyClassName="space-y-4">
            {project.activity.map((item) => (
              <div key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT_TONE[item.tone]}`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{item.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{item.meta}</span>
                  <span className="block text-[0.6875rem] text-muted-foreground">{item.when}</span>
                </span>
              </div>
            ))}
          </Panel>

          <Panel title="Project Team" bodyClassName="space-y-3">
            {project.team.map((member) => (
              <div key={member.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <Avatar initials={member.initials} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">{member.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{member.role}</span>
                </span>
                {"badge" in member && member.badge ? <Pill tone="info">{member.badge}</Pill> : null}
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
