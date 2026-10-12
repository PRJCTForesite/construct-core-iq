import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Filter, Flag, Sparkles, X } from "lucide-react";

import { AppIcon } from "@/components/app/AppIcon";
import {
  DOT_TONE,
  Meter,
  Panel,
  PageHeading,
  Pill,
  Ring,
  StatTile,
  StatusPill,
  TEXT_TONE,
  type Tone,
} from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import {
  AI_INSIGHT_CARDS,
  CASHFLOW_SERIES,
  CRITICAL_ALERTS,
  DASHBOARD_KPIS,
  DEMO_USER,
  HEALTH_SCORE,
  PROJECT_ROWS,
  QUICK_ACTIONS,
  TODAYS_PRIORITIES,
  TODAY_LABEL,
  UPCOMING_TODAY,
} from "@/content/app";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Dashboard \u2014 Foresite OS" },
      { property: "og:description", content: "Business health score, critical alerts, today's priorities and cashflow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Dashboard — Foresite OS" },
      { name: "description", content: "Business health score, critical alerts, today's priorities and cashflow." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const STATUS_TONE: Record<string, Tone | undefined> = { "At Risk": "warn", Delayed: "bad", "On Track": "good" };

function Sparkline() {
  const width = 640;
  const height = 180;
  const max = 460;
  const line = (key: "inflow" | "outflow") =>
    CASHFLOW_SERIES.map((point, index) => {
      const x = (index / (CASHFLOW_SERIES.length - 1)) * width;
      const y = height - (point[key] / max) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" role="img" aria-label="Cashflow last six months">
        {[0.25, 0.5, 0.75, 1].map((step) => (
          <line key={step} x1="0" x2={width} y1={height * step} y2={height * step} className="stroke-border" strokeWidth="1" />
        ))}
        <path d={line("outflow")} fill="none" className="stroke-border" strokeWidth="2.5" strokeLinecap="round" />
        <path d={line("inflow")} fill="none" className="stroke-azure" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground">
        {CASHFLOW_SERIES.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        title={`Good morning, ${DEMO_USER.firstName}.`}
        meta={`${TODAY_LABEL} · 7 active projects · 3 items need your attention`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export Report</span>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <Panel title="Business Health Score" action={<span className="text-chart-5">↑ {HEALTH_SCORE.delta}</span>}>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <Ring value={HEALTH_SCORE.score} label={String(HEALTH_SCORE.score)} sub="out of 100" />
            <ul className="grid flex-1 gap-4 sm:grid-cols-2">
              {HEALTH_SCORE.breakdown.map((item) => (
                <li key={item.label} className="flex gap-2.5">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT_TONE[item.tone]}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">{item.label}</span>
                    <span className="block text-xs text-muted-foreground">{item.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Critical Alerts" action="View all" bodyClassName="space-y-2.5">
          {CRITICAL_ALERTS.map((alert) => (
            <div
              key={alert.title}
              className={`rounded-lg border-l-2 bg-surface p-3 ${alert.tone === "bad" ? "border-destructive" : "border-construction"}`}
            >
              <p className="text-sm font-medium text-foreground">{alert.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{alert.meta}</p>
            </div>
          ))}
        </Panel>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_KPIS.map((kpi) => (
          <StatTile key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <Panel title="Today's Priorities" action={<span className="text-muted-foreground">5 actions</span>} bodyClassName="p-0 sm:p-0">
          <ul className="divide-y divide-border">
            {TODAYS_PRIORITIES.map((item) => (
              <li key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-5">
                <span className={`h-9 w-1 shrink-0 rounded-full ${DOT_TONE[item.tone]}`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{item.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{item.meta}</span>
                </span>
                <button className="shrink-0 text-xs font-semibold text-azure">{item.action}</button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Upcoming Today" bodyClassName="space-y-4">
          {UPCOMING_TODAY.map((item) => (
            <div key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
              <span
                className={`mt-1.5 h-2 w-2 rounded-full ${item.active ? "bg-azure ring-4 ring-azure/15" : "bg-border"}`}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">{item.time}</span>
                <span className="block text-sm font-medium text-foreground">{item.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{item.meta}</span>
              </span>
            </div>
          ))}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <Panel title="Projects Requiring Attention" action="Columns" bodyClassName="p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Project Name</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Progress</th>
                  <th className="px-3 py-3 font-medium">Budget</th>
                  <th className="px-3 py-3 font-medium">Next Milestone</th>
                  <th className="px-5 py-3 font-medium">AI Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PROJECT_ROWS.map((row) => (
                  <tr key={row.id} className="hover:bg-surface">
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      <Link to="/app/projects/$projectId" params={{ projectId: row.id }} className="hover:text-azure">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusPill tone={STATUS_TONE[row.status] ?? "muted"}>{row.status}</StatusPill>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="flex items-center gap-2">
                        <Meter value={row.progress} className="w-20" />
                        <span className="tabular-nums text-xs text-muted-foreground">{row.progress}%</span>
                      </span>
                    </td>
                    <td className="px-3 py-3.5 tabular-nums text-foreground">{row.budget}</td>
                    <td className="px-3 py-3.5 text-secondary-foreground">{row.milestone}</td>
                    <td className="px-5 py-3.5">
                      {row.flag ? (
                        <Pill tone={row.flag.tone}>
                          <Flag className="h-3 w-3" /> {row.flag.label}
                        </Pill>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-azure" /> AI Insights
              </span>
            }
            bodyClassName="space-y-3"
          >
            {AI_INSIGHT_CARDS.map((card) => (
              <div key={card.title} className="rounded-lg border border-azure/20 bg-azure/[0.04] p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <p className="text-sm font-medium text-foreground">{card.title}</p>
                  <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{card.meta}</p>
                <button className="mt-2 text-xs font-semibold text-azure">→ {card.action}</button>
              </div>
            ))}
          </Panel>

          <Panel title="Quick Actions" bodyClassName="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface px-3 py-4 text-xs font-medium text-secondary-foreground transition-colors hover:border-azure/40 hover:text-foreground"
              >
                <AppIcon name={action.icon} className="h-4 w-4 text-azure" />
                {action.label}
              </button>
            ))}
          </Panel>
        </div>
      </div>

      <Panel
        title="Cashflow — Last 6 Months"
        subtitle="Net surplus grew 31% since January"
        action={
          <span className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className={`flex items-center gap-1.5 ${TEXT_TONE.info}`}>
              <span className="h-2 w-2 rounded-full bg-azure" /> Inflow
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-border" /> Outflow
            </span>
          </span>
        }
      >
        <Sparkline />
      </Panel>
    </div>
  );
}
