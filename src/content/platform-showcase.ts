export type ShowcaseRow = { name: string; meta: string; value: string; tone: "good" | "warn" | "bad" };
export type ShowcaseSection = { label: string; rows: ShowcaseRow[]; layout?: "progress" | "photos" };
export type ShowcaseView = { id: string; label: string; description: string; sections: ShowcaseSection[] };

const row = (name: string, meta: string, value: string, tone: ShowcaseRow["tone"] = "good"): ShowcaseRow => ({ name, meta, value, tone });

// Public, illustrative projections only: never connect these to private app state.
export const SHOWCASE_VIEWS: ShowcaseView[] = [
  {
    id: "owner", label: "Owner View", description: "Manage projects, teams, financials and operations from a single workspace.",
    sections: [
      { label: "Dashboard", rows: [row("Active projects", "Portfolio overview", "3 projects"), row("Trade activity", "Electrical complete · plasterboard in progress", "On track"), row("Open defects", "2 ready for inspection", "6 open", "warn"), row("Outstanding approvals", "1 client decision due today", "3 pending", "warn")] },
      { label: "Projects", rows: [row("Bayside Townhouses Stage 2", "Lock-up · Melbourne, VIC", "64%"), row("Harbour View Apartments", "Framing · window delivery delayed", "38%", "warn"), row("Northline Offices", "Fit-out · next inspection booked", "82%")] },
      { label: "Financials", rows: [row("Contract value", "Bayside Townhouses Stage 2", "$850,000"), row("Approved variations", "Kitchen upgrade and additional lighting", "$24,500"), row("Pending variations", "Awaiting client approval", "$8,200", "warn"), row("Outstanding progress claim", "Lock-up stage", "$85,000", "warn")] },
      { label: "Project Health", rows: [row("Schedule health", "Window delivery requires follow-up", "78 / 100", "warn"), row("Financial health", "Progress claims up to date", "94 / 100"), row("Defect health", "Rectification before next inspection", "86 / 100"), row("Communication health", "Weekly updates issued", "96 / 100")] },
      { label: "Reports", rows: [row("Project status report", "Programme, milestones and delivery", "Ready"), row("Financial summary", "Claims and variations by project", "Ready"), row("Defect register", "Open items and inspection evidence", "6 open", "warn"), row("Trade compliance report", "Insurance and licence review", "1 expiring", "warn")] },
      { label: "Permissions", rows: [row("Organisation Admin", "Organisation-wide settings and access", "Full access"), row("Project Manager", "Assigned projects and delivery", "Project scope"), row("Client", "Approvals, updates and shared documents", "Client portal"), row("Trade", "Assigned work and explicitly shared documents", "Trade portal")] },
    ],
  },
  {
    id: "client", label: "Client View", description: "Provide transparency, confidence and real-time visibility throughout project delivery.",
    sections: [
      { label: "Approvals", rows: [row("Kitchen benchtop selection", "Stone finish · decision due Friday", "Requires action", "warn"), row("Additional lighting variation", "$2,400 · awaiting your decision", "Requires action", "warn"), row("Bathroom tile selection", "Porcelain finish confirmed", "Approved")] },
      { label: "Project Updates", rows: [row("Completed this period", "Roof sheeting and external windows installed", "Complete"), row("Upcoming works", "Joinery installation and stone benchtops", "Next week"), row("Risks / delays", "Window delivery shifted by two days", "Monitoring", "warn"), row("Approvals required", "Confirm kitchen benchtop finish", "Due Friday", "warn")] },
      { label: "Progress", layout: "progress", rows: [row("Tender", "5% stage weight", "100%"), row("Preparation", "15% stage weight", "100%"), row("Construction", "65% stage weight", "80%"), row("Defects", "10% stage weight", "0%", "warn"), row("Completion", "5% stage weight", "0%", "warn")] },
      { label: "Project Health", rows: [row("Schedule health", "Completion target unchanged", "78 / 100", "warn"), row("Financial health", "One variation awaiting your decision", "94 / 100"), row("Defect health", "Builder coordinating rectification", "86 / 100"), row("Delivery health", "Stone benchtops scheduled next", "84 / 100")] },
      { label: "Photos", layout: "photos", rows: [row("Lock-up complete", "External · roofing, windows and brickwork", "Shared photo")] },
      { label: "Defects", rows: [row("Hallway paint scuff", "Your suggestion · awaiting builder acceptance", "Suggested defect", "warn"), row("Bathroom silicone finish", "Builder accepted · rectification scheduled", "In progress", "warn"), row("Kitchen cabinet alignment", "Builder inspection booked", "Awaiting inspection")] },
    ],
  },
  {
    id: "trade", label: "Trade View", description: "Provide every trade with a clear, organised and productive workspace.",
    sections: [
      { label: "Assigned Tasks", rows: [row("Rough-in kitchen circuits", "Bayside Townhouses Stage 2 · high priority · today", "In progress"), row("Install switchboard", "Harbour View Apartments · overdue", "Assigned", "bad"), row("Bathroom exhaust wiring", "Bayside Townhouses Stage 2 · evidence uploaded", "Awaiting inspection")] },
      { label: "Upcoming Works", rows: [row("Fit-off lighting", "Bayside Townhouses Stage 2 · next 7 days", "Scheduled"), row("Level 3 rough-in", "Harbour View Apartments · next 14 days", "Scheduled"), row("Tenancy switchboards", "Parramatta Retail Hub · next 30 days", "Planned")] },
      { label: "Defects", rows: [row("GPO not flush — bedroom 2", "Bayside Townhouses Stage 2 · rectification assigned", "Open", "warn"), row("Downlight flicker — lobby", "Harbour View Apartments · driver replaced", "In progress", "warn"), row("Exposed cable — garage", "Bayside Townhouses Stage 2 · builder inspection required", "Awaiting inspection")] },
      { label: "Communications", rows: [row("James Hartley mentioned you", "Confirm GPO heights in the kitchen", "Mention", "warn"), row("Site power isolation request", "Harbour View Apartments · Friday 7am", "Site request", "warn"), row("Car park lighting update", "Parramatta Retail Hub · ready for sign off", "Project feed")] },
      { label: "Drawings", rows: [row("Electrical layout E-101", "Bayside Townhouses Stage 2 · explicitly shared by builder", "Rev D"), row("Lighting specification", "Harbour View Apartments · shared specification", "v2"), row("SI-014 Relocate switchboard", "Harbour View Apartments · shared site instruction", "Current")] },
      { label: "Compliance", rows: [row("White Card", "Required credential", "Verified"), row("ABN", "Business registration", "Verified"), row("Trade Licence", "Electrical contractor credential", "Verified"), row("Public Liability", "Renewal approaching", "Expiring", "warn")] },
    ],
  },
];

export function showcaseSelection(viewId: string, sectionIndex: number) {
  const view = SHOWCASE_VIEWS.find((item) => item.id === viewId) ?? SHOWCASE_VIEWS[0];
  if (!view) return undefined;
  const section = view.sections[sectionIndex] ?? view.sections[0];
  return section ? { view, section } : undefined;
}