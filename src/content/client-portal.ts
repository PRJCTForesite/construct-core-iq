import type { PlatformRecord } from "./platform";
import type { Role } from "./permissions";

export const WIDGETS = [
  { id: "approvals", name: "Pending Approvals" },
  { id: "updates", name: "Builder Updates" },
  { id: "progress", name: "Progress" },
  { id: "health", name: "Project Health" },
  { id: "photos", name: "Progress Photos" },
  { id: "milestones", name: "Milestones" },
  { id: "documents", name: "Shared Documents" },
  { id: "financials", name: "Financial Summary" },
  { id: "defects", name: "Defects" },
  { id: "contacts", name: "Project Contacts" },
  { id: "messages", name: "Project Messages" },
  { id: "ai", name: "Future Assistant" },
] as const;
export type WidgetId = (typeof WIDGETS)[number]["id"];
export type WidgetConfig = { id: WidgetId; name: string; enabled: boolean };
export type PortalTemplate = {
  id: string;
  name: string;
  audience: string;
  widgets: WidgetConfig[];
};
export const PORTAL_TEMPLATES: PortalTemplate[] = [
  ["lite", "Residential Lite", "Bathrooms, decks, fences and small renovations"],
  ["full", "Residential Full Build", "Custom homes, townhouses and knockdown rebuilds"],
  ["commercial", "Commercial Client", "Developers, builders and asset owners"],
  ["enterprise", "Enterprise Client", "Government, major projects and infrastructure"],
].map(([id = "", name = "", audience = ""]) => ({
  id,
  name,
  audience,
  widgets: WIDGETS.map((w) => ({
    ...w,
    enabled: id !== "lite" || !["health", "milestones", "ai"].includes(w.id),
  })),
}));
export type Stage = { name: string; weight: number; completion: number };
export const DEFAULT_STAGES: Stage[] = [
  { name: "Tender", weight: 5, completion: 100 },
  { name: "Preparation", weight: 15, completion: 100 },
  { name: "Construction", weight: 65, completion: 80 },
  { name: "Defects", weight: 10, completion: 0 },
  { name: "Completion", weight: 5, completion: 0 },
];
export function weightedCompletion(stages: Stage[]) {
  const weight = stages.reduce((sum, s) => sum + Math.max(0, s.weight), 0);
  return weight
    ? Math.round(
        stages.reduce(
          (sum, s) => sum + Math.max(0, s.weight) * Math.min(100, Math.max(0, s.completion)),
          0,
        ) / weight,
      )
    : 0;
}
export type PortalAction =
  | "View"
  | "Comment"
  | "Approve"
  | "Reject"
  | "Submit defect"
  | "Configure"
  | "Review suggestion"
  | "Edit project"
  | "Modify programme"
  | "Modify financials"
  | "Internal notes";
