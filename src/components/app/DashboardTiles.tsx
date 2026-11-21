import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Flag, Sparkles, X } from "lucide-react";

import { AppIcon } from "@/components/app/AppIcon";
import { DOT_TONE, Meter, Panel, Pill, Ring, StatTile, StatusPill, TEXT_TONE, type Tone } from "@/components/app/primitives";
import { HealthBadge } from "@/components/app/WorkflowControls";
import { usePlatform } from "@/components/platform/PlatformProvider";
import { Button } from "@/components/ui/button";
import {
  AI_INSIGHT_CARDS,
  CASHFLOW_SERIES,
  CRITICAL_ALERTS,
  DASHBOARD_KPIS,
  HEALTH_SCORE,
  PROJECT_ROWS,
  QUICK_ACTIONS,
  TODAYS_PRIORITIES,
  UPCOMING_TODAY,
  type NavIcon,
} from "@/content/app";
import { compactCurrency, compactFigure } from "@/lib/compact-figures";
import type { WidgetSize } from "@/lib/workspace-preferences";
import { cn } from "@/lib/utils";

/* Each dashboard tile renders a purpose-built view per size:
   small = abbreviated headline, medium = standard summary, large = extra detail. */

const STATUS_TONE: Record<string, Tone | undefined> = { "At Risk": "warn", Delayed: "bad", "On Track": "good" };
const count = (n: number, word: string) => `${n} ${word}`;

