/**
 * Static site copy. Presentation components read from here so that page
 * content stays separate from layout, and so future API-backed data can be
 * swapped in without touching the UI.
 */

export const BRAND = "Foresite" as const;
export const POSITIONING = "The Construction Operating System" as const;
export const TAGLINE = ["Construction Intelligence.", "One Platform.", "Complete Control."] as const;
export const HERO_SUBHEADING =
  "Manage projects, tasks, defects, documents, communications and financial performance from a single operating system.";

export const PORTAL_URL = "https://portal.foresite.com";
export const APP_URL = "https://app.foresite.com";

export const NAV_LINKS = [
  { label: "Features", to: "/features" },
  { label: "Industries", to: "/industries" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Download", to: "/download" },
  { label: "Contact", to: "/contact" },
] as const;

export type IconName =
  | "projects"
  | "tasks"
  | "defects"
  | "documents"
  | "communications"
  | "financials"
  | "health"
  | "ai";

export type FeatureSummary = {
  id: string;
  icon: IconName;
  title: string;
  summary: string;
};

export const HOME_FEATURES: FeatureSummary[] = [
  {
    id: "projects",
    icon: "projects",
    title: "Projects",
    summary: "Manage every project from one location.",
  },
  { id: "tasks", icon: "tasks", title: "Tasks", summary: "Automatic work progress tracking." },
  {
    id: "defects",
    icon: "defects",
    title: "Defects",
    summary: "Inspection and close-out management.",
  },
  {
    id: "documents",
    icon: "documents",
    title: "Documents",
    summary: "Version-controlled document management.",
  },
  {
    id: "financials",
    icon: "financials",
    title: "Financials",
    summary: "Project profitability and cashflow oversight.",
  },
  {
    id: "ai",
    icon: "ai",
    title: "AI Assistant",
    summary: "Risk detection and intelligent project insights.",
  },
];

export type FeatureDetail = {
  id: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  cta: { label: string; to: string };
  panel: { label: string; rows: { name: string; value: string; tone?: "good" | "warn" | "bad" }[] };
};

export const FEATURE_DETAILS: FeatureDetail[] = [
  {
    id: "projects",
    icon: "projects",
    eyebrow: "Project Management",
    title: "Every project, one source of truth",
    description:
      "Set up projects with programme dates, contract values, teams and responsibilities, then track delivery against the plan without rebuilding spreadsheets each week.",
    benefits: [
      "Single register of every active and completed project",
      "Work progress measured against programme progress",
      "Consistent structure across every delivery team",
      "Portfolio roll-up for executives and directors",
    ],
    cta: { label: "Book a Demo", to: "/contact" },
    panel: {
      label: "Project Register",
      rows: [
        { name: "Riverside Office Complex", value: "62% · On Track", tone: "good" },
        { name: "Northpoint Residences", value: "48% · At Risk", tone: "warn" },
        { name: "Harborview Plaza", value: "25% · On Track", tone: "good" },
        { name: "Lakeside Retail Centre", value: "10% · Delayed", tone: "bad" },
      ],
    },
  },
  {
    id: "tasks",
    icon: "tasks",
    eyebrow: "Task Management",
    title: "Progress that calculates itself",
    description:
      "Weighted tasks assigned to real people roll up into project progress automatically, so reported completion reflects work actually done on site.",
    benefits: [
      "Weighted tasks drive automatic progress calculation",
      "Clear ownership, priority and due dates",
      "Overdue and blocked work surfaced immediately",
      "No manual percentage-complete guesswork",
    ],
    cta: { label: "See it in action", to: "/contact" },
    panel: {
      label: "Open Tasks",
      rows: [
        { name: "Concrete Pour — Level 3", value: "High · Due Fri", tone: "warn" },
        { name: "MEP Coordination", value: "Medium · In Progress" },
        { name: "Steel Inspection", value: "High · Not Started", tone: "bad" },
        { name: "Site Safety Walk", value: "Low · Complete", tone: "good" },
      ],
    },
  },
  {
    id: "defects",
    icon: "defects",
    eyebrow: "Defect Management",
    title: "Inspections through to close-out",
    description:
      "Raise defects during inspection with location, photos and responsibility, then drive them to verified close-out with a full audit trail.",
    benefits: [
      "Structured inspection and handover workflows",
      "Photographic evidence at raise and close",
      "Accountability by subcontractor and trade",
      "Trend reporting on recurring quality issues",
    ],
    cta: { label: "Talk to us", to: "/contact" },
    panel: {
      label: "Defect Register",
      rows: [
        { name: "Open defects", value: "37", tone: "warn" },
        { name: "Awaiting verification", value: "9" },
        { name: "Closed this month", value: "128", tone: "good" },
        { name: "Overdue > 14 days", value: "4", tone: "bad" },
      ],
    },
  },
  {
    id: "communications",
    icon: "communications",
    eyebrow: "Communications",
    title: "Correspondence with a record",
    description:
      "Keep project communication attached to the project, task or defect it belongs to, so decisions and instructions remain traceable long after handover.",
    benefits: [
      "Discussion threaded to the record it relates to",
      "Notifications routed to the responsible party",
      "Searchable history for claims and disputes",
      "No critical decisions lost in personal inboxes",
    ],
    cta: { label: "Book a Demo", to: "/contact" },
    panel: {
      label: "Recent Activity",
      rows: [
        { name: "RFI 042 — Slab Reinforcement", value: "Response due", tone: "warn" },
        { name: "Instruction 018 issued", value: "Acknowledged", tone: "good" },
        { name: "Defect 214 discussion", value: "3 new replies" },
        { name: "Weekly site report", value: "Distributed", tone: "good" },
      ],
    },
  },
  {
    id: "documents",
    icon: "documents",
    eyebrow: "Document Control",
    title: "Controlled revisions, current drawings",
    description:
      "Version-controlled document management keeps the current revision in front of the team and preserves every superseded version for the record.",
    benefits: [
      "Automatic revision history and supersession",
      "Controlled distribution and access",
      "Drawing, specification and contract registers",
      "One place to find the latest approved set",
    ],
    cta: { label: "Book a Demo", to: "/contact" },
    panel: {
      label: "Document Register",
      rows: [
        { name: "A-101 Ground Floor Plan", value: "Rev D · Current", tone: "good" },
        { name: "S-204 Slab Details", value: "Rev C · Current", tone: "good" },
        { name: "Specification — Façade", value: "Rev B · Superseded" },
        { name: "Contract — Subcontract 07", value: "Pending review", tone: "warn" },
      ],
    },
  },
  {
    id: "financials",
    icon: "financials",
    eyebrow: "Financial Oversight",
    title: "Margin and cashflow you can trust",
    description:
      "Track committed cost, forecast final cost and cash position at project and portfolio level, with variances visible while there is still time to act.",
    benefits: [
      "Budget, committed cost and forecast in one view",
      "Cashflow position across the portfolio",
      "Early warning on margin erosion",
      "Financial health scoring per project",
    ],
    cta: { label: "Contact Sales", to: "/contact" },
    panel: {
      label: "Financial Summary",
      rows: [
        { name: "Contract value", value: "$12.4M" },
        { name: "Forecast margin", value: "8.6%", tone: "good" },
        { name: "Cashflow position", value: "+$460K", tone: "good" },
        { name: "Variations at risk", value: "$310K", tone: "warn" },
      ],
    },
  },
  {
    id: "health",
    icon: "health",
    eyebrow: "Project Health Monitoring",
    title: "One score for real project status",
    description:
      "Project health combines work progress, programme performance, quality and financial signals into a single score, so slipping projects are obvious early.",
    benefits: [
      "Composite health score per project",
      "Programme versus work progress comparison",
      "Portfolio heat map for leadership",
      "Consistent basis for reporting to clients",
    ],
    cta: { label: "Book a Demo", to: "/contact" },
    panel: {
      label: "Project Health Score",
      rows: [
        { name: "Excellent", value: "12 projects", tone: "good" },
        { name: "Good", value: "7 projects", tone: "good" },
        { name: "At risk", value: "3 projects", tone: "warn" },
        { name: "Critical", value: "2 projects", tone: "bad" },
      ],
    },
  },
  {
    id: "ai",
    icon: "ai",
    eyebrow: "AI-Assisted Project Intelligence",
    title: "Risk detection before it costs you",
    description:
      "Foresite reads the signals already in your projects and highlights emerging risk, delay exposure and commercial issues that deserve attention this week.",
    benefits: [
      "Automatic risk and delay detection",
      "Plain-language project insights",
      "Prioritised actions for delivery teams",
      "Foundation for forecasting and claims analysis",
    ],
    cta: { label: "Book a Demo", to: "/contact" },
    panel: {
      label: "Intelligence Feed",
      rows: [
        { name: "Programme slippage detected", value: "Northpoint", tone: "warn" },
        { name: "Defect rate above baseline", value: "Façade trade", tone: "warn" },
        { name: "Margin trending down", value: "Lakeside", tone: "bad" },
        { name: "Approvals ahead of plan", value: "Harborview", tone: "good" },
      ],
    },
  },
];

export const STAKEHOLDERS: { id: string; icon: IconName; title: string; description: string }[] = [
  {
    id: "owners",
    icon: "health",
    title: "Owners & Developers",
    description: "Portfolio visibility into progress, cost and risk at every step of delivery, without chasing reports.",
  },
  {
    id: "head-contractors",
    icon: "projects",
    title: "Head Contractors",
    description: "Run the whole project from the palm of your hand — programme, tasks, defects and financials in one place.",
  },
  {
    id: "subcontractors",
    icon: "tasks",
    title: "Subcontractors",
    description: "Connect site and office in real time so assigned work, evidence and close-out never sit in an inbox.",
  },
];

export const MOBILE_HIGHLIGHTS: string[] = [
  "Capture defects on site with photos and location",
  "Update task progress the moment work is done",
  "Open the current drawing revision from your pocket",
  "Works on iPhone, Android, tablet and desktop",
];

export const MOBILE_PANEL_ROWS: { name: string; meta: string; value: string; tone?: "good" | "warn" | "bad" }[] = [
  { name: "Northpoint Residences", meta: "Level 4 · Framing", value: "48%", tone: "warn" },
  { name: "Defect 214 — Façade", meta: "Assigned to you", value: "Open", tone: "bad" },
  { name: "Concrete Pour — L3", meta: "Due Friday", value: "High", tone: "warn" },
  { name: "Site Safety Walk", meta: "Completed today", value: "Done", tone: "good" },
];

export type Industry = {

  id: string;
  title: string;
  description: string;
  points: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    id: "residential",
    title: "Residential Construction",
    description:
      "Volume housing, apartments and townhouse delivery where repeatable process and fast defect close-out protect handover dates.",
    points: ["Stage-based progress tracking", "Handover and defect liability management", "Trade accountability by lot"],
  },
  {
    id: "commercial",
    title: "Commercial Construction",
    description:
      "Offices, retail and mixed-use projects with complex stakeholder groups, tight programmes and demanding document control.",
    points: ["Controlled drawing revisions", "RFI and instruction traceability", "Commercial variation oversight"],
  },
  {
    id: "civil",
    title: "Civil Construction",
    description:
      "Roads, bridges, earthworks and utilities where quantities, quality records and programme performance drive payment.",
    points: ["Quantity and progress claims support", "ITP and quality evidence capture", "Programme versus work progress"],
  },
  {
    id: "government",
    title: "Government Projects",
    description:
      "Public sector delivery with strict reporting obligations, auditability and probity requirements from tender to close-out.",
    points: ["Full audit trail of decisions", "Standardised reporting formats", "Contract and notice management ready"],
  },
  {
    id: "maintenance",
    title: "Maintenance Contracts",
    description:
      "Recurring and reactive works across many sites, where response times, task volume and margin per job decide profitability.",
    points: ["High-volume task management", "Site and asset based history", "Job-level profitability visibility"],
  },
];

