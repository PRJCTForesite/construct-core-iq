import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Settings \u2014 Foresite OS" },
      { property: "og:description", content: "Company profile, users, permissions and integrations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Settings — Foresite OS" },
      { name: "description", content: "Company profile, users, permissions and integrations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Settings" icon="settings" blurb="Company profile, users, permissions and integrations." />,
});
