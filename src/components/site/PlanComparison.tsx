import { PRICING_COMPARISON, PRICING_TIERS } from "@/content/pricing";

const PLAN_KEYS = ["starter", "professional", "enterprise"] as const;

/** Plan comparison that stacks on narrow screens so it never scrolls sideways. */
export function PlanComparison({ firstColumn = "Capability" }: { firstColumn?: string }) {
  const names = PLAN_KEYS.map((key, index) => PRICING_TIERS[index]?.name ?? key);
  return <div className="@container rounded-lg border border-border bg-card">
    <ul className="divide-y divide-border @min-[40rem]:hidden">
      {PRICING_COMPARISON.map(row => <li key={row.feature} className="px-4 py-3">
        <p className="text-sm font-medium">{row.feature}</p>
        <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
          {PLAN_KEYS.map((key, index) => <div key={key} className="min-w-0"><dt className="text-muted-foreground">{names[index]}</dt><dd className="break-words">{row[key]}</dd></div>)}
        </dl>
      </li>)}
    </ul>
    <table className="hidden w-full text-left text-sm @min-[40rem]:table">
      <thead><tr className="border-b border-border text-muted-foreground"><th className="w-[28%] px-4 py-3 font-medium">{firstColumn}</th>{names.map(name => <th key={name} className="px-4 py-3 font-medium">{name}</th>)}</tr></thead>
      <tbody className="divide-y divide-border">{PRICING_COMPARISON.map(row => <tr key={row.feature}><td className="px-4 py-3 font-medium">{row.feature}</td>{PLAN_KEYS.map(key => <td key={key} className="px-4 py-3">{row[key]}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}
