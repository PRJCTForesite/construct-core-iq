import { cn } from "@/lib/utils";

type Row = { name: string; meta: string; value: string; tone?: "good" | "warn" | "bad" };

const TONE = {
  good: "bg-chart-5",
  warn: "bg-construction",
  bad: "bg-destructive",
} as const;

/**
 * Purely presentational phone frame used to show the field experience.
 * No data fetching — rows are supplied by content modules.
 */
export function PhoneMockup({
  title,
  subtitle,
  rows,
  className,
}: {
  title: string;
  subtitle: string;
  rows: Row[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-[17rem] rounded-[2.25rem] border border-border bg-card p-2.5 shadow-raised sm:w-[19rem]",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-surface">
        <div className="bg-primary px-5 pb-5 pt-4 text-primary-foreground">
          <div className="mx-auto mb-4 h-1 w-14 rounded-full bg-primary-foreground/25" aria-hidden="true" />
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-azure">{subtitle}</p>
          <p className="mt-1.5 text-base font-semibold">{title}</p>
        </div>
        <ul className="divide-y divide-border bg-card">
          {rows.map((row) => (
            <li key={row.name} className="flex items-center gap-3 px-4 py-3">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", TONE[row.tone ?? "good"])} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8rem] font-medium text-foreground">{row.name}</span>
                <span className="block truncate text-[0.7rem] text-muted-foreground">{row.meta}</span>
              </span>
              <span className="shrink-0 text-[0.7rem] font-semibold tabular-nums text-secondary-foreground">
                {row.value}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-3 text-[0.65rem] font-medium text-muted-foreground">
          <span className="text-azure">Projects</span>
          <span>Tasks</span>
          <span>Defects</span>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
