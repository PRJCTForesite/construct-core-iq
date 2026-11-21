import { DashboardWidgets, type DashboardWidget } from "@/components/app/DashboardWidgets";
import { AlertsTile, CashflowTile, HealthTile, InsightsTile, KpiTile, PrioritiesTile, ProjectHealthTile, ProjectsTile, QuickActionsTile, UpcomingTile } from "@/components/app/DashboardTiles";
import { PageHeading } from "@/components/app/primitives";
import { createFileRoute } from "@tanstack/react-router";
import { DASHBOARD_KPIS, DEMO_USER, TODAY_LABEL } from "@/content/app";
import type { WidgetSize } from "@/lib/workspace-preferences";

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

const KPI_IDS = { "Outstanding Invoices": "invoices", "Active Projects": "projects-count", "Open Defects": "defects-count", "Monthly Cashflow": "cashflow-count" } as const;

function DashboardPage() {
  const widgets: DashboardWidget[] = [
    { id: "health", title: "Business Health Score", content: (size) => <HealthTile size={size} /> },
    { id: "alerts", title: "Critical Alerts", content: (size) => <AlertsTile size={size} /> },
    ...DASHBOARD_KPIS.map((kpi) => ({ id: KPI_IDS[kpi.label as keyof typeof KPI_IDS], title: kpi.label, size: "small" as const, content: (size: WidgetSize) => <KpiTile kpi={kpi} size={size} /> })),
    { id: "priorities", title: "Today's Priorities", content: (size) => <PrioritiesTile size={size} /> },
    { id: "upcoming", title: "Upcoming Today", content: (size) => <UpcomingTile size={size} /> },
    { id: "projects", title: "Projects Requiring Attention", size: "wide", content: (size) => <ProjectsTile size={size} /> },
    { id: "insights", title: "AI Insights", content: (size) => <InsightsTile size={size} /> },
    { id: "quick-actions", title: "Quick Actions", content: (size) => <QuickActionsTile size={size} /> },
    { id: "cashflow", title: "Cashflow", size: "wide", content: (size) => <CashflowTile size={size} /> },
    { id: "project-health", title: "Project health breakdown", size: "wide", content: (size) => <ProjectHealthTile size={size} /> },
  ];
  return <div className="space-y-6"><PageHeading title={`Good morning, ${DEMO_USER.firstName}.`} meta={`${TODAY_LABEL} · Sample workspace`} /><DashboardWidgets widgets={widgets} /></div>;
}
