import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/ai-insights")({
  head: () => ({
    meta: [
      { property: "og:title", content: "AI Insights \u2014 Foresite OS" },
      { property: "og:description", content: "Forecasts, risk detection and recommended actions from your data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "AI Insights — Foresite OS" },
      { name: "description", content: "Forecasts, risk detection and recommended actions from your data." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <Outlet />,
});
