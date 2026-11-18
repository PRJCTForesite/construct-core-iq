import { createFileRoute } from "@tanstack/react-router";
import { TradePortal } from "@/components/trade-portal/TradePortal";
export const Route = createFileRoute("/app/trade-portal")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Trade Portal — Foresite" },
      { name: "description", content: "Trade workspace for tasks, defects, shared drawings, compliance and upcoming works in Foresite." },
      { property: "og:title", content: "Trade Portal — Foresite" },
      { property: "og:description", content: "Simple, organised delivery workspace for trades and subcontractors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TradePortal,
});
