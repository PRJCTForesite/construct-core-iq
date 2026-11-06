/**
 * Static demo content for the signed-in Foresite application shell.
 * Pure data — no logic, no fetching. Swapped for real data later.
 */

export const DEMO_USER = {
  name: "James Hartley",
  firstName: "James",
  role: "Project Director",
  company: "Hartley Construction",
  initials: "JH",
  email: "james@hartleyconstruction.com.au",
};

export const TODAY_LABEL = "Tuesday, 17 June 2025";

export type NavItem = { label: string; to: string; icon: NavIcon; badge?: string };
export type NavIcon =
  | "dashboard"
  | "workspace"
  | "projects"
  | "calendar"
  | "tasks"
  | "communications"
  | "documents"
  | "financials"
  | "defects"
  | "clients"
  | "trades"
  | "reports"
  | "ai"
  | "settings";

export const APP_NAV: NavItem[] = [
  { label: "Dashboard", to: "/app", icon: "dashboard" },
  { label: "My Workspace", to: "/app/workspace", icon: "workspace" },
  { label: "Projects", to: "/app/projects", icon: "projects" },
  { label: "Calendar", to: "/app/calendar", icon: "calendar" },
  { label: "Tasks", to: "/app/tasks", icon: "tasks" },
  { label: "Communications", to: "/app/communications", icon: "communications", badge: "7" },
  { label: "Documents", to: "/app/documents", icon: "documents" },
  { label: "Financials", to: "/app/financials", icon: "financials" },
  { label: "Defects", to: "/app/defects", icon: "defects", badge: "3" },
  { label: "Clients", to: "/app/clients", icon: "clients" },
  { label: "Client Portal", to: "/app/client-portal", icon: "clients" },
  { label: "Trades", to: "/app/trades", icon: "trades" },
  { label: "Trade Portal", to: "/app/trade-portal", icon: "trades" },
  { label: "Reports", to: "/app/reports", icon: "reports" },
  { label: "AI Insights", to: "/app/ai-insights", icon: "ai" },
  { label: "Administration", to: "/app/administration", icon: "settings" },
  { label: "Settings", to: "/app/settings", icon: "settings" },
];

/* ---------------------------------- Dashboard --------------------------------- */

export const HEALTH_SCORE = {
  score: 82,
  delta: "up 4pts this week",
  breakdown: [
    { label: "Schedule Health", value: "78% — 2 slips", tone: "warn" as const },
    { label: "Financial Health", value: "91% — strong", tone: "good" as const },
    { label: "Communication Health", value: "85% — 1 silent", tone: "good" as const },
    { label: "Defect Health", value: "74% — 3 critical", tone: "warn" as const },
  ],
};

export const CRITICAL_ALERTS = [
  {
    title: "Budget overrun risk detected — Oakwood House +8.2%",
    meta: "AI forecast · 14 days out",
    tone: "bad" as const,
  },
  {
    title: "No communication logged in 5 days — Smith Residence",
    meta: "Client engagement risk",
    tone: "warn" as const,
  },
  {
    title: "Variation #2 unsigned — 12 days outstanding",
    meta: "$18,400 at risk",
    tone: "warn" as const,
  },
];

export const DASHBOARD_KPIS = [
  {
    label: "Outstanding Invoices",
    value: "$284,500",
    meta: "6 invoices · 2 overdue",
    icon: "financials" as NavIcon,
  },
  {
    label: "Active Projects",
    value: "7",
    meta: "3 on track · 2 at risk · 2 delayed",
    icon: "projects" as NavIcon,
  },
  {
    label: "Open Defects",
    value: "14",
    meta: "3 critical · 8 in progress · 3 awaiting",
    icon: "defects" as NavIcon,
  },
  {
    label: "Monthly Cashflow",
    value: "+$142,800",
    meta: "▲ 12.4% vs $98K last month",
    icon: "reports" as NavIcon,
    tone: "good" as const,
  },
];