function MiniTile({ label, icon, value, unit, tone, sub, children }: { label: string; icon?: NavIcon | undefined; value: ReactNode; unit?: string | undefined; tone?: Tone | undefined; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-3 shadow-panel">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5">
        <span className="truncate text-[0.6875rem] font-medium text-muted-foreground">{label}</span>
        {icon && <AppIcon name={icon} className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
      </div>
      <p className={cn("mt-1 truncate text-xl font-semibold tabular-nums tracking-tight", tone ? TEXT_TONE[tone] : "text-foreground")}>
        {value}
        {unit && <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span>}
      </p>
      {sub && <p className="truncate text-[0.6875rem] text-muted-foreground">{sub}</p>}
      {children}
    </div>
  );
}

/* ------------------------------ Business health ------------------------------ */
const healthParts = HEALTH_SCORE.breakdown.map((item) => {
  const [pct = "0%", note = ""] = item.value.split(" — ");
  return { ...item, pct: Number.parseInt(pct, 10), note };
});

export function HealthTile({ size }: { size: WidgetSize }) {
  const watch = healthParts.filter((item) => item.tone !== "good").length;
  if (size === "small") {
    return (
      <MiniTile label="Business health" value={HEALTH_SCORE.score} unit="/100" sub={<span className="text-chart-5">↑ 4 pts · {watch} to watch</span>}>
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {healthParts.map((item) => <span key={item.label} className={cn("h-1.5 flex-1 rounded-full", DOT_TONE[item.tone])} />)}
        </div>
      </MiniTile>
    );
  }
  if (size === "medium") {
    return (
      <Panel title="Business Health Score" action={<span className="text-chart-5">↑ {HEALTH_SCORE.delta}</span>}>
        <div className="flex items-center gap-4">
          <Ring size="md" value={HEALTH_SCORE.score} label={String(HEALTH_SCORE.score)} sub="out of 100" />
          <ul className="grid min-w-0 flex-1 gap-2">
            {healthParts.map((item) => (
              <li key={item.label} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-sm">
                <span className={cn("h-2 w-2 rounded-full", DOT_TONE[item.tone])} aria-hidden="true" />
                <span className="truncate font-medium text-foreground">{item.label.replace(" Health", "")}</span>
                <span className="tabular-nums text-muted-foreground">{item.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    );
  }
  const weakest = [...healthParts].sort((a, b) => a.pct - b.pct)[0];
  return (
    <Panel title="Business Health Score" subtitle="Weighted across schedule, money, communication and defects" action={<span className="text-chart-5">↑ {HEALTH_SCORE.delta}</span>}>
      <div className="@container">
        <div className="flex flex-col gap-5 @min-[34rem]:flex-row @min-[34rem]:items-center">
          <div className="flex items-center gap-4">
            <Ring size="lg" value={HEALTH_SCORE.score} label={String(HEALTH_SCORE.score)} sub="out of 100" />
            <div className="min-w-0 text-sm @min-[34rem]:hidden">
              <p className="font-medium text-foreground">Healthy overall</p>
              <p className="text-xs text-muted-foreground">{watch} areas to watch</p>
            </div>
          </div>
          <ul className="grid min-w-0 flex-1 gap-3 @min-[46rem]:grid-cols-2">
            {healthParts.map((item) => (
              <li key={item.label} className="min-w-0">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-foreground">{item.label}</span>
                  <span className={cn("shrink-0 tabular-nums font-semibold", TEXT_TONE[item.tone])}>{item.pct}%</span>
                </div>
                <Meter value={item.pct} tone={item.tone} className="mt-1.5" />
                <p className="mt-1 truncate text-xs text-muted-foreground">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
        {weakest && (
          <p className="mt-4 rounded-lg bg-surface px-3 py-2 text-xs text-secondary-foreground">
            <span className="font-semibold text-foreground">Focus next:</span> {weakest.label} is lowest at {weakest.pct}% ({weakest.note}).
          </p>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------ Critical alerts ------------------------------ */
export function AlertsTile({ size }: { size: WidgetSize }) {
  const critical = CRITICAL_ALERTS.filter((alert) => alert.tone === "bad").length;
  if (size === "small") {
    return (
      <MiniTile label="Critical alerts" value={CRITICAL_ALERTS.length} tone="bad" sub={`${critical} critical · ${CRITICAL_ALERTS.length - critical} watch`}>
        <p className="mt-auto truncate pt-1 text-[0.6875rem] font-medium text-foreground">{CRITICAL_ALERTS[0]?.title.split(" — ")[0]}</p>
      </MiniTile>
    );
  }
  const large = size === "large";
  return (
    <Panel title="Critical Alerts" subtitle={large ? `${critical} critical · ${CRITICAL_ALERTS.length - critical} need attention` : undefined} action="View all" bodyClassName="space-y-2.5">
      {CRITICAL_ALERTS.map((alert) => (
        <div key={alert.title} className={cn("rounded-lg border-l-2 bg-surface p-3", alert.tone === "bad" ? "border-destructive" : "border-construction", large && "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3")}>
          <div className="min-w-0">
            {large && <Pill tone={alert.tone} className="mb-1">{alert.tone === "bad" ? "Critical" : "Warning"}</Pill>}
            <p className="text-sm font-medium text-foreground">{alert.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{alert.meta}</p>
          </div>
          {large && <Button size="sm" variant="outline">Review</Button>}
        </div>
      ))}
    </Panel>
  );
}

/* --------------------------------- KPI tiles --------------------------------- */
type Kpi = (typeof DASHBOARD_KPIS)[number];
export function KpiTile({ kpi, size }: { kpi: Kpi; size: WidgetSize }) {
  const tone = "tone" in kpi ? kpi.tone : undefined;
  if (size === "small") return <MiniTile label={kpi.label} icon={kpi.icon} value={compactFigure(kpi.value)} tone={tone} sub={kpi.brief} />;
  if (size === "medium") return <StatTile {...kpi} />;
  const parts = kpi.meta.split(" · ");
  return (
    <Panel title={kpi.label} action={<AppIcon name={kpi.icon} className="h-4 w-4 text-muted-foreground" />}>
      <p className={cn("text-3xl font-semibold tabular-nums tracking-tight", tone ? TEXT_TONE[tone] : "text-foreground")}>{kpi.value}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {parts.map((part) => (
          <li key={part} className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-xs text-secondary-foreground">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-azure" aria-hidden="true" />
            <span className="truncate">{part}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ----------------------------- Today's priorities ----------------------------- */
export function PrioritiesTile({ size }: { size: WidgetSize }) {
  const critical = TODAYS_PRIORITIES.filter((item) => item.tone === "bad").length;
  if (size === "small") {
    return (
      <MiniTile label="Today's priorities" value={TODAYS_PRIORITIES.length} sub={`${critical} urgent`}>
        <p className="mt-auto truncate pt-1 text-[0.6875rem] font-medium text-foreground">{TODAYS_PRIORITIES[0]?.title.split(" — ")[0]}</p>
      </MiniTile>
    );
  }
  const large = size === "large";
  return (
    <Panel title="Today's Priorities" subtitle={large ? `${critical} urgent · ${TODAYS_PRIORITIES.length - critical} scheduled or for review` : undefined} action={<span className="text-muted-foreground">{TODAYS_PRIORITIES.length} actions</span>} bodyClassName="p-0 sm:p-0">
      <ul className="divide-y divide-border">
        {TODAYS_PRIORITIES.map((item) => (
          <li key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5">
            <span className={cn("h-9 w-1 shrink-0 rounded-full", DOT_TONE[item.tone])} aria-hidden="true" />
            <span className="min-w-0">
              <span className={cn("block text-sm font-medium text-foreground", !large && "truncate")}>{item.title}</span>
              <span className="block truncate text-xs text-muted-foreground">{item.meta}</span>
            </span>
            {large ? <Button size="sm" variant="outline" className="shrink-0">{item.action}</Button> : <button className="shrink-0 text-xs font-semibold text-azure">{item.action}</button>}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ------------------------------- Upcoming today ------------------------------- */
export function UpcomingTile({ size }: { size: WidgetSize }) {
  const [next] = UPCOMING_TODAY;
  if (size === "small") {
    return <MiniTile label="Next up" icon="calendar" value={next?.time ?? "—"} sub={next?.title.split(" — ")[0]}><p className="mt-auto pt-1 text-[0.6875rem] text-muted-foreground">+{UPCOMING_TODAY.length - 1} more today</p></MiniTile>;
  }
  const large = size === "large";
  return (
    <Panel title="Upcoming Today" subtitle={large ? `${UPCOMING_TODAY.length} events · ${UPCOMING_TODAY[0]?.time} to ${UPCOMING_TODAY.at(-1)?.time}` : undefined} bodyClassName={large ? "@container" : "space-y-3"}>
      <div className={cn(large ? "grid gap-3 @min-[34rem]:grid-cols-2" : "space-y-3")}>
        {UPCOMING_TODAY.map((item) => (
          <div key={item.title} className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-3", large && "rounded-lg border border-border bg-surface p-3")}>
            <span className={cn("mt-1.5 h-2 w-2 rounded-full", item.active ? "bg-azure ring-4 ring-azure/15" : "bg-border")} aria-hidden="true" />
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">{item.time}{large && item.active && <Pill tone="info">Next</Pill>}</span>
              <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
              <span className={cn("block truncate text-xs text-muted-foreground", !large && "widget-detail")}>{item.meta}</span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------- Projects requiring attention ------------------------- */
type ProjectTileRow = { id: string; name: string; status: string; progress: number; budget: string; milestone: string; flag?: { label: string; tone: Tone } | undefined };
/** Projects come from the shared store, so database projects replace the samples here too. */
function useProjectRows(): ProjectTileRow[] {
  const { records } = usePlatform();
  return records.filter((record) => record.kind === "Project").map((record) => {
    const sample = PROJECT_ROWS.find((row) => row.id === record.id);
    return { id: record.id, name: record.title, status: record.status, progress: record.progress, budget: sample?.budget ?? compactCurrency(record.amount), milestone: record.notes || record.address || "—", flag: sample?.flag };
  });
}

function ProjectList({ rows }: { rows: ProjectTileRow[] }) {
  if (!rows.length) return <p className="px-4 py-6 text-sm text-muted-foreground">No projects yet.</p>;
  return (
    <ul className="divide-y divide-border">
      {rows.map((row) => (
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
  );
}

export function ProjectsTile({ size }: { size: WidgetSize }) {
  const rows = useProjectRows();
  const tally = (status: string) => rows.filter((row) => row.status === status).length;
  if (size === "small") {
    return (
      <MiniTile label="Projects flagged" icon="projects" value={rows.length} sub={`${tally("Delayed")} delayed · ${tally("At Risk")} at risk`}>
        <div className="mt-2 flex h-1.5 overflow-hidden rounded-full" aria-hidden="true">
          {rows.map((row) => <span key={row.id} className={cn("flex-1", DOT_TONE[STATUS_TONE[row.status] ?? "muted"])} />)}
        </div>
      </MiniTile>
    );
  }
  if (size === "medium") return <Panel title="Projects Requiring Attention" action="Columns" bodyClassName="p-0 sm:p-0"><ProjectList rows={rows} /></Panel>;
  return (
    <Panel title="Projects Requiring Attention" subtitle={`${tally("On Track")} on track · ${tally("At Risk")} at risk · ${tally("Delayed")} delayed`} action="Columns" bodyClassName="p-0 sm:p-0">
      <div className="@container">
        <div className="@min-[46rem]:hidden"><ProjectList rows={rows} /></div>
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
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-surface">
                <td className="px-5 py-3.5 font-medium text-foreground"><Link to="/app/projects/$projectId" params={{ projectId: row.id }} className="hover:text-azure">{row.name}</Link></td>
                <td className="px-3 py-3.5"><StatusPill tone={STATUS_TONE[row.status] ?? "muted"}>{row.status}</StatusPill></td>
                <td className="px-3 py-3.5"><span className="flex items-center gap-2"><Meter value={row.progress} className="w-20" /><span className="tabular-nums text-xs text-muted-foreground">{row.progress}%</span></span></td>
                <td className="px-3 py-3.5 tabular-nums text-foreground">{row.budget}</td>
                <td className="px-3 py-3.5 text-secondary-foreground">{row.milestone}</td>
                <td className="px-5 py-3.5">{row.flag ? <Pill tone={row.flag.tone}><Flag className="h-3 w-3" /> {row.flag.label}</Pill> : <span className="text-muted-foreground">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* --------------------------------- AI insights --------------------------------- */
export function InsightsTile({ size }: { size: WidgetSize }) {
  if (size === "small") {
    return <MiniTile label="AI insights" value={AI_INSIGHT_CARDS.length} tone="info" sub="suggestions"><p className="mt-auto line-clamp-2 pt-1 text-[0.6875rem] font-medium leading-snug text-foreground">{AI_INSIGHT_CARDS[0]?.title}</p></MiniTile>;
  }
  const large = size === "large";
  return (
    <Panel title={<span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-azure" /> AI Insights</span>} subtitle={large ? "Illustrative suggestions from sample records" : undefined} bodyClassName={cn("space-y-2 sm:space-y-3", large && "@container")}>
      <div className={cn(large ? "grid gap-3 @min-[34rem]:grid-cols-2" : "space-y-3")}>
        {AI_INSIGHT_CARDS.map((card) => (
          <div key={card.title} className="rounded-lg border border-azure/20 bg-azure/[0.04] p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <p className="text-sm font-medium text-foreground">{card.title}</p>
              <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className={cn("mt-1 text-xs text-muted-foreground", !large && "widget-detail")}>{card.meta}</p>
            {large ? (
              <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" className="bg-azure text-azure-foreground hover:bg-azure/90">{card.action}</Button><Button size="sm" variant="ghost">Dismiss</Button></div>
            ) : (
              <button className="mt-2 text-xs font-semibold text-azure">→ {card.action}</button>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* -------------------------------- Quick actions -------------------------------- */
const ACTION_HELP: Record<string, string> = {
  "New Task": "Assign work your team can see",
  "Add Invoice": "Record money owed or paid",
  "Invite Trade": "Bring a subcontractor onto a job",
  Schedule: "Book a site visit or meeting",
};

export function QuickActionsTile({ size }: { size: WidgetSize }) {
  if (size === "small") {
    return (
      <div className="h-full rounded-xl border border-border bg-card p-2.5 shadow-panel">
        <p className="mb-1.5 truncate text-[0.6875rem] font-medium text-muted-foreground">Quick add</p>
        <div className="grid grid-cols-2 gap-1.5">
          {QUICK_ACTIONS.map((action) => (
            <button key={action.label} aria-label={action.label} title={action.label} className="grid h-9 place-items-center rounded-lg border border-border bg-surface text-azure transition-colors hover:border-azure/40">
              <AppIcon name={action.icon} className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    );
  }
  const large = size === "large";
  return (
    <Panel title="Quick Actions" bodyClassName={large ? "@container" : "grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-3"}>
      {large ? (
        <div className="grid grid-cols-2 gap-2 @min-[40rem]:grid-cols-4 sm:gap-3">
          {QUICK_ACTIONS.map((action) => (
            <button key={action.label} className="flex min-w-0 flex-col items-start gap-1 rounded-lg border border-border bg-surface p-3 text-left transition-colors hover:border-azure/40">
              <AppIcon name={action.icon} className="h-4 w-4 text-azure" />
              <span className="text-sm font-medium text-foreground">{action.label}</span>
              <span className="text-xs text-muted-foreground">{ACTION_HELP[action.label]}</span>
            </button>
          ))}
        </div>
      ) : (
        QUICK_ACTIONS.map((action) => (
          <button key={action.label} className="flex min-w-0 flex-col items-center gap-1.5 rounded-lg border border-border bg-surface px-1 py-2.5 text-center text-[0.6875rem] font-medium text-secondary-foreground transition-colors hover:border-azure/40 hover:text-foreground sm:gap-2 sm:px-3 sm:py-4 sm:text-xs">
            <AppIcon name={action.icon} className="h-4 w-4 text-azure" />
            <span className="w-full truncate">{action.label}</span>
          </button>
        ))
      )}
    </Panel>
  );
}

/* ---------------------------------- Cashflow ---------------------------------- */
function Sparkline({ height = "h-28 sm:h-44", outflow = true, labels = true }: { height?: string; outflow?: boolean; labels?: boolean }) {
  const width = 640;
  const h = 180;
  const max = 460;
  const line = (key: "inflow" | "outflow") =>
    CASHFLOW_SERIES.map((point, index) => `${index === 0 ? "M" : "L"}${((index / (CASHFLOW_SERIES.length - 1)) * width).toFixed(1)},${(h - (point[key] / max) * h).toFixed(1)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${h}`} className={cn("w-full", height)} role="img" aria-label="Cashflow last six months" preserveAspectRatio="none">
        {labels && [0.25, 0.5, 0.75, 1].map((step) => <line key={step} x1="0" x2={width} y1={h * step} y2={h * step} className="stroke-border" strokeWidth="1" />)}
        {outflow && <path d={line("outflow")} fill="none" className="stroke-border" strokeWidth="2.5" strokeLinecap="round" />}
        <path d={line("inflow")} fill="none" className="stroke-azure" strokeWidth={labels ? 2.5 : 6} strokeLinecap="round" vectorEffect={labels ? undefined : "non-scaling-stroke"} />
      </svg>
      {labels && <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground">{CASHFLOW_SERIES.map((point) => <span key={point.month}>{point.month}</span>)}</div>}
    </div>
  );
}

const Legend = () => (
  <span className="flex items-center gap-3 text-xs text-muted-foreground">
    <span className={cn("flex items-center gap-1.5", TEXT_TONE.info)}><span className="h-2 w-2 rounded-full bg-azure" /> In</span>
    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-border" /> Out</span>
  </span>
);

export function CashflowTile({ size }: { size: WidgetSize }) {
  const last = CASHFLOW_SERIES.at(-1);
  const net = last ? (last.inflow - last.outflow) * 1000 : 0;
  if (size === "small") {
    return <MiniTile label="Cashflow" value={compactCurrency(net, { signed: true })} tone="good" sub={`${last?.month} net`}><div className="mt-auto pt-1.5"><Sparkline height="h-6" outflow={false} labels={false} /></div></MiniTile>;
  }
  if (size === "medium") return <Panel title="Cashflow — 6 Months" action={<Legend />}><Sparkline height="h-24 sm:h-32" /></Panel>;
  const totalIn = CASHFLOW_SERIES.reduce((sum, p) => sum + p.inflow, 0) * 1000;
  const totalOut = CASHFLOW_SERIES.reduce((sum, p) => sum + p.outflow, 0) * 1000;
  const best = [...CASHFLOW_SERIES].sort((a, b) => b.inflow - b.outflow - (a.inflow - a.outflow))[0];
  const stats: [string, string][] = [["Money in", compactCurrency(totalIn)], ["Money out", compactCurrency(totalOut)], ["Net surplus", compactCurrency(totalIn - totalOut, { signed: true })], ["Best month", best ? `${best.month} · ${compactCurrency((best.inflow - best.outflow) * 1000)}` : "—"]];
  return (
    <Panel title="Cashflow — Last 6 Months" subtitle="Net surplus grew 31% since January" action={<Legend />}>
      <Sparkline />
      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-surface px-3 py-2">
            <dt className="text-[0.6875rem] text-muted-foreground">{label}</dt>
            <dd className="truncate text-sm font-semibold tabular-nums text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/* ------------------------------- Project health ------------------------------- */
const healthLabel = (health: number) => (health >= 80 ? "On Track" : health >= 60 ? "Attention Required" : "Critically Delayed");

export function ProjectHealthTile({ size }: { size: WidgetSize }) {
  const { records } = usePlatform();
  const projects = records.filter((record) => record.kind === "Project");
  const average = projects.length ? Math.round(projects.reduce((sum, p) => sum + p.health, 0) / projects.length) : 0;
  const attention = projects.filter((p) => p.health < 80).length;
  if (size === "small") {
    return (
      <MiniTile label="Project health" value={projects.length ? average : "—"} unit={projects.length ? "/100 avg" : undefined} sub={`${count(attention, "need")} attention`}>
        <Meter value={average} tone={average >= 80 ? "good" : "warn"} className="mt-2" />
      </MiniTile>
    );
  }
  if (size === "medium") {
    return (
      <Panel title="Project health" action={<span className="text-muted-foreground">{average}/100 avg</span>} bodyClassName="space-y-2.5">
        {projects.map((p) => (
          <Link key={p.id} to="/app/projects/$projectId" params={{ projectId: p.id }} className="block min-w-0 hover:text-azure">
            <span className="flex items-baseline justify-between gap-2 text-sm"><span className="truncate font-medium">{p.title}</span><span className="shrink-0 tabular-nums text-xs text-muted-foreground">{p.health}</span></span>
            <Meter value={p.health} tone={p.health >= 80 ? "good" : p.health >= 60 ? "warn" : "bad"} className="mt-1" />
          </Link>
        ))}
        {!projects.length && <p className="text-sm text-muted-foreground">No projects yet.</p>}
      </Panel>
    );
  }
  return (
    <Panel title="Project health breakdown" subtitle={`${projects.length} projects · ${average}/100 average · ${attention} need attention`} bodyClassName="@container">
      <div className="grid gap-3 @min-[34rem]:grid-cols-2 @min-[60rem]:grid-cols-4">
        {projects.map((p) => (
          <details key={p.id} className="rounded-lg border border-border bg-card p-3">
            <summary className="cursor-pointer text-sm font-medium">{p.title}<span className="ml-2 text-azure">{p.health}/100</span><span className="mt-2 block"><HealthBadge health={healthLabel(p.health)} /></span></summary>
            <div className="mt-3 space-y-2.5">
              {["Schedule", "Financial", "Defect", "Communication", "Delivery"].map((area, index) => {
                const value = Math.max(40, p.health - index * 3);
                return <div key={area}><div className="mb-1 flex justify-between text-xs"><span>{area} health</span><span>{value}%</span></div><Meter value={value} tone={index === 4 ? "warn" : "info"} /></div>;
              })}
              <Button asChild size="sm" variant="outline"><Link to="/app/projects/$projectId" params={{ projectId: p.id }}>Open project</Link></Button>
            </div>
          </details>
        ))}
      </div>
      {!projects.length && <p className="text-sm text-muted-foreground">No projects yet.</p>}
    </Panel>
  );
}
