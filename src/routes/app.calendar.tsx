import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Foresite OS" },
      { name: "description", content: "Site meetings, inspections and trade scheduling across every project." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Calendar" icon="calendar" blurb="Site meetings, inspections and trade scheduling across every project." />,
});
