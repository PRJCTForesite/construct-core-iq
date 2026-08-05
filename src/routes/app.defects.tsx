import { createFileRoute } from "@tanstack/react-router";
import { Camera, Plus, SlidersHorizontal } from "lucide-react";

import { DOT_TONE, PageHeading, Panel, Pill, type Tone } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { DEFECT_COLUMNS } from "@/content/app";

export const Route = createFileRoute("/app/defects")({
  head: () => ({
    meta: [
      { title: "Defects — Foresite OS" },
      { name: "description", content: "Kanban defect management from reported through rectification and approval." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DefectsPage,
});

const SEVERITY_TONE: Record<string, Tone> = { Critical: "bad", Medium: "warn", Low: "info" };

function DefectsPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Defects"
        meta="14 open · 3 critical · across 4 projects"
        actions={
          <>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" /> <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button size="sm" className="bg-azure text-azure-foreground hover:bg-azure/90">
              <Plus className="h-4 w-4" /> Log Defect
            </Button>
          </>
        }
      />

      <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:-mx-6 lg:px-6">
        <div className="flex min-w-max gap-4">
          {DEFECT_COLUMNS.map((column) => (
            <section key={column.key} className="w-[18.5rem] shrink-0">
              <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-panel">
                <span className={`h-2 w-2 rounded-full ${DOT_TONE[column.tone]}`} aria-hidden="true" />
                <span className="truncate text-sm font-semibold text-foreground">{column.label}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-semibold text-muted-foreground">
                  {column.items.length}
                </span>
              </header>

              <ul className="mt-3 space-y-3">
                {column.items.map((defect) => (
                  <li key={defect.id} className="rounded-xl border border-border bg-card p-3 shadow-panel">
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                      <Pill tone={SEVERITY_TONE[defect.severity] ?? "muted"}>{defect.severity}</Pill>
                      <span className="truncate text-right text-[0.625rem] text-muted-foreground">{defect.id}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium leading-snug text-foreground">{defect.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {defect.tags.map((tag) => (
                        <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[0.625rem] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border-t border-border pt-2.5">
                      <Camera className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      <span
                        className={`truncate text-[0.6875rem] ${
                          defect.metaTone === "warn"
                            ? "text-construction"
                            : defect.metaTone === "good"
                              ? "text-chart-5"
                              : defect.metaTone === "info"
                                ? "text-azure"
                                : "text-muted-foreground"
                        }`}
                      >
                        {defect.trade ? `${defect.trade} · ${defect.meta}` : defect.meta}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