export function portalCan(role: Role, action: PortalAction) {
  if (["Owner", "Administrator"].includes(role)) return true;
  if (role === "Project Manager") return action !== "Configure";
  return (
    role === "Client" && ["View", "Comment", "Approve", "Reject", "Submit defect"].includes(action)
  );
}
export const DOCUMENT_PORTAL_CATEGORIES = [
  "Contracts",
  "Selections",
  "Variations",
  "Approvals",
  "Warranties",
  "Manuals",
  "Drawings",
  "Reports",
];
export function sharedClientDocuments(records: PlatformRecord[], project: string) {
  return records.filter(
    (r) => r.kind === "Document" && r.project === project && r.shareWithClient === true,
  );
}
export type ClientFinancials = {
  contractValue: number;
  approvedVariations: number;
  pendingVariations: number;
  amountPaid: number;
  amountOutstanding: number;
};
// An explicit projection prevents internal financial fields from reaching portal widgets.
export function clientFinancialSummary(source: ClientFinancials): ClientFinancials {
  return {
    contractValue: source.contractValue,
    approvedVariations: source.approvedVariations,
    pendingVariations: source.pendingVariations,
    amountPaid: source.amountPaid,
    amountOutstanding: source.amountOutstanding,
  };
}
export type Approval = {
  id: string;
  title: string;
  category: string;
  detail: string;
  amount?: number;
  status: "Requires Action" | "Approved" | "Rejected" | "Not Yet Available";
  recordId?: string;
};
export type BuilderUpdate = {
  id: string;
  date: string;
  author: string;
  completed: string;
  upcoming: string;
  risks: string;
  approvals: string;
  photos: string[];
};
export type Suggestion = {
  id: string;
  title: string;
  area: string;
  description: string;
  files: string[];
  status: "Suggested Defect" | "Accepted" | "Rejected";
  recordId?: string | undefined;
  reason?: string | undefined;
};
export function suggestionDecision(
  suggestion: Suggestion,
  decision: "Accepted" | "Rejected",
  recordId?: string,
  reason?: string,
): Suggestion {
  return {
    ...suggestion,
    status: decision,
    recordId: decision === "Accepted" ? recordId : undefined,
    reason,
  };
}
export const PHOTO_AREAS = [
  "Kitchen",
  "Bathroom",
  "Bedroom",
  "Living",
  "External",
  "Electrical",
  "Landscaping",
  "Other",
];
export const CONTACTS = [
  { role: "Builder", name: "Hartley Construction", initials: "HC", email: "builder@example.com" },
  { role: "Project Manager", name: "James Hartley", initials: "JH", email: "james@example.com" },
  { role: "Site Supervisor", name: "John Smith", initials: "JS", email: "john@example.com" },
  { role: "Accounts", name: "Accounts team", initials: "AC", email: "accounts@example.com" },
  { role: "Client Liaison", name: "Sarah Chen", initials: "SC", email: "liaison@example.com" },
  {
    role: "Warranty Contact",
    name: "Warranty team",
    initials: "WT",
    email: "warranty@example.com",
  },
];
export const HEALTH = [
  {
    name: "Schedule Health",
    score: 78,
    detail: "Window delivery shifted by two days. Completion target unchanged.",
  },
  {
    name: "Financial Health",
    score: 94,
    detail: "Progress claims up to date. One variation awaiting your decision.",
  },
  {
    name: "Defect Health",
    score: 86,
    detail: "Open items are being rectified before the next inspection.",
  },
  {
    name: "Communication Health",
    score: 96,
    detail: "Weekly updates issued and your questions acknowledged.",
  },
  {
    name: "Delivery Health",
    score: 84,
    detail: "Joinery installed. Stone benchtops scheduled next.",
  },
];
export function healthStatus(score: number) {
  return score >= 80 ? "Healthy" : score >= 60 ? "Attention Required" : "Critical";
}
export function defaultApprovals(): Approval[] {
  return [
    {
      id: "selection",
      title: "Kitchen tile selection",
      category: "Material Selections",
      detail: "Confirm porcelain tile K-04 for the kitchen splashback. Samples reviewed on site.",
      status: "Requires Action",
    },
    {
      id: "colour",
      title: "Internal paint colours",
      category: "Colour Selections",
      detail: "Walls: Natural White. Trim: Vivid White. Please confirm before painting starts.",
      status: "Requires Action",
    },
    {
      id: "drawing",
      title: "Kitchen joinery shop drawings",
      category: "Shop Drawings",
      detail: "Revision C includes the approved island layout and appliance dimensions.",
      status: "Approved",
    },
    {
      id: "signoff",
      title: "Bathroom sealant rectification",
      category: "Defect Sign-Offs",
      detail: "Review the completed sealant repair during your next site inspection.",
      status: "Requires Action",
    },
    {
      id: "completion",
      title: "Practical completion sign-off",
      category: "Practical Completion Sign-Off",
      detail:
        "Handover checklist will be issued when the practical completion inspection is complete.",
      status: "Not Yet Available",
    },
  ];
}
