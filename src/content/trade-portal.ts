/**
 * Trade Portal V1 demo data and pure rules. Session-only prototype —
 * no real authorisation or storage. Rules here are what the UI enforces.
 */

export const TRADE_TODAY = "2025-06-17";

export type TaskStatus = "Assigned" | "In Progress" | "Awaiting Inspection" | "Awaiting Sign Off" | "Completed";
export const TASK_COLUMNS: TaskStatus[] = ["Assigned", "In Progress", "Awaiting Inspection", "Awaiting Sign Off", "Completed"];
export type Priority = "High" | "Medium" | "Low";

export type TradeTask = {
  id: string;
  title: string;
  project: string;
  employer: string;
  priority: Priority;
  due: string;
  status: TaskStatus;
  workers: string[];
};

export type DefectStatus = "Open" | "In Progress" | "Awaiting Inspection" | "Awaiting Review" | "Closed";
export type TradeDefect = {
  id: string;
  title: string;
  project: string;
  employer: string;
  location: string;
  status: DefectStatus;
  requestInspectionOnCompletion: boolean;
  photos: number;
  notes: string[];
  rejected?: boolean;
};

export type DocCategory = "Drawings" | "Specifications" | "SWMS" | "Site Instructions" | "Project Photos";
export type TradeDoc = { id: string; name: string; category: DocCategory; project: string; revision: string; sharedWithTrade: boolean; updated: string };

export type ComplianceItem = { id: string; name: string; status: "Verified" | "Expiring" | "Missing" | "Requested"; expiry?: string; required: boolean };

export const TRADE_PROFILE = {
  company: "ABC Electrical Pty Ltd",
  abn: "51 824 753 556",
  licence: "EC 293847",
  category: "Electrical",
  serviceArea: "Sydney Metro, Central Coast",
  contact: "Sam Patel · 0412 555 019 · sam@abcelectrical.com.au",
  website: "abcelectrical.com.au",
  insurance: "Current — Public Liability $20M",
};

/** Minimum documents a trade must hold to register. */
export const REGISTRATION_MINIMUM = ["White Card", "ABN", "Trade Licence", "Public Liability"];

export const COMPLIANCE: ComplianceItem[] = [
  { id: "c1", name: "White Card", status: "Verified", required: true },
  { id: "c2", name: "Trade Licence", status: "Verified", expiry: "2026-03-01", required: true },
  { id: "c3", name: "ABN", status: "Verified", required: true },
  { id: "c4", name: "Public Liability", status: "Expiring", expiry: "2025-07-05", required: true },
  { id: "c5", name: "Workers Compensation", status: "Verified", expiry: "2025-12-31", required: false },
  { id: "c6", name: "Professional Certifications", status: "Verified", required: false },
  { id: "c7", name: "Working At Heights", status: "Missing", required: false },
  { id: "c8", name: "EWP Ticket", status: "Requested", required: false },
  { id: "c9", name: "Electrical Certifications", status: "Verified", required: false },
];

export const FUTURE_COMPLIANCE_REQUESTS = ["Working At Heights", "Scissor Lift", "EWP", "Asbestos", "Traffic Control"];

export function registrationReady(items: ComplianceItem[]): { ready: boolean; missing: string[] } {
  const missing = REGISTRATION_MINIMUM.filter(
    (name) => !items.some((i) => i.name === name && (i.status === "Verified" || i.status === "Expiring")),
  );
  return { ready: missing.length === 0, missing };
}

export const TRADE_TASKS: TradeTask[] = [
  { id: "t1", title: "Rough-in kitchen circuits", project: "Smith Residence", employer: "Hartley Construction", priority: "High", due: "2025-06-17", status: "In Progress", workers: ["SP", "JL"] },
  { id: "t2", title: "Install switchboard", project: "Harbour View Apartments", employer: "XYZ Builders", priority: "High", due: "2025-06-16", status: "Assigned", workers: ["SP"] },
  { id: "t3", title: "Level 2 cable tray", project: "Harbour View Apartments", employer: "XYZ Builders", priority: "Medium", due: "2025-06-20", status: "Assigned", workers: ["MK"] },
  { id: "t4", title: "Bathroom exhaust wiring", project: "Smith Residence", employer: "Hartley Construction", priority: "Low", due: "2025-06-24", status: "Awaiting Inspection", workers: ["JL"] },
  { id: "t5", title: "Car park lighting test", project: "Parramatta Retail Hub", employer: "DEF Constructions", priority: "Medium", due: "2025-06-19", status: "Awaiting Sign Off", workers: ["SP", "MK"] },
  { id: "t6", title: "Temporary power", project: "Parramatta Retail Hub", employer: "DEF Constructions", priority: "Low", due: "2025-06-10", status: "Completed", workers: ["MK"] },
];

export const TRADE_DEFECTS: TradeDefect[] = [
  { id: "d1", title: "GPO not flush — bedroom 2", project: "Smith Residence", employer: "Hartley Construction", location: "Bedroom 2", status: "Open", requestInspectionOnCompletion: true, photos: 1, notes: [] },
  { id: "d2", title: "Downlight flicker — lobby", project: "Harbour View Apartments", employer: "XYZ Builders", location: "Ground lobby", status: "In Progress", requestInspectionOnCompletion: false, photos: 2, notes: ["Driver replaced, monitoring."] },
  { id: "d3", title: "Missing circuit labels", project: "Parramatta Retail Hub", employer: "DEF Constructions", location: "MSB", status: "Open", requestInspectionOnCompletion: false, photos: 0, notes: [], rejected: true },
  { id: "d4", title: "Exposed cable — garage", project: "Smith Residence", employer: "Hartley Construction", location: "Garage", status: "Awaiting Inspection", requestInspectionOnCompletion: true, photos: 3, notes: ["Cable enclosed in conduit."] },
];