export const TODAYS_PRIORITIES = [
  {
    title: "Smith Residence variation #3 awaiting approval — $18,400",
    meta: "Critical · client signature needed",
    action: "Review",
    tone: "bad" as const,
  },
  {
    title: "Waterproofing inspection due today — Oakwood Project",
    meta: "Scheduled · 11:00am",
    action: "Confirm",
    tone: "warn" as const,
  },
  {
    title: "Retaining wall drawing Rev C uploaded — needs review",
    meta: "Document · uploaded 2h ago",
    action: "Open",
    tone: "info" as const,
  },
  {
    title: "Invoice INV-0089 overdue 14 days — Morrison Build",
    meta: "$12,750 · follow up required",
    action: "Chase",
    tone: "bad" as const,
  },
  {
    title: "Concrete pour scheduled 9am — Riverside Apartments",
    meta: "Task · crew confirmed",
    action: "View",
    tone: "good" as const,
  },
];

export const UPCOMING_TODAY = [
  {
    time: "9:00am",
    title: "Site meeting — Riverside Apts",
    meta: "Progress walk · 3 attendees",
    active: true,
  },
  { time: "10:30am", title: "Call — Sarah Mitchell (client)", meta: "Smith Residence · design review" },
  { time: "2:00pm", title: "Subcontractor briefing — Trades", meta: "Safety induction · Oakwood" },
  { time: "4:00pm", title: "Review — Morrison Build progress", meta: "Internal standup" },
];

export type ProjectRow = {
  id: string;
  name: string;
  status: "At Risk" | "Delayed" | "On Track";
  progress: number;
  budget: string;
  milestone: string;
  flag?: { label: string; tone: "warn" | "bad" };
};

export const PROJECT_ROWS: ProjectRow[] = [
  {
    id: "smith-residence",
    name: "Smith Residence",
    status: "At Risk",
    progress: 67,
    budget: "$1.2M",
    milestone: "Electrical rough-in",
    flag: { label: "Silent client", tone: "warn" },
  },
  {
    id: "oakwood-house",
    name: "Oakwood House",
    status: "Delayed",
    progress: 45,
    budget: "$890K",
    milestone: "Framing complete",
    flag: { label: "Budget risk", tone: "bad" },
  },
  {
    id: "riverside-apts",
    name: "Riverside Apts",
    status: "On Track",
    progress: 82,
    budget: "$3.4M",
    milestone: "Concrete pour today",
  },
  {
    id: "morrison-build",
    name: "Morrison Build",
    status: "On Track",
    progress: 23,
    budget: "$650K",
    milestone: "Foundation inspection",
    flag: { label: "Overdue inv.", tone: "warn" },
  },
];

export const AI_INSIGHT_CARDS = [
  {
    title: "Waterproofing delay may push Oakwood finish date by 6–9 days.",
    meta: "Suggested: shift drywall crew to Riverside to maintain throughput.",
    action: "Adjust schedule",
  },
  {
    title: "Smith Residence hasn't received a photo update in 12 days.",
    meta: "Clients without updates are 3× more likely to dispute variations.",
    action: "Capture & send",
  },
];

export const QUICK_ACTIONS = [
  { label: "New Task", icon: "tasks" as NavIcon },
  { label: "Add Invoice", icon: "documents" as NavIcon },
  { label: "Invite Trade", icon: "trades" as NavIcon },
  { label: "Schedule", icon: "calendar" as NavIcon },
];

export const CASHFLOW_SERIES = [
  { month: "Jan", inflow: 302, outflow: 268 },
  { month: "Feb", inflow: 288, outflow: 255 },
  { month: "Mar", inflow: 330, outflow: 279 },
  { month: "Apr", inflow: 312, outflow: 262 },
  { month: "May", inflow: 368, outflow: 288 },
  { month: "Jun", inflow: 421, outflow: 300 },
];

/* --------------------------------- Workspace --------------------------------- */

export const DAILY_BRIEF =
  "You have 5 tasks due today, 2 calls scheduled, and 1 variation awaiting client approval worth $18,400. Oakwood House inspection at 11am — confirm attendance. Smith Residence client hasn't been contacted in 5 days, a quick update is recommended before end of day.";

export const WORKSPACE_KPIS = [
  { label: "Tasks Today", value: "8", meta: "3 overdue · 5 pending", icon: "tasks" as NavIcon, tone: "bad" as const },
  { label: "Calls Today", value: "2", meta: "10:30am · 2:30pm", icon: "communications" as NavIcon },
  { label: "Meetings", value: "3", meta: "Next: 9:00am site", icon: "calendar" as NavIcon },
  {
    label: "Approvals Waiting",
    value: "4",
    meta: "2 client · 2 internal",
    icon: "documents" as NavIcon,
    tone: "warn" as const,
  },
  {
    label: "Unread Comms",
    value: "12",
    meta: "4 require response",
    icon: "communications" as NavIcon,
    tone: "bad" as const,
  },
];

