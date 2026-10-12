import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Calendar \u2014 Foresite OS" },
      { property: "og:description", content: "Site meetings, inspections and trade scheduling across every project." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Calendar — Foresite OS" },
      { name: "description", content: "Site meetings, inspections and trade scheduling across every project." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Calendar" icon="calendar" blurb="Site meetings, inspections and trade scheduling across every project." />,
});
