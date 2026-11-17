import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SHOWCASE_VIEWS, showcaseSelection } from "@/content/platform-showcase";
import projectPhoto from "@/assets/client-home-progress.jpg";
import { cn } from "@/lib/utils";

const toneClass = { good: "bg-azure/10 text-azure", warn: "bg-construction/15 text-foreground", bad: "bg-destructive/10 text-destructive" };

export function PlatformShowcase() {
  const [selection, setSelection] = useState({ viewId: "owner", sectionIndex: 0 });
  const selected = showcaseSelection(selection.viewId, selection.sectionIndex);
  if (!selected) return null;
  const { view, section } = selected;
  return (
    <div aria-label="Interactive platform showcase">
      <div role="tablist" aria-label="Stakeholder experience" className="mx-auto flex w-fit flex-wrap justify-center gap-1 rounded-full border border-border bg-card p-1">
        {SHOWCASE_VIEWS.map((item) => (
          <Button key={item.id} variant="ghost" role="tab" aria-selected={item.id === view.id} aria-controls="showcase-workspace" onClick={() => setSelection({ viewId: item.id, sectionIndex: 0 })}
            className={cn("rounded-full px-4 py-2 text-sm font-medium", item.id === view.id ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "text-secondary-foreground hover:bg-muted")}>
            {item.label}
          </Button>
        ))}
      </div>
      <p className="mx-auto mt-5 max-w-xl text-center text-secondary-foreground">{view.description}</p>
      <div id="showcase-workspace" className="mt-8 overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-raised)]">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-destructive/60" /><span className="size-2.5 rounded-full bg-construction/70" /><span className="size-2.5 rounded-full bg-azure/60" />
          <span className="ml-3 truncate text-xs text-muted-foreground">app.foresite.com / {view.label.toLowerCase()}</span>
        </div>
        <div className="grid md:grid-cols-[200px_1fr]">
          <nav className="flex gap-1 overflow-x-auto border-b border-border bg-primary p-2 md:flex-col md:border-b-0" aria-label={`${view.label} sections`}>
            {view.sections.map((item, index) => (
              <Button key={item.label} variant="ghost" aria-pressed={item === section} aria-controls="showcase-content" onClick={() => setSelection({ viewId: view.id, sectionIndex: index })} className={cn("h-auto justify-start whitespace-nowrap rounded-md px-3 py-2 text-left text-sm", item === section ? "bg-azure text-azure-foreground hover:bg-azure hover:text-azure-foreground" : "text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground")}>
                {item.label}
              </Button>
            ))}
          </nav>
          <div id="showcase-content" role="region" aria-label={`${view.label}: ${section.label}`} aria-live="polite" className="min-h-[340px] min-w-0 p-4 sm:p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground">{section.label}</h3>
              <span className="text-xs text-muted-foreground">Illustrative sample data</span>
            </div>
            {section.layout === "photos" && <img src={projectPhoto} alt="Shared progress photo showing the residence at lock-up" className="mt-4 aspect-[3/1] w-full rounded-md object-cover" />}
            {section.layout === "progress" && <p className="mt-3 text-sm text-muted-foreground">Overall weighted progress <span className="font-semibold text-azure">72%</span></p>}
            <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
              {section.rows.map((item) => (
                <li key={item.name} className="px-3 py-3 sm:px-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0 flex-1 basis-40"><p className="text-sm font-medium text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">{item.meta}</p></div>
                    <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", toneClass[item.tone])}>{item.value}</span>
                  </div>
                  {section.layout === "progress" && <progress aria-label={`${item.name} completion`} value={parseInt(item.value)} max={100} className="mt-2 h-2 w-full accent-azure" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}