import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Download,
  Grid2X2,
  List,
  Search,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  UserPlus,
  Save,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, PageHeading, Pill, StatTile, StatusPill } from "@/components/app/primitives";
import { Choice, PermissionGrid } from "@/components/app/PermissionControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CONTRIBUTIONS,
  INITIAL_AUDIT,
  INITIAL_USERS,
  METRIC_LABELS,
  MODULES,
  PROJECTS,
  ROLES,
  rolePermissions,
  type AuditEntry,
  type DirectoryUser,
  type Role,
} from "@/content/permissions";

export const Route = createFileRoute("/app/administration/permissions")({
  head: () => ({
    meta: [
      { title: "Permissions Centre — Foresite" },
      {
        name: "description",
        content:
          "Manage users, roles, project assignments, activity and organisational access in Foresite.",
      },
      { property: "og:title", content: "Permissions Centre — Foresite" },
      {
        property: "og:description",
        content:
          "Organisation-wide visibility into permissions, contribution history and security.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PermissionsPage,
});

function PermissionsPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [audit, setAudit] = useState(INITIAL_AUDIT);
  const [tab, setTab] = useState("directory");
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All roles");
  const [project, setProject] = useState("All projects");
  const [status, setStatus] = useState("All statuses");
  const [organisation, setOrganisation] = useState("All organisations");
  const [activity, setActivity] = useState("All activity");
  const [draft, setDraft] = useState<DirectoryUser | null>(null);
  const [detailTab, setDetailTab] = useState("overview");
  const [template, setTemplate] = useState<Role>("Project Manager");
  const [templateUser, setTemplateUser] = useState(INITIAL_USERS[2]?.id ?? "user-2");
  const [invite, setInvite] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Worker");
  const [historySearch, setHistorySearch] = useState("");
  const organisations = [...new Set(users.map((u) => u.organisation))];
  const inactive = users.filter((u) => u.status === "Inactive");
  const unassigned = users.filter((u) => !u.assignments.length);
  const financial = users.filter((u) => u.permissions.Financials?.includes("Administer"));
  const elevated = users.filter(
    (u) =>
      u.role === "Guest" &&
      (u.permissions.Financials?.length || u.permissions.Administration?.length),
  );
  const conflicts = users.filter((u) =>
    Object.values(u.permissions).some(
      (actions) => actions.some((a) => a !== "View") && !actions.includes("View"),
    ),
  );
  const filtered = users.filter(
    (u) =>
      `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase()) &&
      (role === "All roles" || u.role === role) &&
      (project === "All projects" || u.assignments.some((a) => a.project === project)) &&
      (status === "All statuses" || u.status === status) &&
      (organisation === "All organisations" || u.organisation === organisation) &&
      (activity === "All activity" ||
        (activity === "Inactive"
          ? u.status === "Inactive"
          : u.status !== "Inactive" && u.status !== "Invited")),
  );

  function openUser(user: DirectoryUser, nextTab = "overview") {
    setDraft(structuredClone(user));
    setDetailTab(nextTab);
  }
  function entry(user: string, change: string, previous: string, next: string): AuditEntry {
    return {
      id: crypto.randomUUID(),
      actor: "Lachlan Davies (demo owner)",
      user,
      change,
      previous,
      next,
      date: new Date().toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }),
    };
  }
  function saveUser() {
    if (!draft) return;
    const previous = users.find((u) => u.id === draft.id);
    if (!previous) return;
    const entries: AuditEntry[] = [];
    if (previous.role !== draft.role)
      entries.push(entry(draft.name, "Role", previous.role, draft.role));
    if (previous.status !== draft.status)
      entries.push(entry(draft.name, "Account status", previous.status, draft.status));
    MODULES.forEach((module) => {
      if (
        JSON.stringify(previous.permissions[module]) !== JSON.stringify(draft.permissions[module])
      )
        entries.push(
          entry(
            draft.name,
            `${module} permissions`,
            previous.permissions[module]?.join(", ") || "No access",
            draft.permissions[module]?.join(", ") || "No access",
          ),
        );
    });
    PROJECTS.forEach((p) => {
      const before = previous.assignments.find((a) => a.project === p);
      const after = draft.assignments.find((a) => a.project === p);
      if (JSON.stringify(before) !== JSON.stringify(after))
        entries.push(
          entry(
            draft.name,
            `${p} assignment`,
            before ? `${before.role}: ${before.rights.join(", ")}` : "Unassigned",
            after ? `${after.role}: ${after.rights.join(", ")}` : "Unassigned",
          ),
        );
    });
    if (!entries.length) {
      toast.info("No changes to save");
      return;
    }
    setUsers((current) => current.map((u) => (u.id === draft.id ? draft : u)));
    setAudit((current) => [...entries, ...current]);
    setDraft(null);
    toast.success("Demo access changes saved");
  }
  function applyTemplate() {
    const user = users.find((u) => u.id === templateUser);
    if (!user) return;
    openUser({ ...user, role: template, permissions: rolePermissions(template) }, "permissions");
  }
  function exportAudit() {
    const quote = (s: string) => `"${s.replaceAll('"', '""')}"`;
    const csv = [
      ["Responsible user", "Affected user", "Change", "Previous", "New", "Date"],
      ...audit.map((a) => [a.actor, a.user, a.change, a.previous, a.next, a.date]),
    ]
      .map((row) => row.map(quote).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "foresite-demo-permission-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  function addInvite(event: React.FormEvent) {
    event.preventDefault();
    if (users.some((u) => u.email.toLowerCase() === inviteEmail.trim().toLowerCase())) {
      toast.error("This email is already in the directory");
      return;
    }
    const name = inviteName.trim();
    if (!name) return;
    const user: DirectoryUser = {
      id: crypto.randomUUID(),
      name,
      email: inviteEmail.trim(),
      initials: name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join(""),
      role: inviteRole,
      organisation: "Foresite Development",
      status: "Invited",
      mobile: "Not provided",
      added: new Date().toLocaleDateString("en-AU"),
      lastActive: "Never",
      permissions: rolePermissions(inviteRole),
      assignments: [],
      metrics: [0, 0, 0, 0, 0, 0],
    };
    setUsers((current) => [...current, user]);
    setAudit((current) => [entry(name, "Demo invitation", "No account", inviteRole), ...current]);
    setInvite(false);
    setInviteName("");
    setInviteEmail("");
    toast.success("User added to demo directory. No email was sent.");
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Permissions Centre"
        meta="Manage users, permissions and organisational access across the Foresite platform."
        actions={
          <Button
            onClick={() => setInvite(true)}
            size="sm"
            className="bg-azure text-azure-foreground hover:bg-azure/90"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Invite user</span>
          </Button>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-y border-border py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-azure" /> Foresite Development{" "}
          <span className="text-border">/</span> Owner administration
        </span>
        <Pill tone="warn">Demo data · Changes reset on reload · No access enforcement</Pill>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {[
          { label: "Organisation users", value: users.length, icon: "clients" as const },
          { label: "Role templates", value: ROLES.length, icon: "settings" as const },
          { label: "Permission conflicts", value: conflicts.length },
          { label: "Inactive users", value: inactive.length },
          { label: "High-risk accounts", value: financial.length + elevated.length },
          { label: "Unassigned accounts", value: unassigned.length },
        ].map((s) => (
          <StatTile
            key={s.label}
            label={s.label}
            value={String(s.value)}
            icon={s.icon}
            tone={s.label.includes("risk") && s.value > 0 ? "warn" : undefined}
          />
        ))}
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto border-b border-border">
          <TabsList className="h-auto w-max justify-start gap-1 rounded-none bg-transparent p-0">
            {[
              ["directory", "User directory"],
              ["roles", "Role templates"],
              ["history", "Access & permission history"],
              ["security", "Security"],
              ["structure", "Organisation"],
            ].map(([id, title]) => (
              <TabsTrigger
                key={id}
                value={id ?? ""}
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-azure data-[state=active]:bg-transparent data-[state=active]:text-azure data-[state=active]:shadow-none"
              >
                {title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="directory" className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search User"
                placeholder="Search User"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-background pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{filtered.length} users</span>
              <div className="flex gap-1">
                <Button
                  title="List view"
                  aria-label="List view"
                  variant={view === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setView("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  title="Directory card view"
                  aria-label="Directory card view"
                  variant={view === "cards" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setView("cards")}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <Choice
              label="Filter by role"
              value={role}
              options={["All roles", ...ROLES]}
              onChange={setRole}
            />
            <Choice
              label="Filter by project"
              value={project}
              options={["All projects", ...PROJECTS]}
              onChange={setProject}
            />
            <Choice
              label="Filter by status"
              value={status}
              options={["All statuses", "Online", "Active", "Inactive", "Invited"]}
              onChange={setStatus}
            />
            <Choice
              label="Filter by organisation"
              value={organisation}
              options={["All organisations", ...organisations]}
              onChange={setOrganisation}
            />
            <Choice
              label="Filter by activity"
              value={activity}
              options={["All activity", "Active", "Inactive"]}
              onChange={setActivity}
            />
          </div>
          {(role !== "All roles" ||
            project !== "All projects" ||
            status !== "All statuses" ||
            organisation !== "All organisations" ||
            activity !== "All activity" ||
            search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRole("All roles");
                setProject("All projects");
                setStatus("All statuses");
                setOrganisation("All organisations");
                setActivity("All activity");
                setSearch("");
              }}
            >
              Clear filters
            </Button>
          )}
          {!filtered.length ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No users match these filters.
            </div>
          ) : view === "list" ? (
            <div className="overflow-x-auto rounded-lg border border-border bg-background">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="border-b border-border bg-surface text-xs text-muted-foreground">
                  <tr>
                    {["User", "Role", "Organisation", "Projects", "Status", "Last active", ""].map(
                      (h) => (
                        <th key={h} className="px-4 py-3 font-medium">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0 hover:bg-surface"
                    >
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          className="h-auto max-w-full justify-start gap-3 p-0 text-left hover:bg-transparent"
                          onClick={() => openUser(user)}
                        >
                          <Avatar initials={user.initials} />
                          <span>
                            <span className="block text-sm font-medium">{user.name}</span>
                            <span className="block text-xs font-normal text-muted-foreground">
                              {user.email}
                            </span>
                          </span>
                        </Button>
                      </td>
                      <td className="px-4 py-3">
                        <Pill tone={user.role === "Owner" ? "info" : "muted"}>{user.role}</Pill>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {user.organisation}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{user.assignments.length}</td>
                      <td className="px-4 py-3">
                        <UserStatus user={user} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{user.lastActive}</td>
                      <td className="px-4 py-3">
                        <Button
                          aria-label={`View ${user.name}`}
                          title="View user"
                          variant="ghost"
                          size="icon"
                          onClick={() => openUser(user)}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  onClick={() => openUser(user)}
                  className="h-auto w-full flex-col items-stretch gap-4 whitespace-normal bg-background p-5 text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Avatar initials={user.initials} />
                    <UserStatus user={user} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{user.name}</h3>
                    <p className="mt-1 text-xs font-normal text-muted-foreground">
                      {user.role} · {user.organisation}
                    </p>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-border pt-3 text-xs font-normal text-muted-foreground">
                    <span>{user.assignments.length} assigned projects</span>
                    <span>{user.lastActive}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="roles" className="mt-6 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Role templates</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Standard access profiles for internal teams and external stakeholders.
              </p>
            </div>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <div className="min-w-48 flex-1">
                <Choice
                  label="Select user for template"
                  value={templateUser}
                  options={users.map((u) => u.id)}
                  optionLabels={Object.fromEntries(users.map((u) => [u.id, u.name]))}
                  onChange={setTemplateUser}
                />
              </div>
              <Button
                onClick={applyTemplate}
                className="bg-azure text-azure-foreground hover:bg-azure/90"
              >
                <Check className="h-4 w-4" /> Apply template
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Selected user: {users.find((u) => u.id === templateUser)?.name}
          </p>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {ROLES.map((r) => (
              <Button
                key={r}
                variant={template === r ? "secondary" : "outline"}
                onClick={() => setTemplate(r)}
                className={`h-auto flex-col items-start gap-2 whitespace-normal p-4 text-left ${template === r ? "border border-azure bg-azure/10 text-azure" : "bg-background"}`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{r}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {Object.values(rolePermissions(r)).filter((p) => p.length).length} accessible
                  modules
                </span>
              </Button>
            ))}
          </div>
          <section className="border-t border-border pt-5">
            <h3 className="mb-3 text-sm font-semibold">{template} permission template</h3>
            <PermissionGrid permissions={rolePermissions(template)} />
          </section>
        </TabsContent>
        <TabsContent value="history" className="mt-6 space-y-4">
          <div className="flex flex-wrap justify-between gap-3">
            <h2 className="text-base font-semibold">Access & Permission History</h2>
            <Button variant="outline" size="sm" onClick={exportAudit}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
          <Input
            aria-label="Search audit history"
            placeholder="Search people or changes"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            className="max-w-sm bg-background"
          />
          <AuditTable
            entries={audit.filter((a) =>
              `${a.actor} ${a.user} ${a.change} ${a.previous} ${a.next}`
                .toLowerCase()
                .includes(historySearch.toLowerCase()),
            )}
          />
        </TabsContent>
        <TabsContent value="security" className="mt-6 space-y-6">
          <h2 className="text-base font-semibold">Security overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Inactive users",
                detail: "Review dormant accounts and their project access.",
                people: inactive,
              },
              {
                title: "Full financial access",
                detail: "These users can administer financial records.",
                people: financial,
              },
              {
                title: "Guests with elevated permissions",
                detail: "External guests have sensitive module access.",
                people: elevated,
              },
              {
                title: "Unassigned accounts",
                detail: "These users are not assigned to any project.",
                people: unassigned,
              },
              {
                title: "Permission conflicts",
                detail: "Action permissions without view access require review.",
                people: conflicts,
              },
            ].map((warning) => (
              <section key={warning.title} className="border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert
                    className={`h-4 w-4 ${warning.people.length ? "text-construction" : "text-chart-5"}`}
                  />
                  <h3 className="text-sm font-semibold">{warning.title}</h3>
                  <Pill tone={warning.people.length ? "warn" : "good"}>
                    {warning.people.length}
                  </Pill>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{warning.detail}</p>
                <div className="mt-3 space-y-1">
                  {warning.people.length ? (
                    warning.people.map((u) => (
                      <Button
                        key={u.id}
                        variant="ghost"
                        className="w-full justify-between px-0 text-sm"
                        onClick={() => openUser(u, "permissions")}
                      >
                        {u.name}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ))
                  ) : (
                    <p className="text-xs text-chart-5">No conflicts detected</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="structure" className="mt-6 space-y-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-azure" />
            <h2 className="text-base font-semibold">
              Foresite Development · Organisation structure
            </h2>
          </div>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section>
              <h3 className="mb-4 text-xs font-semibold uppercase text-muted-foreground">
                Internal team
              </h3>
              {ROLES.slice(0, 5).map((r, index) => (
                <div key={r}>
                  {index > 0 && (
                    <ArrowDown className="mx-auto my-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="border-l-2 border-azure bg-background p-4">
                    <p className="mb-2 text-sm font-semibold">
                      {r}
                      {r === "Foreman" ? " / Supervisors" : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {users
                        .filter((u) => u.role === r)
                        .map((u) => (
                          <Button
                            key={u.id}
                            variant="outline"
                            size="sm"
                            onClick={() => openUser(u)}
                          >
                            {u.name}
                            <span className="text-xs text-muted-foreground">
                              · {u.assignments.length} projects
                            </span>
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>
            <section>
              <h3 className="mb-4 text-xs font-semibold uppercase text-muted-foreground">
                External stakeholders
              </h3>
              {ROLES.slice(5).map((r) => (
                <div key={r} className="mb-4 border-b border-border pb-4">
                  <p className="mb-2 text-sm font-semibold">{r}</p>
                  {users
                    .filter((u) => u.role === r)
                    .map((u) => (
                      <Button
                        key={u.id}
                        variant="ghost"
                        className="h-auto w-full items-start justify-start gap-3 whitespace-normal px-0 py-2 text-left"
                        onClick={() => openUser(u, "projects")}
                      >
                        <Avatar initials={u.initials} />
                        <span>
                          <span className="block">{u.name}</span>
                          <span className="block text-xs font-normal text-muted-foreground">
                            {u.assignments.map((a) => a.project).join(" · ") ||
                              "No project assignment"}
                          </span>
                        </span>
                      </Button>
                    ))}
                </div>
              ))}
            </section>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet
        open={draft !== null}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-3xl">
          {draft && (
            <>
              <div className="border-b border-border px-6 pb-5 pt-7">
                <div className="flex items-center gap-3">
                  <Avatar initials={draft.initials} />
                  <div>
                    <SheetTitle>{draft.name}</SheetTitle>
                    <SheetDescription>
                      {draft.role} · {draft.organisation}
                    </SheetDescription>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <UserStatus user={draft} />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setDraft(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveUser}
                      className="bg-azure text-azure-foreground hover:bg-azure/90"
                    >
                      <Save className="h-4 w-4" /> Save changes
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <Tabs value={detailTab} onValueChange={setDetailTab}>
                  <div className="overflow-x-auto">
                    <TabsList className="w-max">
                      {[
                        ["overview", "Overview"],
                        ["permissions", "Permissions"],
                        ["projects", "Projects"],
                        ["activity", "Contributions"],
                        ["ai", "AI access"],
                        ["audit", "History"],
                      ].map(([id, label]) => (
                        <TabsTrigger key={id} value={id ?? ""}>
                          {label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  <TabsContent value="overview" className="mt-6 space-y-6">
                    <dl className="grid gap-5 sm:grid-cols-2">
                      {[
                        ["Email", draft.email],
                        ["Mobile", draft.mobile],
                        ["Date added", draft.added],
                        ["Last activity", draft.lastActive],
                        ["Organisation", draft.organisation],
                        ["Projects assigned", String(draft.assignments.length)],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-xs text-muted-foreground">{label}</dt>
                          <dd className="mt-1 break-words text-sm font-medium">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Choice
                          label="User role"
                          value={draft.role}
                          options={[...ROLES]}
                          onChange={(value) => setDraft({ ...draft, role: value as Role })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Role changes preserve custom permissions.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Choice
                          label="User status"
                          value={draft.status}
                          options={["Online", "Active", "Inactive", "Invited"]}
                          onChange={(value) =>
                            setDraft({ ...draft, status: value as DirectoryUser["status"] })
                          }
                        />
                      </div>
                    </div>
                    <h3 className="border-t border-border pt-5 text-sm font-semibold">
                      Contribution metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {METRIC_LABELS.map((m, i) => (
                        <div key={m}>
                          <p className="text-2xl font-semibold tabular-nums">
                            {i === 1 ? draft.assignments.length : draft.metrics[i]}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{m}</p>
                        </div>
                      ))}
                    </div>
                    <h3 className="border-t border-border pt-5 text-sm font-semibold">
                      Current permissions
                    </h3>
                    <PermissionGrid permissions={draft.permissions} />
                  </TabsContent>
                  <TabsContent value="permissions" className="mt-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="min-w-40 flex-1">
                        <Choice
                          label="Role template"
                          value={template}
                          options={[...ROLES]}
                          onChange={(value) => setTemplate(value as Role)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            role: template,
                            permissions: rolePermissions(template),
                          })
                        }
                      >
                        Apply template
                      </Button>
                    </div>
                    <PermissionGrid
                      permissions={draft.permissions}
                      onChange={(module, action, enabled) => {
                        const current = draft.permissions[module] ?? [];
                        setDraft({
                          ...draft,
                          permissions: {
                            ...draft.permissions,
                            [module]: enabled
                              ? [...new Set([...current, action])]
                              : current.filter((a) => a !== action),
                          },
                        });
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Changes take effect in this demonstration after saving.
                    </p>
                  </TabsContent>
                  <TabsContent value="projects" className="mt-6 space-y-5">
                    <h3 className="text-sm font-semibold">Project assignments & visibility</h3>
                    {PROJECTS.map((p) => {
                      const assignment = draft.assignments.find((a) => a.project === p);
                      return (
                        <section key={p} className="border-b border-border pb-5">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              aria-label={`Assign ${p}`}
                              checked={Boolean(assignment)}
                              onCheckedChange={(checked) =>
                                setDraft({
                                  ...draft,
                                  assignments: checked
                                    ? [
                                        ...draft.assignments,
                                        {
                                          project: p,
                                          role: draft.role,
                                          status: "Active",
                                          date: new Date().toLocaleDateString("en-AU"),
                                          rights: ["View"],
                                        },
                                      ]
                                    : draft.assignments.filter((a) => a.project !== p),
                                })
                              }
                            />
                            <h4 className="text-sm font-medium">{p}</h4>
                            {assignment && <Pill tone="good">{assignment.status}</Pill>}
                          </div>
                          {assignment && (
                            <div className="ml-7 mt-3 space-y-3">
                              <Choice
                                label={`Role on ${p}`}
                                value={assignment.role}
                                options={[
                                  ...new Set([
                                    ...ROLES,
                                    "Project Owner",
                                    "Reviewer",
                                    assignment.role,
                                  ]),
                                ]}
                                onChange={(value) =>
                                  setDraft({
                                    ...draft,
                                    assignments: draft.assignments.map((a) =>
                                      a.project === p ? { ...a, role: value } : a,
                                    ),
                                  })
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                Assigned {assignment.date}
                              </p>
                              <div className="flex flex-wrap gap-4">
                                {["View", "Edit", "Approve", "Administer"].map((right) => (
                                  <label key={right} className="flex items-center gap-2 text-xs">
                                    <Checkbox
                                      aria-label={`${p} can ${right.toLowerCase()}`}
                                      checked={assignment.rights.includes(right)}
                                      onCheckedChange={(checked) =>
                                        setDraft({
                                          ...draft,
                                          assignments: draft.assignments.map((a) =>
                                            a.project === p
                                              ? {
                                                  ...a,
                                                  rights: checked
                                                    ? [...a.rights, right]
                                                    : a.rights.filter((r) => r !== right),
                                                }
                                              : a,
                                          ),
                                        })
                                      }
                                    />
                                    Can {right.toLowerCase()}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </section>
                      );
                    })}
                  </TabsContent>
                  <TabsContent value="activity" className="mt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {METRIC_LABELS.map((m, i) => (
                        <div key={m}>
                          <p className="text-xl font-semibold">
                            {i === 1 ? draft.assignments.length : draft.metrics[i]}
                          </p>
                          <p className="text-xs text-muted-foreground">{m}</p>
                        </div>
                      ))}
                    </div>
                    <h3 className="border-t border-border pt-5 text-sm font-semibold">
                      Contribution history
                    </h3>
                    {draft.metrics[0] === 0 ? (
                      <p className="text-sm text-muted-foreground">No activity recorded.</p>
                    ) : (
                      <ol className="ml-2 border-l border-border">
                        {CONTRIBUTIONS.filter(
                          (c) =>
                            draft.permissions[c.type]?.includes("View") || c.type === "Approvals",
                        ).map((c) => (
                          <li key={c.date} className="relative pb-5 pl-5">
                            <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-background bg-azure" />
                            <p className="text-xs text-muted-foreground">{c.date}</p>
                            <p className="mt-1 text-sm font-medium">{c.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
                          </li>
                        ))}
                      </ol>
                    )}
                  </TabsContent>
                  <TabsContent value="ai" className="mt-6 space-y-5">
                    <h3 className="flex items-center gap-2 text-base font-semibold">
                      <Sparkles className="h-5 w-5 text-azure" />
                      AI Access & Visibility
                    </h3>
                    <div className="flex items-center gap-2 border-y border-azure/20 bg-azure/5 px-3 py-4 text-sm font-medium text-azure">
                      <ShieldCheck className="h-4 w-4" />
                      AI inherits user permissions
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Project access</h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {draft.permissions.AI?.includes("View") &&
                        draft.permissions.Projects?.includes("View")
                          ? draft.assignments
                              .filter((a) => a.rights.includes("View"))
                              .map((a) => a.project)
                              .join(", ") || "No visible assigned projects"
                          : "No project access"}
                      </p>
                    </div>
                    <h4 className="text-sm font-medium">Accessible data sources</h4>
                    <div className="divide-y divide-border">
                      {MODULES.filter((m) => m !== "AI").map((module) => (
                        <div key={module} className="flex items-center justify-between gap-3 py-3">
                          <span className="text-sm">{module}</span>
                          <Pill
                            tone={
                              draft.permissions.AI?.includes("View") &&
                              draft.permissions[module]?.includes("View")
                                ? "good"
                                : "muted"
                            }
                          >
                            {draft.permissions.AI?.includes("View") &&
                            draft.permissions[module]?.includes("View")
                              ? "Accessible"
                              : "No access"}
                          </Pill>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Project data is limited to assigned projects with view permission. This is a
                      visibility preview, not a connected AI service.
                    </p>
                  </TabsContent>
                  <TabsContent value="audit" className="mt-6">
                    <AuditTable entries={audit.filter((a) => a.user === draft.name)} />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={invite} onOpenChange={setInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite user</DialogTitle>
            <DialogDescription>
              Add a user to the demo directory. No email will be sent.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={addInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Full name</Label>
              <Input
                id="invite-name"
                required
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Work email</Label>
              <Input
                id="invite-email"
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Choice
                label="Invitation role"
                value={inviteRole}
                options={[...ROLES]}
                onChange={(value) => setInviteRole(value as Role)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-azure text-azure-foreground hover:bg-azure/90"
            >
              <UserPlus className="h-4 w-4" /> Add demo invitation
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserStatus({ user }: { user: DirectoryUser }) {
  return (
    <StatusPill
      tone={
        user.status === "Online"
          ? "good"
          : user.status === "Inactive"
            ? "warn"
            : user.status === "Invited"
              ? "info"
              : "muted"
      }
    >
      {user.status}
    </StatusPill>
  );
}
function AuditTable({ entries }: { entries: AuditEntry[] }) {
  return entries.length ? (
    <div className="overflow-x-auto rounded-lg border border-border bg-background">
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead className="border-b border-border bg-surface text-muted-foreground">
          <tr>
            {[
              "Responsible user",
              "Affected user",
              "What changed",
              "Previous value",
              "New value",
              "Date",
            ].map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((a) => (
            <tr key={a.id} className="border-b border-border last:border-0">
              <td className="px-4 py-4 font-medium">{a.actor}</td>
              <td className="px-4 py-4">{a.user}</td>
              <td className="px-4 py-4">{a.change}</td>
              <td className="px-4 py-4 text-muted-foreground">{a.previous}</td>
              <td className="px-4 py-4 text-azure">{a.next}</td>
              <td className="px-4 py-4 text-muted-foreground">{a.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="py-10 text-center text-sm text-muted-foreground">No access changes recorded.</p>
  );
}
