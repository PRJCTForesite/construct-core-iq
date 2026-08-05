import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Foresite OS" },
      { name: "description", content: "Cost, schedule and quality reporting across the portfolio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Reports" icon="reports" blurb="Cost, schedule and quality reporting across the portfolio." />,
});
