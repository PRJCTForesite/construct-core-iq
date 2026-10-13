import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/administration")({
  head: () => ({ meta: [
    { title: "Administration — Foresite OS" },
    { name: "description", content: "Foresite organisation administration and permission management." },
    { property: "og:title", content: "Administration — Foresite OS" },
    { property: "og:description", content: "Foresite organisation administration and permission management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex" },
  ] }),
  component: () => <Outlet />,
});