export const WORKSPACE_TASKS = [
  {
    group: "Overdue",
    items: [
      { title: "Review Oakwood structural drawings", meta: "Due Jun 15 · Oakwood House", priority: "High" },
      { title: "Follow up Morrison Build invoice INV-0089", meta: "Due Jun 14 · Financials", priority: "High" },
    ],
  },
  {
    group: "Due today",
    items: [
      { title: "Confirm waterproofing trade for Oakwood", meta: "Due today · 11:00am · Oakwood House", priority: "Medium" },
      { title: "Upload site photos — Riverside Apts pour", meta: "Due today · 5:00pm · Riverside Apts", priority: "Low" },
      { title: "Send weekly client update — Smith Residence", meta: "Due today · EOD · Client Comms", priority: "Medium" },
    ],
  },
  {
    group: "Completed",
    items: [{ title: "Review programme update — Morrison Build", meta: "Completed 8:10am", priority: "Done" }],
  },
];

export const WORKSPACE_CALLS = [
  { name: "Sarah Mitchell", meta: "Smith Residence · 10:30am" },
  { name: "Tom Morrison", meta: "Morrison Build · 2:30pm" },
];

export const APPROVALS_WAITING = [
  { title: "Variation #3 — Smith Residence", meta: "$18,400 · Awaiting client · 12 days", action: "Review" },
  { title: "Waterproofing spec revision", meta: "Internal approval · Oakwood House", action: "Approve" },
  { title: "Invoice INV-0094 — Riverside Apts", meta: "$42,000 · Client approval pending", action: "Chase" },
];

export const PINNED_PROJECTS = [
  { initials: "SR", name: "Smith Residence", meta: "67% · At Risk", tone: "warn" as const },
  { initials: "RA", name: "Riverside Apts", meta: "82% · On Track", tone: "good" as const },
  { initials: "OH", name: "Oakwood House", meta: "45% · Delayed", tone: "bad" as const },
];

export const RECENT_DOCUMENTS = [
  { title: "Retaining Wall Drawing Rev C", meta: "2 hours ago" },
  { title: "Structural Spec — Riverside", meta: "Yesterday" },
  { title: "Variation #3 — Smith", meta: "Jun 15" },
];

export const ASSIGNED_DEFECTS_SHORT = [
  { title: "Cracked render — external north wall", meta: "Smith Residence · In Progress", severity: "Critical" },
  { title: "Door hardware misaligned — unit 4B", meta: "Riverside Apts · Assigned", severity: "Medium" },
];

export const UNREAD_COMMS = [
  {
    name: "Sarah Mitchell",
    project: "Smith Residence",
    preview: "Hi James, just wanted to check in about the kitchen tile selection — have you received the samples from...",
    time: "9:14am",
    channel: "Email",
  },
  {
    name: "Dan (Plumber)",
    project: "Riverside Apts",
    preview: "Mate, the rough-in is done on level 2. Can you come have a look before we close the walls up?",
    time: "8:47am",
    channel: "SMS",
  },
  {
    name: "Lena Torres (PM)",
    project: "Internal",
    preview: "Oakwood variation is now at $18.4k — should I get sign-off before proceeding with the schedule change?",
    time: "Yesterday",
    channel: "Internal",
  },
];

/* ------------------------------ Communications ------------------------------- */

export const INBOX_THREADS = [
  {
    id: "sarah-tile",
    group: "Today",
    name: "Sarah Mitchell",
    project: "Smith Residence",
    preview: "Hi James, just wanted to check in about t...",
    time: "9:14am",
    channel: "Email",
    unread: true,
  },
  {
    id: "dan-roughin",
    group: "Today",
    name: "Dan (Plumber)",
    project: "Riverside Apts",
    preview: "Mate, rough-in is done on level 2. Can yo...",
    time: "8:47am",
    channel: "SMS",
    unread: true,
  },
  {
    id: "tom-missed",
    group: "Today",
    name: "Missed call · Tom M",
    project: "Morrison Build",
    preview: "Missed call · duration unknown · no voice...",
    time: "8:15am",
    channel: "Missed Call",
    unread: false,
  },
  {
    id: "lena-variation",
    group: "Yesterday",
    name: "Lena Torres (PM)",
    project: "Internal",
    preview: "Oakwood variation is now at $18.4k — sh...",
    time: "4:22pm",
    channel: "Internal",
    unread: false,
  },
  {
    id: "sarah-thanks",
    group: "Yesterday",
    name: "Sarah Mitchell",
    project: "Smith Residence",
    preview: "Thanks for the update. We're happy with ...",
    time: "2:05pm",
    channel: "Email",
    unread: false,
  },
  {
    id: "mark-call",
    group: "Yesterday",
    name: "Call with Mark (Electrician)",
    project: "Oakwood House · 14 mins",
    preview: "Discussed rough-in schedule and materia...",
    time: "11:30am",
    channel: "Call · 14m",
    unread: false,
  },
];

