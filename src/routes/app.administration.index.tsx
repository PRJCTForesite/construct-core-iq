import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import { PageHeading } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/administration/")({
  head: () => ({ meta: [
    { title: "Administration — Foresite" },
    { name: "description", content: "Organisational administration and access management in Foresite." },
    { property: "og:title", content: "Administration — Foresite" },
    { property: "og:description", content: "Manage your organisation and open the Foresite Permissions Centre." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdministrationPage,
});

function AdministrationPage() {
  return <div className="space-y-7"><PageHeading title="Administration" meta="Organisation controls & access management" /><div className="border-y border-border py-8"><div className="flex flex-wrap items-start gap-5"><span className="grid h-12 w-12 place-items-center rounded-lg bg-azure/10 text-azure"><ShieldCheck className="h-6 w-6" /></span><div className="min-w-0 flex-1"><h2 className="text-lg font-semibold">Permissions Centre</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Manage users, permissions and organisational access across the Foresite platform.</p><p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-4 w-4" /> Users · Role assignments · Project access · Activity history</p></div><Button asChild className="bg-azure text-azure-foreground hover:bg-azure/90"><Link to="/app/administration/permissions">Open Permissions Centre <ArrowRight className="h-4 w-4" /></Link></Button></div></div></div>;
}