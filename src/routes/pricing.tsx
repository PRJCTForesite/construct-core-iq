import { Link, createFileRoute } from '@tanstack/react-router';
import { Check, ArrowRight, Users, HardHat, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Section, SectionHeading } from '@/components/site/Section';
import { PlanCards } from '@/components/site/PlanCards';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PRICING_COMPARISON, PRICING_FAQ, PRICING_TIERS, ASSURANCE_SERVICES, DELAY_SERVICES, SERVICE_PACKAGES, MOST_REQUESTED, servicePrice, type AdvisoryService } from '@/content/pricing';

const title = 'Foresite Pricing — Software Plans & Optional Advisory Services';
const description = 'Starter $50/user/month, Professional $100/user/month and Enterprise $10,000/year. Clients and trades included. Explore optional implementation and construction advisory services.';
export const Route = createFileRoute('/pricing')({
  staticData: { sitemap: true },
  head: () => ({ meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: PricingPage,
});
function ServiceCards({ services }: { services: AdvisoryService[] }) {
  return <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{services.map(service => <article key={service.name} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-6">
    {service.requested && <p className="mb-3 text-xs font-semibold text-azure">Most Requested</p>}
    <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
    <p className="mt-4 text-2xl font-semibold text-foreground">{servicePrice(service)}</p>{service.unit && <p className="mt-1 text-sm text-muted-foreground">{service.unit}</p>}
    <ul className="my-5 flex-1 space-y-2">{service.features.map(feature => <li key={feature} className="flex items-start gap-2 text-sm text-secondary-foreground"><Check className="mt-0.5 size-4 shrink-0 text-azure" />{feature}</li>)}</ul>
    <Button asChild variant="outline" className="h-auto min-h-9 whitespace-normal text-center"><Link to="/contact" search={{ enquiry: 'advisory', service: service.name }}>Request Consultation <ArrowRight className="size-4 shrink-0" /></Link></Button>
  </article>)}</div>;
}
function PricingPage() {
  const [view, setView] = useState('software');
  return <>
    <section className="border-b border-border bg-surface">
      <div className="container-page py-12 md:py-16">
        <p className="text-sm font-semibold text-azure">Foresite / Pricing &amp; Professional Services</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">Simple Pricing For Growing Construction Businesses.</h1>
        <p className="mt-5 max-w-2xl text-lg text-secondary-foreground">Choose the platform that suits your organisation today and scale as your projects grow.</p>
        <div className="mt-7 flex flex-wrap gap-5 text-sm font-medium text-foreground">{['Clients Included', 'Trades Included', 'Only Pay For Internal Users'].map(item => <span key={item} className="flex items-center gap-2"><Check className="size-4 text-azure" />{item}</span>)}</div>
      </div>
    </section>
    <div className="border-b border-border bg-background"><div className="container-page py-4"><Tabs value={view} onValueChange={setView}><TabsList className="h-auto flex-wrap"><TabsTrigger value="software">Software Subscriptions</TabsTrigger><TabsTrigger value="services">Professional Services</TabsTrigger></TabsList></Tabs></div></div>
    {view === 'software' ? <div role="region" aria-label="Software Subscriptions">
      <Section className="py-12 md:py-14"><PlanCards /><p className="mt-6 text-sm text-muted-foreground">Beta pricing is in effect for founding members. Rates will be confirmed at full launch. Implementation and advisory services are separate.</p></Section>
      <Section tone="surface"><SectionHeading title="Compare Plans" description="Choose the capabilities your internal team needs. Every plan includes unlimited external users." />
        <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card"><Table className="min-w-[700px]"><TableHeader><TableRow><TableHead className="w-[28%]">Capability</TableHead>{PRICING_TIERS.map(tier => <TableHead key={tier.id}>{tier.name}</TableHead>)}</TableRow></TableHeader><TableBody>{PRICING_COMPARISON.map(row => <TableRow key={row.feature}><TableCell className="font-medium">{row.feature}</TableCell><TableCell>{row.starter}</TableCell><TableCell>{row.professional}</TableCell><TableCell>{row.enterprise}</TableCell></TableRow>)}</TableBody></Table></div>
      </Section>
      <Section><SectionHeading title="Only Pay For Internal Users." description="Foresite is designed to connect builders, clients and trades without charging every stakeholder separately." /><div className="mt-8 grid gap-5 md:grid-cols-3">{[{ label: 'Unlimited Clients', Icon: Users }, { label: 'Unlimited Trades', Icon: HardHat }, { label: 'Unlimited External Users', Icon: Building2 }].map(({ label, Icon }) => <article key={label} className="rounded-lg border border-border p-6"><Icon className="size-6 text-azure" /><h3 className="mt-4 text-lg font-semibold">{label}</h3><p className="mt-2 text-sm text-muted-foreground">Included in every Foresite software plan.</p></article>)}</div></Section>
      <Section tone="surface"><SectionHeading eyebrow="Implementation & Onboarding" title="Implementation Options." /><div className="mt-8 grid gap-5 md:grid-cols-3">{PRICING_TIERS.map(tier => <article key={tier.id} className="rounded-lg border border-border bg-card p-6"><h3 className="text-lg font-semibold">{tier.name}</h3><p className="mt-4 text-secondary-foreground">{tier.onboarding}</p></article>)}</div><Button variant="outline" className="mt-7" onClick={() => setView('services')}>Explore Optional Advisory Services <ArrowRight /></Button></Section>
    </div> : <div role="region" aria-label="Professional Services">
      <Section className="py-12 md:py-14"><SectionHeading eyebrow="Foresite Advisory Services" title="Construction Intelligence Beyond The Software." description="When additional expertise is needed, Foresite offers project assurance, delivery reviews and claims support services delivered by experienced construction professionals." /><p className="mt-5 border-l-2 border-azure pl-4 text-sm font-medium text-foreground">These services are optional and are separate from software subscriptions.</p>
        <h3 className="mt-10 text-lg font-semibold">Most Requested Services</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{MOST_REQUESTED.map(service => <Button key={service.name} asChild variant="outline" className="h-auto min-h-12 justify-between whitespace-normal text-left"><Link to="/contact" search={{ enquiry: 'advisory', service: service.name }}>{service.name}<ArrowRight className="size-4 shrink-0" /></Link></Button>)}</div>
      </Section>
      <Section tone="surface"><SectionHeading eyebrow="Project Assurance Services" title="Founder Advisory Services" /><ServiceCards services={ASSURANCE_SERVICES} /></Section>
      <Section><SectionHeading title="Delay & Claims Services" description="Helping builders maintain contractual compliance, manage delays and organise evidence." /><ServiceCards services={DELAY_SERVICES} /></Section>
      <Section tone="surface"><SectionHeading eyebrow="Combined Service Packages" title="Software + Advisory Packages" description="Optional ongoing support alongside your Foresite software. Software licences are priced separately; package scope is agreed during consultation." /><ServiceCards services={SERVICE_PACKAGES} /></Section>
    </div>}
    <Section><SectionHeading title="Frequently Asked Questions" /><Accordion type="single" collapsible className="mt-8 max-w-3xl">{PRICING_FAQ.map(item => <AccordionItem key={item.question} value={item.question}><AccordionTrigger className="text-left">{item.question}</AccordionTrigger><AccordionContent>{item.answer}</AccordionContent></AccordionItem>)}</Accordion></Section>
    <Section tone="navy"><SectionHeading tone="light" title="Whether You Need Software Or Support, Foresite Has You Covered." /><div className="mt-8 flex flex-wrap gap-3"><Button asChild className="bg-azure text-azure-foreground hover:bg-azure/90"><Link to="/contact">Apply for Beta Access</Link></Button><Button asChild variant="outline"><Link to="/contact" search={{ enquiry: 'demo' }}>Book a Demo</Link></Button><Button asChild variant="outline" className="h-auto min-h-9 whitespace-normal"><Link to="/contact" search={{ enquiry: 'advisory' }}>Request Advisory Consultation</Link></Button></div></Section>
  </>;
}