export type PricingTier = {
  id: string;
  name: string;
  audience: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    audience: "Small businesses.",
    description: "Core project, task and defect management for small teams getting off spreadsheets.",
    features: [
      "Projects and task management",
      "Defect register and close-out",
      "Document storage with revisions",
      "Up to 10 users",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    audience: "Growing contractors.",
    description: "Full delivery and commercial oversight for contractors running multiple concurrent projects.",
    features: [
      "Everything in Starter",
      "Financial oversight and forecasting",
      "Project health monitoring",
      "Communications and RFI workflows",
      "Reporting suite",
      "Priority support",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    audience: "Large organisations and portfolios.",
    description: "Portfolio governance, advanced intelligence and integration for enterprise delivery groups.",
    features: [
      "Everything in Professional",
      "Portfolio governance and roll-up reporting",
      "AI assistant and risk analysis",
      "Contract, claims and EOT modules",
      "API access and single sign-on",
      "Dedicated success manager",
    ],
  },
];

export const PRICING_COMPARISON: { feature: string; starter: string; professional: string; enterprise: string }[] = [
  { feature: "Projects", starter: "Up to 10", professional: "Unlimited", enterprise: "Unlimited" },
  { feature: "Users", starter: "10", professional: "50", enterprise: "Unlimited" },
  { feature: "Task management", starter: "Included", professional: "Included", enterprise: "Included" },
  { feature: "Defect management", starter: "Included", professional: "Included", enterprise: "Included" },
  { feature: "Document control", starter: "Standard", professional: "Advanced", enterprise: "Advanced" },
  { feature: "Financial oversight", starter: "—", professional: "Included", enterprise: "Included" },
  { feature: "Project health monitoring", starter: "—", professional: "Included", enterprise: "Included" },
  { feature: "AI assistant", starter: "—", professional: "Preview", enterprise: "Included" },
  { feature: "Single sign-on", starter: "—", professional: "—", enterprise: "Included" },
  { feature: "API access", starter: "—", professional: "Read only", enterprise: "Full" },
];

export const PRICING_FAQ: { question: string; answer: string }[] = [
  {
    question: "Can we trial Foresite before committing?",
    answer:
      "Yes. Every plan starts with a trial so your delivery team can set up a live project and evaluate Foresite against your current process.",
  },
  {
    question: "How is pricing calculated?",
    answer:
      "Pricing is based on the plan and the number of users in your organisation. Portfolio and enterprise arrangements are quoted directly.",
  },
  {
    question: "Can Foresite connect to our existing systems?",
    answer:
      "Enterprise plans include API access so Foresite can exchange data with accounting, estimating and asset management systems.",
  },
  {
    question: "Who owns our project data?",
    answer:
      "You do. Your project records, documents and financial data remain yours and can be exported at any time.",
  },
];

export const ROADMAP: { period: string; title: string; detail: string }[] = [
  {
    period: "Available now",
    title: "Delivery core",
    detail: "Projects, tasks, defects, document control, communications and financial oversight.",
  },
  {
    period: "Next",
    title: "Project health and intelligence",
    detail: "Composite health scoring, risk detection and AI-assisted project insights across the portfolio.",
  },
  {
    period: "Following",
    title: "Commercial modules",
    detail: "Claims, extensions of time, notice management and contract management built on the same record.",
  },
  {
    period: "Future",
    title: "Forecasting",
    detail: "Predictive programme and cost forecasting using your own delivery history.",
  },
];
