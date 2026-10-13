import { createFileRoute } from "@tanstack/react-router";
import { DirectoryModule } from "@/components/platform/RegisterModules";

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
  component: () => <DirectoryModule kind="Client" />,
});
