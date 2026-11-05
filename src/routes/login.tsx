import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AccessLayout } from "@/components/access/AccessLayout";
export const Route = createFileRoute("/login")({ component: () => <AccessLayout><Outlet /></AccessLayout> });