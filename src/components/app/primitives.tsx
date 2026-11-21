import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "./AppIcon";
import type { NavIcon } from "@/content/app";

export type Tone = "good" | "warn" | "bad" | "info" | "muted" | "accent";

export const DOT_TONE: Record<Tone, string> = {
  good: "bg-chart-5",
  warn: "bg-construction",
  bad: "bg-destructive",
  info: "bg-azure",
  muted: "bg-border",
  accent: "bg-chart-4",
};

export const TEXT_TONE: Record<Tone, string> = {
  good: "text-chart-5",
  warn: "text-construction",
  bad: "text-destructive",
  info: "text-azure",
  muted: "text-muted-foreground",
  accent: "text-chart-4",
};

export const SOFT_TONE: Record<Tone, string> = {
  good: "bg-chart-5/10 text-chart-5",
  warn: "bg-construction/10 text-construction",
  bad: "bg-destructive/10 text-destructive",
  info: "bg-azure/10 text-azure",
  muted: "bg-muted text-muted-foreground",
  accent: "bg-chart-4/10 text-chart-4",
};

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
  subtitle,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("flex flex-col rounded-xl border border-border bg-card shadow-panel", className)}>
      {(title || action) && (
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            {title && <h2 className="truncate text-[0.9375rem] font-semibold text-foreground">{title}</h2>}
            {subtitle && <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0 text-xs font-medium text-azure">{action}</div>}
        </header>
      )}
      <div className={cn("flex-1 p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatTile({
  label,
  value,
  meta,
  icon,
  tone,
}: {
  label: string;
  value: string;
  meta?: string;
  icon?: NavIcon;
  tone?: Tone;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-panel">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
        {icon && <AppIcon name={icon} className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </div>
      <p className={cn("mt-2 text-2xl font-semibold tabular-nums tracking-tight", tone ? TEXT_TONE[tone] : "text-foreground")}>
        {value}
      </p>
      {meta && <p className="mt-1 truncate text-xs text-muted-foreground">{meta}</p>}
    </div>
  );
}

export function Pill({ children, tone = "muted", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[0.6875rem] font-medium",
        SOFT_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusPill({ children, tone = "muted" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium",
        SOFT_TONE[tone],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT_TONE[tone])} aria-hidden="true" />
      {children}
    </span>
  );
}

export function Meter({ value, tone = "info", className }: { value: number; tone?: Tone; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full", DOT_TONE[tone])} style={{ width: `${value}%` }} />
    </div>
  );
}

const RING_SIZE = {
  default: { box: "h-32 w-32", label: "text-2xl" },
  sm: { box: "h-12 w-12", label: "text-sm" },
  md: { box: "h-24 w-24 md:h-32 md:w-32", label: "text-xl md:text-2xl" },
  lg: { box: "h-28 w-28 md:h-36 md:w-36", label: "text-2xl md:text-3xl" },
} as const;

export function Ring({ value, label, sub, size = "default" }: { value: number; label: string; sub?: string; size?: keyof typeof RING_SIZE }) {
  const circumference = 2 * Math.PI * 44;
  const dims = RING_SIZE[size];
  return (
    <div className={cn("relative grid shrink-0 place-items-center", dims.box)}>
      <svg viewBox="0 0 100 100" className={cn("-rotate-90", dims.box)}>
        <circle cx="50" cy="50" r="44" fill="none" strokeWidth={size === "sm" ? 10 : 8} className="stroke-muted" />
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          strokeWidth={size === "sm" ? 10 : 8}
          strokeLinecap="round"
          className="stroke-azure"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div className="absolute text-center">
        <p className={cn("font-semibold tabular-nums text-foreground", dims.label)}>{label}</p>
        {sub && size !== "sm" && <p className="text-[0.6875rem] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-azure/10 text-[0.6875rem] font-semibold text-azure",
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function PageHeading({
  title,
  meta,
  actions,
}: {
  title: string;
  meta?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h1>
        {meta && <p className="mt-1 text-sm text-muted-foreground">{meta}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
