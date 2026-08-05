import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/ai-insights")({
  head: () => ({
    meta: [
      { title: "AI Insights — Foresite OS" },
      { name: "description", content: "Forecasts, risk detection and recommended actions from your data." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="AI Insights" icon="ai" blurb="Forecasts, risk detection and recommended actions from your data." />,
});
