import { createFileRoute } from "@tanstack/react-router";
import { DocumentsModule } from "@/components/platform/RegisterModules";

export const Route = createFileRoute("/app/documents")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Documents \u2014 Foresite OS" },
      { property: "og:description", content: "Drawings, specs, contracts and revisions with version history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Documents — Foresite OS" },
      { name: "description", content: "Drawings, specs, contracts and revisions with version history." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <DocumentsModule />,
});
