import { DashboardWidgets, type DashboardWidget } from "@/components/app/DashboardWidgets";
import { ProjectHealth } from "@/components/platform/ProjectExpansion";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag, Sparkles, X } from "lucide-react";

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
  staticData: { sitemap: false },
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
    <div className="mt-2 sm:mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full sm:h-44" role="img" aria-label="Cashflow last six months" preserveAspectRatio="none">
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
  const widgets: DashboardWidget[] = [
    { id: 'health', title: 'Business Health Score', content: (<Panel title="Business Health Score" action={<span className="text-chart-5">↑ {HEALTH_SCORE.delta}</span>}>
          <div className="flex items-center gap-4 sm:gap-6">
            <Ring value={HEALTH_SCORE.score} label={String(HEALTH_SCORE.score)} sub="out of 100" />
            <ul className="grid min-w-0 flex-1 gap-2.5 sm:grid-cols-2 sm:gap-4">
              {HEALTH_SCORE.breakdown.map((item) => (
                <li key={item.label} className="flex gap-2.5">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT_TONE[item.tone]}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">{item.label}</span>
                    <span className="widget-detail block text-xs text-muted-foreground">{item.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>) },
    { id: 'alerts', title: 'Critical Alerts', content: (<Panel title="Critical Alerts" action="View all" bodyClassName="space-y-2.5">
          {CRITICAL_ALERTS.map((alert) => (
            <div
              key={alert.title}
              className={`rounded-lg border-l-2 bg-surface p-3 ${alert.tone === "bad" ? "border-destructive" : "border-construction"}`}
            >
              <p className="text-sm font-medium text-foreground">{alert.title}</p>
              <p className="widget-detail mt-1 text-xs text-muted-foreground">{alert.meta}</p>
            </div>
          ))}
        </Panel>) },
    ...DASHBOARD_KPIS.map((kpi) => ({ id: ({ 'Outstanding Invoices': 'invoices', 'Active Projects': 'projects-count', 'Open Defects': 'defects-count', 'Monthly Cashflow': 'cashflow-count' } as const)[kpi.label as 'Outstanding Invoices' | 'Active Projects' | 'Open Defects' | 'Monthly Cashflow'], title: kpi.label, size: 'small' as const, content: <StatTile {...kpi} /> })),
    { id: 'priorities', title: "Today's Priorities", content: (<Panel title="Today's Priorities" action={<span className="text-muted-foreground">5 actions</span>} bodyClassName="p-0 sm:p-0">
          <ul className="divide-y divide-border">
            {TODAYS_PRIORITIES.map((item) => (
              <li key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5">
                <span className={`h-9 w-1 shrink-0 rounded-full ${DOT_TONE[item.tone]}`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{item.title}</span>
                  <span className="widget-detail block truncate text-xs text-muted-foreground">{item.meta}</span>
                </span>
                <button className="shrink-0 text-xs font-semibold text-azure">{item.action}</button>
              </li>
            ))}
          </ul>
        </Panel>) },
    { id: 'upcoming', title: 'Upcoming Today', content: (<Panel title="Upcoming Today" bodyClassName="space-y-4">
          {UPCOMING_TODAY.map((item) => (
            <div key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
              <span
                className={`mt-1.5 h-2 w-2 rounded-full ${item.active ? "bg-azure ring-4 ring-azure/15" : "bg-border"}`}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">{item.time}</span>
                <span className="block text-sm font-medium text-foreground">{item.title}</span>
                <span className="widget-detail block truncate text-xs text-muted-foreground">{item.meta}</span>
              </span>
            </div>
          ))}
        </Panel>) },
    { id: 'projects', title: 'Projects Requiring Attention', size: 'wide', content: (<Panel title="Projects Requiring Attention" action="Columns" bodyClassName="p-0 sm:p-0">
          <div className="@container">
            <ul className="divide-y divide-border @min-[46rem]:hidden">
              {PROJECT_ROWS.map((row) => (
                <li key={row.id} className="space-y-1.5 px-3 py-2.5 sm:px-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <Link to="/app/projects/$projectId" params={{ projectId: row.id }} className="truncate text-sm font-medium text-foreground hover:text-azure">{row.name}</Link>
                    <StatusPill tone={STATUS_TONE[row.status] ?? "muted"}>{row.status}</StatusPill>
                  </div>
                  <div className="flex items-center gap-2">
                    <Meter value={row.progress} className="min-w-0 flex-1" />
                    <span className="shrink-0 tabular-nums text-xs text-muted-foreground">{row.progress}% · {row.budget}</span>
                  </div>
                  <p className="widget-detail truncate text-xs text-muted-foreground">{row.milestone}{row.flag ? ` · ${row.flag.label}` : ""}</p>
                </li>
              ))}
            </ul>
            <table className="hidden w-full text-sm @min-[46rem]:table">
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
        </Panel>) },
    { id: 'insights', title: 'AI Insights', content: (<Panel
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-azure" /> AI Insights
              </span>
            }
            bodyClassName="space-y-2 sm:space-y-3"
          >
            {AI_INSIGHT_CARDS.map((card) => (
              <div key={card.title} className="rounded-lg border border-azure/20 bg-azure/[0.04] p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <p className="text-sm font-medium text-foreground">{card.title}</p>
                  <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="widget-detail mt-1 text-xs text-muted-foreground">{card.meta}</p>
                <button className="mt-2 text-xs font-semibold text-azure">→ {card.action}</button>
              </div>
            ))}
          </Panel>) },
    { id: 'quick-actions', title: 'Quick Actions', content: (<Panel title="Quick Actions" bodyClassName="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                className="flex min-w-0 flex-col items-center gap-1.5 rounded-lg border border-border bg-surface px-1.5 py-2.5 text-center text-[0.6875rem] sm:gap-2 sm:px-3 sm:py-4 sm:text-xs font-medium text-secondary-foreground transition-colors hover:border-azure/40 hover:text-foreground"
              >
                <AppIcon name={action.icon} className="h-4 w-4 text-azure" />
                {action.label}
              </button>
            ))}
          </Panel>) },
    { id: 'cashflow', title: 'Cashflow', size: 'wide', content: (      <Panel
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
      </Panel>) },
    { id: 'project-health', title: 'Project health breakdown', size: 'wide', content: (<ProjectHealth />) },
  ];
  return <div className="space-y-6"><PageHeading title={`Good morning, ${DEMO_USER.firstName}.`} meta={`${TODAY_LABEL} · Sample workspace`} /><DashboardWidgets widgets={widgets} /></div>;
}
