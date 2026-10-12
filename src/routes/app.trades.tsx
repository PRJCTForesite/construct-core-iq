import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/trades")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Trades \u2014 Foresite OS" },
      { property: "og:description", content: "Subcontractor directory, insurances and assigned works." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Trades — Foresite OS" },
      { name: "description", content: "Subcontractor directory, insurances and assigned works." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Trades" icon="trades" blurb="Subcontractor directory, insurances and assigned works." />,
});