export const TRADE_DOCS: TradeDoc[] = [
  { id: "doc1", name: "Electrical layout E-101", category: "Drawings", project: "Smith Residence", revision: "Rev D", sharedWithTrade: true, updated: "2025-06-16" },
  { id: "doc2", name: "Lighting specification", category: "Specifications", project: "Harbour View Apartments", revision: "v2", sharedWithTrade: true, updated: "2025-06-11" },
  { id: "doc3", name: "SWMS — Live electrical work", category: "SWMS", project: "Harbour View Apartments", revision: "v1", sharedWithTrade: true, updated: "2025-06-02" },
  { id: "doc4", name: "SI-014 Relocate switchboard", category: "Site Instructions", project: "Harbour View Apartments", revision: "—", sharedWithTrade: true, updated: "2025-06-15" },
  { id: "doc5", name: "Rough-in progress photos", category: "Project Photos", project: "Smith Residence", revision: "—", sharedWithTrade: true, updated: "2025-06-14" },
  { id: "doc6", name: "Head contract & margins", category: "Specifications", project: "Smith Residence", revision: "v3", sharedWithTrade: false, updated: "2025-06-01" },
  { id: "doc7", name: "Client budget report", category: "Specifications", project: "Parramatta Retail Hub", revision: "v1", sharedWithTrade: false, updated: "2025-06-05" },
];

export const UPCOMING_WORKS = [
  { project: "Smith Residence", item: "Fit-off lighting", date: "2025-06-21" },
  { project: "Harbour View Apartments", item: "Level 3 rough-in", date: "2025-06-28" },
  { project: "Parramatta Retail Hub", item: "Tenancy switchboards", date: "2025-07-08" },
  { project: "Smith Residence", item: "Final electrical certificate", date: "2025-07-14" },
];

export const SCHEDULE = {
  current: [{ project: "Smith Residence", activity: "Electrical rough-in", ends: "2025-06-19" }, { project: "Harbour View Apartments", activity: "Switchboard install", ends: "2025-06-18" }],
  upcoming: [{ project: "Harbour View Apartments", activity: "Level 3 rough-in", starts: "2025-06-23" }, { project: "Parramatta Retail Hub", activity: "Tenancy fit-out", starts: "2025-07-01" }],
  critical: [{ label: "Plaster start — Smith Residence (rough-in must be inspected)", date: "2025-06-20" }, { label: "Authority inspection — Harbour View", date: "2025-06-27" }],
  completion: [{ label: "Smith Residence electrical complete", date: "2025-07-14" }, { label: "Harbour View Level 3 complete", date: "2025-07-25" }],
};

export const PROJECT_FEED = [
  { type: "Mention", text: "@Sam can you confirm GPO heights in kitchen?", project: "Smith Residence", who: "James Hartley", when: "25m" },
  { type: "Site Request", text: "Please isolate Level 2 power Friday 7am for ceiling works.", project: "Harbour View Apartments", who: "Site Manager", when: "1h" },
  { type: "Document", text: "Electrical layout E-101 revised to Rev D.", project: "Smith Residence", who: "Foresite", when: "3h" },
  { type: "Update", text: "Car park lighting ready for sign off.", project: "Parramatta Retail Hub", who: "Mia King", when: "Yesterday" },
];

export const TRADE_NOTIFICATIONS = [
  "New task: Install switchboard",
  "Task updated: Level 2 cable tray",
  "New defect: GPO not flush — bedroom 2",
  "Drawing revision: E-101 Rev D",
  "Document shared: SI-014",
  "Inspection requested: Exposed cable — garage",
  "Defect rejected: Missing circuit labels",
  "Message received from James Hartley",
  "Approaching deadline: Rough-in kitchen circuits (today)",
  "Overdue: Install switchboard",
];

/* ------------------------------- Pure rules -------------------------------- */

export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

export function urgentActions(tasks: TradeTask[], defects: TradeDefect[], today = TRADE_TODAY) {
  const open = tasks.filter((t) => t.status !== "Completed");
  return {
    dueToday: open.filter((t) => t.due === today).length,
    overdue: open.filter((t) => t.due < today).length,
    defects: defects.filter((d) => d.status === "Open" || d.status === "In Progress").length,
    inspections: defects.filter((d) => d.status === "Awaiting Inspection").length + tasks.filter((t) => t.status === "Awaiting Inspection").length,
  };
}

export function upcomingWithin<T extends { date: string }>(items: T[], days: 7 | 14 | 30, today = TRADE_TODAY) {
  return items.filter((i) => {
    const d = daysBetween(today, i.date);
    return d >= 0 && d <= days;
  });
}

/** Only documents explicitly shared with the trade are ever visible. */
export function visibleTradeDocs(docs: TradeDoc[], query = "") {
  const q = query.trim().toLowerCase();
  return docs.filter((d) => d.sharedWithTrade && (!q || `${d.name} ${d.project} ${d.category}`.toLowerCase().includes(q)));
}

/** Trade completes a defect: follows the builder's inspection setting automatically. Never closes. */
export function markDefectComplete(defect: TradeDefect): TradeDefect {
  if (defect.status === "Closed") return defect;
  return { ...defect, rejected: false, status: defect.requestInspectionOnCompletion ? "Awaiting Inspection" : "Awaiting Review" };
}

export const TRADE_CAN_CLOSE_DEFECTS = false;