export const ACTIVE_THREAD = {
  subject: "Kitchen tile selection — Smith Residence",
  channel: "Email",
  project: "Smith Residence",
  from: "Sarah Mitchell <sarah@mitchell.com>",
  sent: "Today, 9:14am",
  aiSummary:
    "Sarah is asking about kitchen tile sample status. She also mentions a change request for the splashback from marble to porcelain. This may generate a variation. Suggested action: confirm tile delivery ETA and log potential variation.",
  to: "james@hartleyconstruction.com.au",
  body: [
    "Hi James,",
    "Just wanted to check in about the kitchen tile selection. Have you received the samples from the supplier yet? We placed the order on June 10 and were told delivery would take 5–7 business days.",
    "Also, David and I had a conversation over the weekend and we've actually changed our minds on the kitchen splashback — we'd like to switch from the Calacatta marble mosaic we originally selected to the large-format Bianco Puro porcelain instead. I believe the porcelain is cheaper, so it shouldn't be a huge variation.",
    "Can you let me know if this is still possible at this stage, and what the cost difference might be?",
    "Thanks so much — looking forward to seeing how it all comes together!",
    "Sarah",
  ],
  extractedActions: [
    { title: "Log tile change as potential variation", action: "Create variation", tone: "warn" as const },
    { title: "Confirm tile sample delivery ETA", action: "Add task", tone: "good" as const },
  ],
  history: [
    { title: "Email sent — progress update", meta: "Yesterday · Jun 16", tone: "info" as const },
    { title: "SMS re: inspection confirmation", meta: "Jun 14", tone: "good" as const },
    { title: "Phone call · 8 mins", meta: "Jun 12", tone: "warn" as const },
  ],
};

/* -------------------------------- Financials --------------------------------- */

export const FINANCIAL_KPIS = [
  { label: "Total Revenue (FY)", value: "$4.82M", meta: "↑ 14% vs last FY", tone: "good" as const },
  { label: "Outstanding Invoices", value: "$284,500", meta: "6 invoices · 2 overdue", tone: "warn" as const },
  { label: "Received This Month", value: "$418,300", meta: "↑ 31% vs May", tone: "good" as const },
  { label: "Upcoming (30 days)", value: "$196,000", meta: "3 progress claims due" },
  { label: "Avg Profit Margin", value: "18.2%", meta: "Across 7 active projects", tone: "good" as const },
];

export const INVOICE_STATUS = [
  { label: "Paid", value: "$1,842,000 · 22 inv", tone: "good" as const, share: 84 },
  { label: "Sent / Pending", value: "$226,000 · 4 inv", tone: "info" as const, share: 11 },
  { label: "Overdue", value: "$58,500 · 2 inv", tone: "bad" as const, share: 5 },
];

