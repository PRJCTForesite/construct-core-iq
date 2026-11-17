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
