import { Link, createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { CTABand } from "@/components/site/CTABand";
import { DataPanel } from "@/components/site/DataPanel";
import { FeatureIcon } from "@/components/site/FeatureIcon";
import { Button } from "@/components/ui/button";
import { FEATURE_DETAILS } from "@/content/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/features")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Features — Foresite | Combined Construction Systems" },
      {
        name: "description",
        content:
          "Projects, tasks, defects, communications, documents, financials, project health and AI-assisted intelligence in one construction platform.",
      },
      { property: "og:title", content: "Features — Foresite | Combined Construction Systems" },
      {
        property: "og:description",
        content:
          "Eight connected modules covering delivery, quality, documents, commercial performance and project intelligence.",
      },
      { property: "og:url", content: "/features" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <>
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="container-page py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-azure">Platform</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            One connected system for construction delivery
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/70">
            Every Foresite module writes to the same project record, so progress, quality, documents and commercial
            performance stay consistent from site to boardroom.
          </p>
          <nav className="mt-9 flex flex-wrap gap-2" aria-label="Feature sections">
            {FEATURE_DETAILS.map((feature) => (
              <a
                key={feature.id}
                href={`#${feature.id}`}
                className="rounded-md border border-primary-foreground/20 px-3 py-1.5 text-sm text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {feature.eyebrow.split(" ")[0]}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {FEATURE_DETAILS.map((feature, index) => (
        <section
          key={feature.id}
          id={feature.id}
          className={cn("scroll-mt-20 border-b border-border py-20 md:py-24", index % 2 === 1 && "bg-surface")}
        >
          <div
            className={cn(
              "container-page grid gap-12 lg:grid-cols-2 lg:items-center",
              index % 2 === 1 && "lg:[&>*:first-child]:order-2",
            )}
          >
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-azure/10 text-azure">
                <FeatureIcon name={feature.icon} className="h-5 w-5" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-azure">{feature.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">{feature.title}</h2>
              {feature.id === 'health' && <div className="mt-4 border-l-2 border-azure bg-azure/10 p-4 text-sm text-secondary-foreground"><p><strong>Beta members only</strong> · Due to strong early demand, Project Health is currently available exclusively to Foresite beta members.</p><Link to="/contact" className="mt-2 inline-block font-semibold text-azure">Apply for beta access to get early access.</Link></div>}
              <p className="mt-4 text-base leading-relaxed text-secondary-foreground md:text-lg">
                {feature.description}
              </p>
              <ul className="mt-7 space-y-3">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-secondary-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-construction" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild className="bg-azure text-azure-foreground hover:bg-azure/90">
                  <Link to={feature.cta.to} search={{ enquiry: "demo" }}>{feature.cta.label}</Link>
                </Button>
              </div>
            </div>

            <DataPanel label={feature.panel.label} rows={feature.panel.rows} />
          </div>
        </section>
      ))}

      <CTABand
        title="See the full platform on your own projects"
        description="Book a walkthrough and we will map Foresite to the way your delivery teams already work."
      />
    </>
  );
}
