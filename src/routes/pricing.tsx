import { Link, createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { CTABand } from "@/components/site/CTABand";
import { Section, SectionHeading } from "@/components/site/Section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PORTAL_URL, PRICING_COMPARISON, PRICING_FAQ, PRICING_TIERS } from "@/content/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Foresite Plans for Construction Teams" },
      {
        name: "description",
        content:
          "Starter, Professional and Enterprise plans for construction businesses. Start a trial or book a demo of Foresite.",
      },
      { property: "og:title", content: "Pricing — Foresite Plans for Construction Teams" },
      {
        property: "og:description",
        content: "Three plans covering small businesses, growing contractors and large construction portfolios.",
      },
      { property: "og:url", content: "/pricing" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-azure">Pricing</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            Plans that scale with your delivery
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-secondary-foreground">
            Start with the delivery core and add commercial oversight, project health and intelligence as your portfolio
            grows.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <article
              key={tier.id}
              className={cn(
                "flex flex-col rounded-xl border bg-card p-7",
                tier.featured ? "border-azure shadow-raised" : "border-border shadow-panel",
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">{tier.name}</h2>
                {tier.featured ? (
                  <span className="rounded-full bg-azure/10 px-2.5 py-1 text-xs font-semibold text-azure">
                    Most popular
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-sm font-medium text-construction">{tier.audience}</p>
              <p className="mt-4 text-sm leading-relaxed text-secondary-foreground">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-2.5 border-t border-border pt-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-secondary-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-azure" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-2">
                <Button
                  asChild
                  className={cn(
                    tier.featured
                      ? "bg-azure text-azure-foreground hover:bg-azure/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  <a href={`${PORTAL_URL}/register`}>Start Trial</a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">Book Demo</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Compare plans" description="Everything included at each level of the platform." />
        <div className="mt-10 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Capability</TableHead>
                <TableHead>Starter</TableHead>
                <TableHead>Professional</TableHead>
                <TableHead>Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRICING_COMPARISON.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="font-medium text-foreground">{row.feature}</TableCell>
                  <TableCell className="text-secondary-foreground">{row.starter}</TableCell>
                  <TableCell className="text-secondary-foreground">{row.professional}</TableCell>
                  <TableCell className="text-secondary-foreground">{row.enterprise}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section>
        <SectionHeading title="Frequently asked questions" />
        <Accordion type="single" collapsible className="mt-8 max-w-3xl">
          {PRICING_FAQ.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-left text-base font-medium">{item.question}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-secondary-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <CTABand
        title="Talk to us about the right plan"
        description="We will recommend a plan based on your project volume, team size and reporting needs."
      />
    </>
  );
}
