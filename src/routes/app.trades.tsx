import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/trades")({
  head: () => ({
    meta: [
      { title: "Trades — Foresite OS" },
      { name: "description", content: "Subcontractor directory, insurances and assigned works." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Trades" icon="trades" blurb="Subcontractor directory, insurances and assigned works." />,
});
