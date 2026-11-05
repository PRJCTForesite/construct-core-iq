import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Building2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleExperienceFlow } from "@/components/access/AccessFlow";
import { ACCESS_WORKSPACES } from "@/content/access";
import { hasSession, endDemoSession } from "@/lib/session";
export const Route = createFileRoute("/login/workspaces")({
  head: () => ({
    meta: [
      { title: "My Workspaces — Foresite Account Preview" },
      {
        name: "description",
        content:
          "Preview multiple Foresite organisations and roles using one account, with future permission-based experiences.",
      },
      { property: "og:title", content: "My Workspaces — Foresite" },
      {
        property: "og:description",
        content:
          "One account across ABC Electrical, XYZ Builders and DEF Constructions. Future workspace framework preview.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkspacesPage,
});
function WorkspacesPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasSession()) void navigate({ to: "/login", replace: true });
  }, [navigate]);
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-azure">
          One account. Multiple organisations.
        </p>
        <span className="rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground">
          Future feature preview
        </span>
      </div>
      <h1 className="mt-4 text-3xl font-semibold">My Workspaces</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Users may belong to multiple organisations and roles while using a single account.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {ACCESS_WORKSPACES.map((workspace, i) => (
          <article
            key={workspace.organisation}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-md text-sm font-semibold ${i === 0 ? "bg-azure/10 text-azure" : "bg-secondary text-secondary-foreground"}`}
              >
                {workspace.initials}
              </span>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">{workspace.organisation}</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium">{workspace.role}</dd>
              </div>
              <div className="border-t border-border pt-3">
                <dt className="text-xs text-muted-foreground">Organisation</dt>
                <dd className="mt-1">{workspace.organisation}</dd>
              </div>
            </dl>
            <Button disabled variant="outline" className="mt-6 w-full">
              <LockKeyhole /> Switching coming soon
            </Button>
          </article>
        ))}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        Users will be able to switch between organisations without requiring multiple accounts.
        These sample workspaces are informational only.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild className="bg-azure text-azure-foreground hover:bg-azure/90">
          <Link to="/app">
            Continue to existing demo <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/app/client-portal">
            Client Portal preview <ArrowRight />
          </Link>
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            endDemoSession();
            void navigate({ to: "/login" });
          }}
        >
          Sign out
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        The existing demonstration dashboard is unchanged. No organisation switching or role
        assignment occurs.
      </p>
      <RoleExperienceFlow />
    </>
  );
}
