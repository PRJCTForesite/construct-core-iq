import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/app/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Foresite OS" },
      { name: "description", content: "Drawings, specs, contracts and revisions with version history." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ComingSoon title="Documents" icon="documents" blurb="Drawings, specs, contracts and revisions with version history." />,
});
