import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/clients")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Clients \u2014 Foresite OS" },
      { property: "og:description", content: "Client records, portal access and communication history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Clients — Foresite OS" },
      { name: "description", content: "Client records, portal access and communication history." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Clients" icon="clients" blurb="Client records, portal access and communication history." />,
});
