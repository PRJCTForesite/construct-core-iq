import { useMemo, useState } from "react";
import { BadgeCheck, MapPin, Search, ShieldCheck, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COMPLIANCE, DIRECTORY, LOCATIONS, RADII, TRADE_TYPES, availabilityFor, filterDirectory,
  type Availability, type DirectoryTrade,
} from "@/content/trade-directory";

const availTone: Record<Availability, string> = {
  Available: "bg-azure/10 text-azure",
  Busy: "bg-construction/15 text-foreground",
  Unavailable: "bg-destructive/10 text-destructive",
};

const selectCls = "h-9 w-full rounded-md border border-input bg-card px-2 text-sm text-foreground";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-construction" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("size-3.5", i < Math.round(rating) && "fill-current")} />)}
      <span className="ml-1 text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
    </span>
  );
}

export function TradeDirectoryDemo() {
  const [query, setQuery] = useState("");
  const [trade, setTrade] = useState("Electrician");
  const [location, setLocation] = useState("Melbourne");
  const [radiusKm, setRadius] = useState(20);
  const [compliance, setCompliance] = useState<string[]>(["Working At Heights"]);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [open, setOpen] = useState<DirectoryTrade | null>(null);

  const results = useMemo(
    () => filterDirectory(DIRECTORY, { query, trade, location, radiusKm, compliance, availableOnly }),
    [query, trade, location, radiusKm, compliance, availableOnly],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-4 rounded-xl border border-border bg-card p-5" aria-label="Directory filters">
        <label className="relative block">
          <span className="sr-only">Search trades</span>
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search trades" className={cn(selectCls, "pl-8")} />
        </label>
        <Field label="Trade type"><select className={selectCls} value={trade} onChange={(e) => setTrade(e.target.value)}>{TRADE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Location"><select className={selectCls} value={location} onChange={(e) => setLocation(e.target.value)}>{LOCATIONS.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Radius"><select className={selectCls} value={radiusKm} onChange={(e) => setRadius(Number(e.target.value))}>{RADII.map((r) => <option key={r} value={r}>{r} km</option>)}</select></Field>
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Compliance requirements</legend>
          <div className="mt-2 space-y-1.5">
            {COMPLIANCE.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={compliance.includes(c)} onChange={(e) => setCompliance((p) => (e.target.checked ? [...p, c] : p.filter((x) => x !== c)))} />
                {c}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} /> Available now only
        </label>
      </aside>

      <div>
        <p className="text-sm text-muted-foreground" aria-live="polite">{results.length} verified trade{results.length === 1 ? "" : "s"} found</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {results.map((t) => {
            const a = availabilityFor(t.activeJobs, t.capacity);
            return (
              <article key={t.id} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-panel)]">
                <div className="flex items-start justify-between gap-2">
                  <div><h4 className="font-semibold text-foreground">{t.name}</h4><p className="text-xs text-muted-foreground">{t.trade}</p></div>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", availTone[a])}>{a}</span>
                </div>
                <div className="mt-2"><Stars rating={t.rating} /></div>
                <ul className="mt-3 space-y-1 text-sm text-secondary-foreground">
                  <li className="flex items-center gap-2"><BadgeCheck className={cn("size-4", t.licenceVerified ? "text-azure" : "text-muted-foreground")} />Licence {t.licenceVerified ? "Verified" : "Pending"}</li>
                  <li className="flex items-center gap-2"><ShieldCheck className={cn("size-4", t.insuranceVerified ? "text-azure" : "text-destructive")} />Insurance {t.insuranceVerified ? "Verified" : "Expired"}</li>
                  <li>{t.completed} Completed Projects</li>
                  <li className="flex items-center gap-2"><MapPin className="size-4" />{t.region}</li>
                </ul>
                <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => setOpen(t)}>View Profile</Button>
              </article>
            );
          })}
          {results.length === 0 && <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground sm:col-span-2">No trades match. Try widening the radius or removing a requirement.</p>}
        </div>
        {open && <Profile trade={open} onClose={() => setOpen(null)} />}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span><div className="mt-1">{children}</div></label>;
}

function Profile({ trade: t, onClose }: { trade: DirectoryTrade; onClose: () => void }) {
  const a = availabilityFor(t.activeJobs, t.capacity);
  const items: [string, string][] = [
    ["Trade categories", t.trade],
    ["Service areas", t.serviceAreas.join(", ")],
    ["Compliance status", t.licenceVerified && t.insuranceVerified ? "Compliant" : "Action required"],
    ["Insurance status", t.insuranceVerified ? "Current" : "Expired"],
    ["Licences", t.licence],
    ["Tickets", t.tickets.join(", ")],
    ["Completed projects", String(t.completed)],
    ["Ratings", `${t.rating} from ${t.reviews} verified reviews`],
    ["Capacity", `${t.activeJobs} of ${t.capacity} active jobs · ${a}`],
    ["Contact", `${t.contact.name} · ${t.contact.phone}`],
  ];
  return (
    <section aria-label={`${t.name} profile`} className="mt-5 rounded-xl border border-azure/40 bg-card p-6 shadow-[var(--shadow-raised)]">
      <div className="flex items-start justify-between gap-3">
        <div><h4 className="text-xl font-semibold text-foreground">{t.name}</h4><p className="mt-1 text-sm text-secondary-foreground">{t.overview}</p></div>
        <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close profile"><X /></Button>
      </div>
      <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {items.map(([k, v]) => <div key={k}><dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt><dd className="text-sm font-medium text-foreground">{v}</dd></div>)}
      </dl>
      <div className="mt-5 grid grid-cols-3 gap-2" aria-label="Project photos">
        {["Switchboard", "Rough-in", "Fit-off"].map((p) => <div key={p} className="grid aspect-[4/3] place-items-center rounded-md bg-surface text-xs text-muted-foreground grid-blueprint">{p}</div>)}
      </div>
      {t.reviewQuotes.map((r) => <blockquote key={r.by} className="mt-4 border-l-2 border-azure pl-3 text-sm text-secondary-foreground">"{r.text}" <span className="text-muted-foreground">— {r.by}, verified project</span></blockquote>)}
    </section>
  );
}
