import { createFileRoute } from "@tanstack/react-router";
import { ReportsModule } from "@/components/platform/ReportsModule";

export const Route = createFileRoute("/app/reports")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { property: "og:title", content: "Reports \u2014 Foresite OS" },
      { property: "og:description", content: "Cost, schedule and quality reporting across the portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Reports — Foresite OS" },
      { name: "description", content: "Cost, schedule and quality reporting across the portfolio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportsModule,
});
