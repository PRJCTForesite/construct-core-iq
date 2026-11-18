import { createFileRoute } from "@tanstack/react-router";
import { SettingsModule } from "@/components/platform/SettingsModule";

export const Route = createFileRoute("/app/settings")({
  staticData: { sitemap: false },
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
  component: SettingsModule,
});
