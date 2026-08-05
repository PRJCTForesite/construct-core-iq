import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Foresite OS" },
      { name: "description", content: "Company profile, users, permissions and integrations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Settings" icon="settings" blurb="Company profile, users, permissions and integrations." />,
});
