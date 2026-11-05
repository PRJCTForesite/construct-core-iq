import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Monitor, Smartphone, Tablet } from "lucide-react";

import heroDashboard from "@/assets/hero-dashboard.jpg";
import { CTABand } from "@/components/site/CTABand";
import { FeatureIcon } from "@/components/site/FeatureIcon";
import { PhoneMockup } from "@/components/site/PhoneMockup";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import {
  HERO_SUBHEADING,
  HOME_FEATURES,
  INDUSTRIES,
  MOBILE_HIGHLIGHTS,
  MOBILE_PANEL_ROWS,
  POSITIONING,
  STAKEHOLDERS,
  TAGLINE,
} from "@/content/site";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Foresite — The Construction Operating System" },
      {
        name: "description",
        content:
          "Construction Intelligence. One Platform. Complete Control. Manage projects, tasks, defects, documents, communications and financials in Foresite.",
      },
      { property: "og:title", content: "Foresite — The Construction Operating System" },
      {
        property: "og:description",
        content:
          "Manage projects, tasks, defects, documents, communications and financial performance from a single operating system.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const STATS = [
  { label: "Modules in one platform", value: "8" },
  { label: "Progress calculated", value: "Automatically" },
  { label: "Portfolio visibility", value: "Real time" },
  { label: "Built for", value: "Delivery teams" },
];

function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-40" aria-hidden="true" />
        <div className="container-page relative grid gap-14 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-secondary-foreground">
              {POSITIONING}
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl lg:text-[3.4rem]">
              {TAGLINE.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-secondary-foreground">{HERO_SUBHEADING}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-azure text-azure-foreground hover:bg-azure/90">
                <Link to="/contact">Book a Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-raised">
              <img
                src={heroDashboard}
                alt="Foresite dashboard showing projects, tasks, defects, financial health and project health score"
                width={1600}
                height={1008}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="relative border-t border-border bg-card">
          <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="One platform"
          title="Everything project delivery depends on"
          description="Foresite replaces disconnected spreadsheets, shared drives and email chains with one operating system for construction delivery."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_FEATURES.map((feature) => (
            <Link
              key={feature.id}
              to="/features"
              hash={feature.id}
              className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-panel"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-azure/10 text-azure">
                <FeatureIcon name={feature.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">{feature.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-azure">
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Every stakeholder"
          title="One record, every party on the project"
          description="Owners, head contractors and subcontractors work from the same live information, so status never depends on who compiled the last spreadsheet."
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STAKEHOLDERS.map((role) => (
            <div key={role.id} className="rounded-xl border border-border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-construction/10 text-construction">
                <FeatureIcon name={role.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">{role.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">{role.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="navy">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <SectionHeading
              eyebrow="Any device"
              tone="light"
              title="Built for the site, not just the site office"
              description="Foresite runs in the browser on desktop and in the field on mobile. The same projects, tasks, defects and drawings — sized for a phone in a high-vis pocket."
            />
            <ul className="mt-8 grid gap-3">
              {MOBILE_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-primary-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-construction" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground/60">
              <span className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" aria-hidden="true" /> Mobile
              </span>
              <span className="flex items-center gap-2">
                <Tablet className="h-4 w-4" aria-hidden="true" /> Tablet
              </span>
              <span className="flex items-center gap-2">
                <Monitor className="h-4 w-4" aria-hidden="true" /> Desktop
              </span>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-azure text-azure-foreground hover:bg-azure/90">
                <Link to="/download">Get the app</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/contact">Book a Demo</Link>
              </Button>
            </div>
          </div>

          <PhoneMockup title="Today on site" subtitle="Foresite mobile" rows={MOBILE_PANEL_ROWS} />
        </div>
      </Section>



      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <SectionHeading
            eyebrow="Built for construction"
            title="Proven across the way construction actually works"
            description="From residential volume delivery to civil works and government contracts, Foresite adapts to the contract, the programme and the reporting your clients expect."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {INDUSTRIES.map((industry) => (
              <li
                key={industry.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-4 text-sm font-medium text-foreground"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-construction" aria-hidden="true" />
                {industry.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link to="/industries">Explore industries</Link>
          </Button>
        </div>
      </Section>

      <CTABand />
    </>
  );
}
