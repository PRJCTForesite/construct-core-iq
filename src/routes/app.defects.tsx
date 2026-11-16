import { DefectsWorkflow } from '@/components/platform/DefectsWorkflow';
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Plus, SlidersHorizontal } from "lucide-react";

import { DOT_TONE, PageHeading, Panel, Pill, type Tone } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { DEFECT_COLUMNS } from "@/content/app";

export const Route = createFileRoute("/app/defects")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Defects \u2014 Foresite OS" },
      { property: "og:description", content: "Kanban defect management from reported through rectification and approval." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Defects — Foresite OS" },
      { name: "description", content: "Kanban defect management from reported through rectification and approval." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DefectsPage,
});

function DefectsPage() { return <DefectsWorkflow/>; }
