import { PROJECT_ROWS, DEFECT_COLUMNS, OUTSTANDING_INVOICES, INBOX_THREADS } from "./app";
export const TASK_STATES = [
  "Pending",
  "Assigned",
  "In Progress",
  "Delayed By Us",
  "Delayed By Others",
  "Completed By Trade",
  "Ready For Sign Off",
  "Completed & Signed Off",
];
export const DOCUMENT_CATEGORIES = [
  "Drawings",
  "Photos",
  "Specifications",
  "Programs",
  "Contracts",
  "Financial Files",
  "Reports",
  "Correspondence",
];
export type RecordKind =
  | "Project"
  | "Task"
  | "Defect"
  | "Document"
  | "Communication"
  | "Variation"
  | "Client"
  | "Trade"
  | "Event";
export type PlatformRecord = {
  id: string;
  kind: RecordKind;
  title: string;
  project: string;
  status: string;
  person: string;
  date: string;
  category: string;
  progress: number;
  amount: number;
  notes: string;
  weight: number;
  dependencies: string;
  responsible: string;
  notified: string;
  revision: string;
  tags: string;
  versions: { revision: string; date: string; author: string; comments: string }[];
  email: string;
  phone: string;
  insurance: string;
  licence: string;
  induction: string;
  health: number;
  fileSize?: string;
  shareWithClient?: boolean;
  portalCategory?: string;
};
export const PROJECT_NAMES = PROJECT_ROWS.map((p) => p.name);
export function makeRecord(
  kind: RecordKind,
  title: string,
  fields: Partial<PlatformRecord> = {},
): PlatformRecord {
  return {
    id: crypto.randomUUID(),
    kind,
    title,
    project: PROJECT_NAMES[0] ?? "Smith Residence",
    status: kind === "Defect" ? "Reported" : kind === "Task" ? "Pending" : kind === "Variation" ? "Draft" : "Active",
    person: "James Hartley",
    date: "2026-10-14",
    category: kind,
    progress: 0,
    amount: 0,
    notes: "",
    weight: 1,
    dependencies: "",
    responsible: "James Hartley",
    notified: "Sarah Mitchell",
    revision: "A",
    tags: "",
    versions: [],
    email: "",
    phone: "",
    insurance: "2026-11-01",
    licence: "2027-06-30",
    induction: "Complete",
    health: 82,
    ...fields,
  };
}
// Stable seed IDs keep links and project conversations consistent across reloads.
let seed = 0;
const row = (
  kind: RecordKind,
  title: string,
  fields: Partial<PlatformRecord> = {},
): PlatformRecord => ({ ...makeRecord(kind, title, fields), id: `demo-${++seed}` });
export const INITIAL_RECORDS: PlatformRecord[] = [
  ...PROJECT_ROWS.map((p) =>
    row("Project", p.name, {
      id: p.id,
      project: p.name,
      status: p.status,
      progress: p.progress,
      amount: p.name === "Smith Residence" ? 1240000 : 890000,
      notes: p.milestone,
      health: p.progress > 70 ? 91 : 72,
    }),
  ),
  row("Task", "Confirm waterproofing inspection", {
    status: "Assigned",
    category: "Inspection",
    weight: 3,
    progress: 20,
    dependencies: "Framing sign-off",
    date: "2026-10-13",
  }),
  row("Task", "Electrical rough-in", {
    status: "In Progress",
    person: "Daniel Lee",
    responsible: "John Smith",
    weight: 5,
    progress: 65,
    dependencies: "Framing inspection",
    project: "Smith Residence",
  }),
  row("Task", "Approve kitchen tile samples", {
    status: "Ready For Sign Off",
    person: "James Hartley",
    progress: 100,
    weight: 2,
    date: "2026-10-15",
  }),
  row("Task", "Deck membrane rectification", {
    status: "Delayed By Others",
    person: "Michael Brown",
    project: "Oakwood House",
    progress: 40,
    weight: 4,
    notes: "Awaiting revised waterproofing detail.",
  }),
  row("Task", "Site handover checklist", {
    status: "Pending",
    project: "Riverside Apts",
    date: "2026-10-20",
  }),
  row("Task", "Foundation inspection", {
    status: "Completed & Signed Off",
    project: "Morrison Build",
    progress: 100,
  }),
  ...DEFECT_COLUMNS.flatMap((c) =>
    c.items.map((d) =>
      row("Defect", d.title, {
        id: d.id,
        project: d.tags[0] ?? "Smith Residence",
        status: c.label,
        category: d.severity,
        person: d.trade ?? "Unassigned",
        tags: d.tags.join(", "),
        notes: d.meta,
      }),
    ),
  ),
  ...OUTSTANDING_INVOICES.map((i) =>
    row("Variation", i.id, {
      id: i.id,
      project: i.project,
      status: i.status,
      person: i.client,
      category: "Invoice",
      amount: Number(i.amount.replace(/[^0-9.]/g, "")),
      date: "2026-10-15",
      notes: "Progress claim",
    }),
  ),
  row("Variation", "Variation 12 — kitchen splashback", {
    category: "Variation",
    status: "Awaiting approval",
    amount: 18400,
    person: "Sarah Mitchell",
    notes: "Replace marble mosaic with porcelain.",
  }),
  ...INBOX_THREADS.map((t) =>
    row("Communication", t.preview, {
      id: t.id,
      person: t.name,
      project: t.project,
      status: t.unread ? "Unread" : "Read",
      category: t.channel,
      notes: t.preview,
    }),
  ),
  ...DOCUMENT_CATEGORIES.map((c, i) =>
    row(
      "Document",
      [
        "Architectural drawings Rev C",
        "Site progress photos",
        "Waterproofing specification",
        "Construction programme",
        "Building contract",
        "Progress claim 05",
        "Weekly progress report",
        "Client tile selection",
      ][i] ?? c,
      {
        category: c,
        shareWithClient: ["Drawings", "Contracts", "Reports"].includes(c),
        portalCategory: c,
        project: PROJECT_NAMES[i % 4] ?? "Smith Residence",
        status: i === 2 ? "Awaiting approval" : "Current",
        revision: i === 0 ? "C" : "A",
        tags: c === "Drawings" ? "Architecture, Approved" : "Project record",
        notes:
          c === "Drawings"
            ? "Updated kitchen layout and north retaining wall detail."
            : "Project record prepared for review.",
        versions: [
          { revision: "A", date: "2026-09-12", author: "Lena Torres", comments: "Initial issue" },
          {
            revision: "B",
            date: "2026-10-01",
            author: "Lena Torres",
            comments: "Coordination updates",
          },
          {
            revision: "C",
            date: "2026-10-12",
            author: "James Hartley",
            comments: "Approved kitchen detail",
          },
        ],
      },
    ),
  ),
  row("Client", "Sarah & David Mitchell", {
    project: "Smith Residence",
    person: "Sarah Mitchell",
    email: "sarah@example.com",
    phone: "0400 000 101",
    health: 92,
    amount: 84000,
    notes: "Prefer weekly photo updates. Kitchen samples awaiting selection.",
  }),
  row("Client", "Tom Morrison", {
    project: "Morrison Build",
    email: "tom@example.com",
    phone: "0400 000 102",
    health: 58,
    amount: 12750,
    notes: "Follow up overdue progress claim.",
  }),
  row("Client", "Riverside Development", {
    project: "Riverside Apts",
    email: "riverside@example.com",
    health: 88,
    amount: 87750,
  }),
  row("Client", "J. Oakwood Trust", {
    project: "Oakwood House",
    email: "oakwood@example.com",
    health: 65,
    amount: 55250,
  }),
  row("Trade", "Precision Electrical", {
    category: "Electrical",
    person: "Daniel Lee",
    project: "Smith Residence",
    email: "precision@example.com",
    phone: "0400 000 201",
  }),
  row("Trade", "WaterSeal Co", {
    category: "Waterproofing",
    project: "Oakwood House",
    insurance: "2026-10-20",
    licence: "2026-10-25",
    induction: "Pending",
    phone: "0400 000 202",
  }),
  row("Trade", "Mike’s Rendering", {
    category: "Rendering",
    project: "Smith Residence",
    insurance: "2026-10-10",
    phone: "0400 000 203",
  }),
  row("Trade", "Apex Concrete", {
    category: "Concrete",
    project: "Riverside Apts",
    email: "apex@example.com",
  }),
  ...[
    "Meeting",
    "Inspection",
    "Task Due Date",
    "Trade Booking",
    "Delivery",
    "Permit Expiration",
  ].map((c, i) =>
    row(
      "Event",
      [
        "Site coordination meeting",
        "Waterproofing inspection",
        "Kitchen sample approval",
        "Electrical crew booking",
        "Window delivery",
        "Building permit review",
      ][i] ?? c,
      {
        category: c,
        shareWithClient: ["Drawings", "Contracts", "Reports"].includes(c),
        portalCategory: c,
        project: PROJECT_NAMES[i % 4] ?? "Smith Residence",
        date: `2026-10-${13 + i}`,
        notes: `${9 + i}:00`,
        person: i === 3 ? "Daniel Lee" : "James Hartley",
      },
    ),
  ),
];
export const money = (n: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
