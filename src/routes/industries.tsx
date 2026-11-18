import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { CTABand } from "@/components/site/CTABand";
import { Section, SectionHeading } from "@/components/site/Section";
import { INDUSTRIES } from "@/content/site";

export const Route = createFileRoute("/industries")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Industries — Foresite for Every Construction Sector" },
      {
        name: "description",
        content:
          "Foresite supports residential, commercial and civil construction, government projects and maintenance contracts on one platform.",
      },
      { property: "og:title", content: "Industries — Foresite for Every Construction Sector" },
      {
        property: "og:description",
        content:
          "Residential, commercial, civil, government and maintenance delivery teams run on the Foresite construction operating system.",
      },
      { property: "og:url", content: "/industries" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-azure">Industries</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            Built for the way your sector delivers
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-secondary-foreground">
            Contract structures, reporting obligations and quality regimes differ across construction. Foresite gives
            each sector the same operating system, configured to how work is measured and paid.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeading
          title="Sectors we support"
          description="Every sector uses the same connected record for projects, tasks, defects, documents and financials."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {INDUSTRIES.map((industry, index) => (
            <article
              key={industry.id}
              className="flex flex-col rounded-xl border border-border bg-card p-7 shadow-panel"
            >
              <span className="text-xs font-semibold tabular-nums text-construction">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-foreground">{industry.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary-foreground">{industry.description}</p>
              <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                {industry.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-secondary-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-azure" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <CTABand
        title="Not sure where your work fits?"
        description="Tell us how you deliver and we will show you the Foresite configuration that matches it."
      />
    </>
  );
}
