import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Foresite OS" },
      { name: "description", content: "Every task across projects, trades and internal teams in one list." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Tasks" icon="tasks" blurb="Every task across projects, trades and internal teams in one list." />,
});
