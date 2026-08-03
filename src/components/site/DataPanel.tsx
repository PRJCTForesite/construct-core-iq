import { cn } from "@/lib/utils";

type Row = { name: string; value: string; tone?: "good" | "warn" | "bad" };

const DOT = {
  good: "bg-chart-5",
  warn: "bg-construction",
  bad: "bg-destructive",
} as const;

/**
 * Presentational stand-in for a product panel. Purely visual — no business
 * logic, and no data fetching. Values are passed in from content modules.
 */
export function DataPanel({ label, rows, className }: { label: string; rows: Row[]; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-panel", className)}>
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </span>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.name} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <span className="flex items-center gap-2.5 text-sm text-secondary-foreground">
              <span className={cn("h-1.5 w-1.5 rounded-full", DOT[row.tone ?? "good"])} aria-hidden="true" />
              {row.name}
            </span>
            <span className="text-sm font-medium tabular-nums text-foreground">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