export const OUTSTANDING_INVOICES = [
  {
    id: "INV-0089",
    client: "Tom Morrison",
    project: "Morrison Build",
    amount: "$12,750",
    issued: "Jun 3",
    due: "Jun 14",
    status: "Overdue" as const,
    risk: "High" as const,
    action: "Chase",
  },
  {
    id: "INV-0092",
    client: "Riverside Dev",
    project: "Riverside Apts",
    amount: "$45,750",
    issued: "Jun 8",
    due: "Jun 22",
    status: "Sent" as const,
    risk: "Medium" as const,
    action: "View",
  },
  {
    id: "INV-0093",
    client: "Sarah Mitchell",
    project: "Smith Residence",
    amount: "$84,000",
    issued: "Jun 10",
    due: "Jun 24",
    status: "Sent" as const,
    risk: "Low" as const,
    action: "View",
  },
  {
    id: "INV-0094",
    client: "Riverside Dev",
    project: "Riverside Apts",
    amount: "$42,000",
    issued: "Jun 12",
    due: "Jun 26",
    status: "Sent" as const,
    risk: "Low" as const,
    action: "View",
  },
  {
    id: "INV-0090",
    client: "J. Oakwood Trust",
    project: "Oakwood House",
    amount: "$55,250",
    issued: "Jun 1",
    due: "Jun 15",
    status: "Overdue" as const,
    risk: "High" as const,
    action: "Chase",
  },
  {
    id: "INV-0091",
    client: "Morrison Build",
    project: "Morrison Build",
    amount: "$44,750",
    issued: "Jun 5",
    due: "Jun 19",
    status: "Sent" as const,
    risk: "Medium" as const,
    action: "View",
  },
];

export const UPCOMING_PAYMENTS = [
  { day: "20", month: "Jun", title: "Progress Claim #5 — Smith Residence", meta: "Due Jun 20", amount: "$76,000" },
  { day: "24", month: "Jun", title: "Invoice INV-0093 — Smith Residence", meta: "Payment expected Jun 24", amount: "$84,000" },
  { day: "10", month: "Jul", title: "Milestone payment — Riverside Apts", meta: "Concrete slab milestone", amount: "$36,000" },
];

export const CLIENT_RISK = [
  { name: "Tom Morrison", meta: "14-day overdue · $12,750 outstanding", level: "High Risk", tone: "bad" as const, share: 85 },
  { name: "J. Oakwood Trust", meta: "2-day overdue · $55,250 outstanding", level: "Medium", tone: "warn" as const, share: 55 },
  { name: "Sarah Mitchell", meta: "Always paid within 7 days", level: "Low Risk", tone: "good" as const, share: 20 },
];

/* ---------------------------------- Defects ---------------------------------- */

export type Defect = {
  id: string;
  severity: "Critical" | "Medium" | "Low";
  title: string;
  tags: string[];
  trade?: string;
  meta: string;
  metaTone?: "warn" | "good" | "info";
};

export const DEFECT_COLUMNS: { key: string; label: string; tone: "muted" | "info" | "warn" | "good" | "accent"; items: Defect[] }[] = [
  {
    key: "reported",
    label: "Reported",
    tone: "muted",
    items: [
      {
        id: "DEF-0041",
        severity: "Critical",
        title: "Window frame gap — water ingress risk",
        tags: ["Riverside Apts", "Level 3"],
        meta: "No trade assigned · Jun 16",
      },
      {
        id: "DEF-0042",
        severity: "Medium",
        title: "Tile grout inconsistency — bathroom level 2",
        tags: ["Riverside Apts", "Bathrooms"],
        meta: "No trade assigned · Jun 17",
      },
    ],
  },
  {
    key: "assigned",
    label: "Assigned",
    tone: "info",
    items: [
      {
        id: "DEF-0038",
        severity: "Critical",
        title: "Cracked render — external north wall",
        tags: ["Smith Residence", "External"],
        trade: "Mike's Rendering",
        meta: "Jun 8",
      },
      {
        id: "DEF-0039",
        severity: "Medium",
        title: "Door hardware misaligned — unit 4B",
        tags: ["Riverside Apts", "Unit 4B"],
        trade: "Tim's Joinery",
        meta: "Jun 9",
      },
      {
        id: "DEF-0040",
        severity: "Low",
        title: "Paint touch-up required — hallway ceiling",
        tags: ["Morrison Build", "Interior"],
        trade: "J&S Painting",
        meta: "Jun 14",
      },
    ],
  },
  {
    key: "in-progress",
    label: "In Progress",
    tone: "warn",
    items: [
      {
        id: "DEF-0035",
        severity: "Critical",
        title: "Structural crack — garage slab",
        tags: ["Oakwood House", "Garage"],
        trade: "Apex Concrete",
        meta: "Due today",
        metaTone: "warn",
      },
      {
        id: "DEF-0036",
        severity: "Medium",
        title: "Waterproofing membrane bubbling — deck",
        tags: ["Smith Residence", "Deck"],
        trade: "WaterSeal Co",
        meta: "Jun 19",
      },
    ],
  },
  {
    key: "rectified",
    label: "Rectified",
    tone: "good",
    items: [
      {
        id: "DEF-0032",
        severity: "Low",
        title: "Silicon seal cracking — shower base",
        tags: ["Smith Residence"],
        meta: "✓ Trade confirmed done",
        metaTone: "good",
      },
    ],
  },
  {
    key: "awaiting",
    label: "Awaiting Approval",
    tone: "accent",
    items: [
      {
        id: "DEF-0030",
        severity: "Medium",
        title: "Flooring level issue — dining to kitchen transition",
        tags: ["Morrison Build"],
        meta: "Client review pending · 3 days",
        metaTone: "info",
      },
    ],
  },
];

