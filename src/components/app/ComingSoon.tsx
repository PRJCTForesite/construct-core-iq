import { PageHeading, Panel } from "./primitives";
import { AppIcon } from "./AppIcon";
import type { NavIcon } from "@/content/app";

export function ComingSoon({ title, icon, blurb }: { title: string; icon: NavIcon; blurb: string }) {
  return (
    <div className="space-y-6">
      <PageHeading title={title} meta={blurb} />
      <Panel>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-azure/10">
            <AppIcon name={icon} className="h-5 w-5 text-azure" />
          </span>
          <p className="text-sm font-medium text-foreground">{title} module in build</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            This area is part of the Foresite roadmap and will connect to live project data once the backend is wired up.
          </p>
        </div>
      </Panel>
    </div>
  );
}
