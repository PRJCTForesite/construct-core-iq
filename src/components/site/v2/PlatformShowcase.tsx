import { useState } from "react";
import { cn } from "@/lib/utils";

type View = { id: string; label: string; description: string; tabs: string[]; rows: { name: string; meta: string; value: string; tone: "good" | "warn" | "bad" }[] };

const VIEWS: View[] = [
  {
    id: "owner", label: "Owner View",
    description: "Manage projects, teams, financials and operations from a single workspace.",
    tabs: ["Dashboard", "Projects", "Financials", "Project Health", "Reports", "Permissions"],
    rows: [
      { name: "Smith Residence", meta: "Lock-up · 64%", value: "Healthy", tone: "good" },
      { name: "Harbour Apartments", meta: "Framing · 38%", value: "At risk", tone: "warn" },
      { name: "Northline Offices", meta: "Fit-out · 82%", value: "Healthy", tone: "good" },
      { name: "Portfolio margin", meta: "This quarter", value: "18.4%", tone: "good" },
    ],
  },
  {
    id: "client", label: "Client View",
    description: "Provide transparency, confidence and real-time visibility throughout project delivery.",
    tabs: ["Approvals", "Project Updates", "Progress", "Project Health", "Photos", "Defects"],
    rows: [
      { name: "Kitchen benchtop selection", meta: "Approval due Friday", value: "Pending", tone: "warn" },
      { name: "Weekly update", meta: "Roof sheeting complete", value: "New", tone: "good" },
      { name: "Overall progress", meta: "Weighted by stage", value: "64%", tone: "good" },
      { name: "Hallway paint scuff", meta: "Defect suggestion", value: "Reviewing", tone: "warn" },
    ],
  },
  {
    id: "trade", label: "Trade View",
    description: "Provide every trade with a clear, organised and productive workspace.",
    tabs: ["Assigned Tasks", "Upcoming Works", "Defects", "Communications", "Drawings", "Compliance"],
    rows: [
      { name: "Rough-in level 2", meta: "Harbour Apartments · Today", value: "Urgent", tone: "bad" },
      { name: "Switchboard fit-off", meta: "Smith Residence · Thu", value: "Scheduled", tone: "good" },
      { name: "Electrical drawings Rev C", meta: "Shared by builder", value: "New", tone: "good" },
      { name: "Public liability insurance", meta: "Expires in 21 days", value: "Renew", tone: "warn" },
    ],
  },
];

const toneClass = { good: "bg-azure/10 text-azure", warn: "bg-construction/15 text-foreground", bad: "bg-destructive/10 text-destructive" };

export function PlatformShowcase() {
  const [active, setActive] = useState(VIEWS[0].id);
  const [tab, setTab] = useState(0);
  const view = VIEWS.find((v) => v.id === active) ?? VIEWS[0];
  return (
    <div>
      <div role="tablist" aria-label="Stakeholder experience" className="mx-auto flex w-fit flex-wrap justify-center gap-1 rounded-full border border-border bg-card p-1">
        {VIEWS.map((v) => (
          <button key={v.id} role="tab" aria-selected={v.id === active} onClick={() => { setActive(v.id); setTab(0); }}
            className={cn("rounded-full px-4 py-2 text-sm font-medium transition-colors", v.id === active ? "bg-primary text-primary-foreground" : "text-secondary-foreground hover:bg-muted")}>
            {v.label}
          </button>
        ))}
      </div>
      <p className="mx-auto mt-5 max-w-xl text-center text-secondary-foreground">{view.description}</p>
      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-raised)]">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-destructive/60" /><span className="size-2.5 rounded-full bg-construction/70" /><span className="size-2.5 rounded-full bg-azure/60" />
          <span className="ml-3 truncate text-xs text-muted-foreground">app.foresite.com / {view.label.toLowerCase()}</span>
        </div>
        <div className="grid md:grid-cols-[200px_1fr]">
          <nav className="flex gap-1 overflow-x-auto border-b border-border bg-primary p-2 md:flex-col md:border-b-0" aria-label={`${view.label} sections`}>
            {view.tabs.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={cn("whitespace-nowrap rounded-md px-3 py-2 text-left text-sm", i === tab ? "bg-azure text-azure-foreground" : "text-primary-foreground/75 hover:bg-primary-foreground/10")}>
                {t}
              </button>
            ))}
          </nav>
          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{view.tabs[tab]}</h3>
              <span className="text-xs text-muted-foreground">Live demo data</span>
            </div>
            <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
              {view.rows.map((r) => (
                <li key={r.name} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{r.name}</p><p className="truncate text-xs text-muted-foreground">{r.meta}</p></div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", toneClass[r.tone])}>{r.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