/* ------------------------------ Project detail ------------------------------- */

export const PROJECT_DETAIL = {
  initials: "SR",
  name: "Smith Residence",
  status: "At Risk",
  address: "42 Maple Grove, Kensington",
  client: "Sarah & David Mitchell",
  dates: "Started Mar 2025 · Due Nov 2025",
  contract: "$1.24M contract",
  tabs: ["Overview", "Programme", "Documents", "Financials", "Defects", "Communications", "Photos", "Timeline"],
  completion: 67,
  health: [
    { label: "Schedule Health", value: "72%", meta: "Framing delayed 8 days", tone: "warn" as const, share: 72 },
    { label: "Financial Health", value: "88%", meta: "$18.4K variation outstanding", tone: "good" as const, share: 88 },
    { label: "Comms Health", value: "61%", meta: "No contact in 5 days", tone: "warn" as const, share: 61 },
    { label: "Defect Health", value: "5 open", meta: "1 critical · 4 in progress", tone: "bad" as const, share: 45 },
  ],
  aiSummary:
    "Smith Residence is at 67% completion with a schedule slip of 8 days due to framing delays. Financial position is strong — budget on track with $18.4K variation pending client approval. Client communications have been inactive for 5 days, which is a risk factor. Recommend: Send client update today + follow up variation approval.",
  programme: [
    { phase: "Foundation", state: "Complete", tone: "good" as const, start: 0, width: 20 },
    { phase: "Framing", state: "Delayed 8d", tone: "warn" as const, start: 22, width: 26 },
    { phase: "Rough-in (M/E/P)", state: "Upcoming", tone: "info" as const, start: 50, width: 22 },
    { phase: "Insulation / Plaster", state: "", tone: "muted" as const, start: 62, width: 20 },
    { phase: "Finishes", state: "", tone: "muted" as const, start: 78, width: 20 },
  ],
  programmeMonths: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  budget: {
    contract: "$1,240,000",
    spent: "$726,800",
    variations: "$18,400",
    margin: "18.4%",
    spentLabel: "Spent: $726,800 (58.6%)",
    remainingLabel: "Remaining: $513,200",
    spentShare: 58.6,
    variationShare: 1.5,
  },
  actions: [
    { title: "Client to sign Variation #3", meta: "$18,400 · 12 days outstanding", tag: "Client", tone: "bad" as const },
    { title: "Framing contractor to provide revised schedule", meta: "Requested Jun 10 · 7 days outstanding", tag: "Trade", tone: "warn" as const },
    { title: "Review and approve kitchen drawings Rev C", meta: "Uploaded 2 hours ago", tag: "Internal", tone: "info" as const },
  ],
  activity: [
    { title: "Drawing Rev C uploaded", meta: "Retaining wall detail · by Lena Torres", when: "Today · 9:32am", tone: "info" as const },
    { title: "Variation #3 issued to client", meta: "$18,400 · Awaiting approval", when: "Jun 15", tone: "warn" as const },
    { title: "Progress claim #4 paid", meta: "$84,000 received · Bank confirmed", when: "Jun 12", tone: "good" as const },
    { title: "Site inspection completed", meta: "Council frame inspection · Passed", when: "Jun 10", tone: "muted" as const },
    { title: "Defect logged — cracked render", meta: "North wall · Assigned to trade", when: "Jun 8", tone: "muted" as const },
  ],
  team: [
    { name: "James Hartley", role: "Project Director", initials: "JH" },
    { name: "Lena Torres", role: "Project Manager", initials: "LT" },
    { name: "Sarah Mitchell", role: "Client", initials: "SM", badge: "Portal" },
  ],
  photos: { count: "+48 more", last: "Last photo: 8 days ago", note: "Update recommended" },
};
