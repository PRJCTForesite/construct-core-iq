import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AccessLayout } from "@/components/access/AccessLayout";
export const Route = createFileRoute("/login")({
  staticData: { sitemap: "exclude-subtree" }, component: () => <AccessLayout><Outlet /></AccessLayout> });