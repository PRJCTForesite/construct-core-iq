export const ROLES = [
  "Owner",
  "Administrator",
  "Project Manager",
  "Foreman",
  "Worker",
  "Client",
  "Consultant",
  "Trade Contractor",
  "Guest",
  "Supervisor",
  "Trade",
] as const;
export type Role = (typeof ROLES)[number];
export const MODULES = [
  "Projects",
  "Tasks",
  "Defects",
  "Documents",
  "Communications",
  "Financials",
  "Reports",
  "AI",
  "Administration",
  "Users",
  "Billing",
  "Trades",
  "Clients",
  "Variations",
  "Organisation",
  "Client Portal",
  "Trade Portal",
] as const;
export const ACTIONS = [
  "View",
  "Create",
  "Edit",
  "Delete",
  "Assign",
  "Approve",
  "Administer",
] as const;
export type PermissionMap = Record<string, string[]>;
export const PROJECTS = [
  "Smith Residence",
  "Braybrook Residence",
  "Oakwood Estate",
  "Riverside Commercial",
];
export type Assignment = {
  project: string;
  role: string;
  status: string;
  date: string;
  rights: string[];
};
export type DirectoryUser = {
  id: string;
  name: string;
  initials: string;
  role: Role;
  organisation: string;
  email: string;
  mobile: string;
  status: "Online" | "Active" | "Inactive" | "Invited" | "Pending Invitation" | "Suspended";
  position?: string;
  permissionTemplate?: Role;
  assignmentScope?: "Selected Projects" | "Entire Organisation";
  added: string;
  lastActive: string;
  permissions: PermissionMap;
  assignments: Assignment[];
  metrics: number[];
};
export type AuditEntry = {
  id: string;
  actor: string;
  user: string;
  change: string;
  previous: string;
  next: string;
  date: string;
};

import { rolePermissions } from '@/lib/services/permissionsService';
export { rolePermissions };

const PEOPLE: [string, Role, string, DirectoryUser["status"], number][] = [
  ["Lachlan Davies", "Owner", "Foresite Development", "Online", 4],
  ["Emma Wilson", "Administrator", "Foresite Development", "Online", 4],
  ["James Hartley", "Project Manager", "Hartley Construction", "Online", 3],
  ["Sarah Chen", "Project Manager", "Hartley Construction", "Active", 2],
  ["John Smith", "Supervisor", "Hartley Construction", "Online", 2],
  ["Michael Brown", "Worker", "Hartley Construction", "Active", 1],
  ["Oliver Taylor", "Worker", "Hartley Construction", "Inactive", 1],
  ["Sophie Smith", "Client", "Smith Family", "Active", 1],
  ["Alex Morgan", "Consultant", "Studio North", "Active", 2],
  ["Daniel Lee", "Trade", "Precision Electrical", "Inactive", 2],
  ["Grace Miller", "Guest", "Studio North", "Active", 0],
  ["Ben Carter", "Guest", "Independent", "Inactive", 0],
  ["Mia Roberts", "Client", "Roberts Family", "Pending Invitation", 1],
  ["Noah Williams", "Trade", "ABC Electrical", "Suspended", 1],
];

export const INITIAL_USERS: DirectoryUser[] = PEOPLE.map(
  ([name, role, organisation, status, count], i) => {
    const permissions = rolePermissions(role);
    if (name === "Grace Miller") permissions["Financials"] = ["View", "Edit"];
    return {
      id: `user-${i}`,
      name,
      role,
      organisation,
      status,
      initials: name
        .split(" ")
        .map((p) => p[0])
        .join(""),
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      mobile: `0400 000 ${String(i + 100)}`,
      added: "14 Aug 2026",
      lastActive:
        status === "Online" ? "Now" : status === "Inactive" ? "38 days ago" : "2 hours ago",
      permissions,
      assignments: PROJECTS.slice(0, count).map((project) => ({
        project,
        role: role === "Owner" ? "Project Owner" : role,
        status: "Active",
        date: "14 Aug 2026",
        rights:
          role === "Owner" || role === "Administrator"
            ? ["View", "Edit", "Approve", "Administer"]
            : role === "Client"
              ? ["View"]
              : ["View", "Edit"],
      })),
      metrics: [42 + i * 3, count, 2 + (i % 4), 18 + i, 24 + i * 2, 56 + i * 3],
    };
  },
);

export const INITIAL_AUDIT: AuditEntry[] = [
  {
    id: "a1",
    actor: "Emma Wilson",
    user: "John Smith",
    change: "Role",
    previous: "Worker",
    next: "Foreman",
    date: "12 Oct 2026, 10:42",
  },
  {
    id: "a2",
    actor: "Lachlan Davies",
    user: "Sarah Chen",
    change: "Project assignment",
    previous: "Unassigned",
    next: "Braybrook Residence",
    date: "11 Oct 2026, 15:18",
  },
  {
    id: "a3",
    actor: "Emma Wilson",
    user: "Grace Miller",
    change: "Financials access",
    previous: "No access",
    next: "View, Edit",
    date: "10 Oct 2026, 09:26",
  },
  {
    id: "a4",
    actor: "Lachlan Davies",
    user: "Daniel Lee",
    change: "Account status",
    previous: "Active",
    next: "Inactive",
    date: "08 Oct 2026, 16:05",
  },
];
export const CONTRIBUTIONS = [
  {
    date: "12 Oct 2026",
    title: "Completed task",
    detail: "Roof framing · Smith Residence",
    type: "Tasks",
  },
  {
    date: "11 Oct 2026",
    title: "Closed defect",
    detail: "Bedroom architrave · Smith Residence",
    type: "Defects",
  },
  {
    date: "10 Oct 2026",
    title: "Uploaded document",
    detail: "Architectural Revision C · Oakwood Estate",
    type: "Documents",
  },
  {
    date: "09 Oct 2026",
    title: "Sent communication",
    detail: "Weekly progress update · Smith Residence",
    type: "Communications",
  },
  {
    date: "08 Oct 2026",
    title: "Completed approval",
    detail: "Window schedule · Braybrook Residence",
    type: "Approvals",
  },
  {
    date: "07 Oct 2026",
    title: "Created defect",
    detail: "Kitchen tile alignment · Smith Residence",
    type: "Defects",
  },
  {
    date: "06 Oct 2026",
    title: "Updated project",
    detail: "Programme revision · Oakwood Estate",
    type: "Projects",
  },
];
export const METRIC_LABELS = [
  "Tasks completed",
  "Projects assigned",
  "Avg. completion (days)",
  "Defects closed",
  "Documents uploaded",
  "Communications handled",
];
