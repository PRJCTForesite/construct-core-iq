import { createFileRoute } from "@tanstack/react-router";
import { TasksModule } from "@/components/platform/RegisterModules";

export const Route = createFileRoute("/app/tasks")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { property: "og:title", content: "Tasks \u2014 Foresite OS" },
      { property: "og:description", content: "Every task across projects, trades and internal teams in one list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Tasks — Foresite OS" },
      { name: "description", content: "Every task across projects, trades and internal teams in one list." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <TasksModule />,
});
