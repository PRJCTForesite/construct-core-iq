export const ACCESS_VIEWS = [
  { id: "owner", title: "Owner View", description: "Manage projects, teams, financials, communications and operations across your organisation.", features: ["Projects", "Financials", "Documents", "Communications", "Defects", "Reports", "AI Insights", "Users & Permissions"] },
  { id: "client", title: "Client View", description: "Track project progress, approvals, photos, defects and updates in real time.", features: ["Progress", "Photos", "Approvals", "Documents", "Defects", "Updates", "Messaging"] },
  { id: "trade", title: "Trade View", description: "Manage assigned works, defects, site communications and project deliverables.", features: ["Tasks", "Defects", "Communications", "Drawings", "Documents", "Upcoming Works"] },
] as const;
export const ACCESS_WORKSPACES = [
  { organisation: "ABC Electrical", role: "Owner", initials: "AE" },
  { organisation: "XYZ Builders", role: "Trade", initials: "XB" },
  { organisation: "DEF Constructions", role: "Trade", initials: "DC" },
] as const;
export const REGISTRATION_STEPS = ["Create Account", "Enter Details", "Organisation Verification", "Access Granted"];
export function validateDemoLogin(email: string, password: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
  if (password.length < 4) return "Enter a password of at least 4 characters.";
  return null;
}
export function validateOrganisationCode(code: string) {
  return code.trim().length > 0 ? null : "An Organisation Code is required before access can be granted.";
}