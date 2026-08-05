import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/clients")({
  head: () => ({
    meta: [
      { title: "Clients — Foresite OS" },
      { name: "description", content: "Client records, portal access and communication history." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Clients" icon="clients" blurb="Client records, portal access and communication history." />,
});
