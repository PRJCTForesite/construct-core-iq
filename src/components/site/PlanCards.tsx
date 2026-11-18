import { Link } from '@tanstack/react-router';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_TIERS, money } from '@/content/pricing';
import { cn } from '@/lib/utils';

export function PlanCards({ compact = false, preview = false }: { compact?: boolean; preview?: boolean }) {
  return <div className="grid gap-5 lg:grid-cols-3">{PRICING_TIERS.map(tier => <article key={tier.id} className={cn('flex min-w-0 flex-col rounded-lg border bg-card p-6', tier.featured ? 'border-azure shadow-raised' : 'border-border')}>
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xl font-semibold text-foreground">{tier.name}</h3>{tier.featured && <span className="rounded-md bg-azure/10 px-2 py-1 text-xs font-semibold text-azure">Most Popular</span>}</div>
    <p className="mt-3 text-sm text-muted-foreground">{tier.audience}</p>
    <div className="mt-6"><p className="text-4xl font-semibold text-foreground">{money(tier.price)}</p><p className="mt-1 text-sm text-secondary-foreground">{tier.unit}</p></div>
    {tier.futurePrice ? <p className="mt-3 text-xs text-muted-foreground">Future target: {money(tier.futurePrice)} per user / month · not current pricing</p> : <p className="mt-3 text-sm text-muted-foreground">20 internal users included<br />Additional users: {money(tier.additionalUserPrice ?? 50)} per user / month</p>}
    <p className="mt-5 border-y border-border py-3 text-sm font-medium text-azure">Clients Included · Trades Included</p>
    <ul className="my-5 flex-1 space-y-2.5">{(compact ? tier.features.slice(0, 4) : tier.features).map(feature => <li key={feature} className="flex items-start gap-2 text-sm text-secondary-foreground"><Check className="mt-0.5 size-4 shrink-0 text-azure" />{feature}</li>)}</ul>
    <Button asChild variant={tier.featured ? 'default' : 'outline'}><Link to={preview || compact ? '/pricing' : '/login/register'}>{preview ? 'View plan details' : compact ? 'Compare Plans' : 'Start Free Trial'}</Link></Button>
    {!compact && !preview && <Button asChild variant="ghost" className="mt-2"><Link to="/contact" search={{ enquiry: 'demo' }}>Book</Link></Button>}
  </article>)}</div>;
}
