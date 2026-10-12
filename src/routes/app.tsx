import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Foresite OS — Your construction command centre" },
      {
        name: "description",
        content:
          "The signed-in Foresite workspace: dashboard, projects, communications, financials and defects in one operating system.",
      },
      { property: "og:title", content: "Foresite OS workspace" },
      { property: "og:description", content: "Dashboard, projects, communications, financials and defects." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppShell,
});
