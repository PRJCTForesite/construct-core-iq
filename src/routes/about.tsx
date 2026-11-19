import { Link, createFileRoute } from "@tanstack/react-router";

import { CTABand } from "@/components/site/CTABand";
import { Section, SectionHeading } from "@/components/site/Section";
import { POSITIONING, ROADMAP } from "@/content/site";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "About Foresite — Why We Built an Operating Combined Construction System" },
      {
        name: "description",
        content:
          "Foresite exists to give construction businesses one operating system for delivery, quality, documents and commercial performance.",
      },
      { property: "og:title", content: "About Foresite — Why We Built an Operating Combined Construction System" },
      {
        property: "og:description",
        content: "Our mission, vision, why Foresite exists and where the platform is heading.",
      },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="container-page py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-azure">About</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            {POSITIONING}, built by people who have delivered projects
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/70">
            Foresite exists because construction teams deserve better than disconnected spreadsheets, buried email
            chains and reporting that arrives too late to change the outcome.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-8 shadow-panel">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-azure">Mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground">
              To give every construction business a single operating system for delivery — where progress, quality,
              documents and money are measured on the same record.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-8 shadow-panel">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-construction">Vision</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground">
              A construction industry where every project decision is made with complete, current information — and
              where risk is visible long before it becomes cost.
            </p>
          </article>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Why Foresite exists"
          title="Construction runs on information that arrives too late"
          description="Programme sits in one tool, defects in another, documents on a shared drive and cost in accounting. By the time the numbers agree, the opportunity to act has passed."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "One record",
              body: "Projects, tasks, defects, documents, communications and financials share the same structure, so reporting reconciles by design.",
            },
            {
              title: "Measured, not estimated",
              body: "Weighted tasks and programme comparison replace manual percentage-complete estimates with progress you can defend.",
            },
            {
              title: "Early warning",
              body: "Health scoring and AI-assisted insight surface slipping programme, quality trends and margin erosion while there is still time.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-border bg-card p-7">
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title="Built by people who have been on site" />
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-secondary-foreground">
          <p>Foresite was built by Lachlan R. Davies and Jordan Messina — two construction professionals who spent years dealing with the exact problems this platform solves.</p>
          <p>Lachlan brings experience across commercial construction and the legal side of the industry, including hands-on work with contract claims, variations and extensions of time.</p>
          <p>Both identified the same gap: construction teams managing critical project information across emails, text messages, spreadsheets and disconnected apps, with no single source of truth. Foresite started as a tool they built to solve their own problems. When they saw the same issues across other trades and builders, they rebuilt it for the industry.</p>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Roadmap" title="Where the platform is heading" />
        <ol className="mt-10 space-y-0 border-l border-border">
          {ROADMAP.map((stage) => (
            <li key={stage.period} className="relative pb-10 pl-8 last:pb-0">
              <span
                className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-azure"
                aria-hidden="true"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-construction">{stage.period}</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{stage.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary-foreground">{stage.detail}</p>
              {stage.title === 'Project health and intelligence' && <Link to="/contact" className="mt-3 inline-block text-sm font-semibold text-azure">Apply for beta access to use Project Health on your current projects.</Link>}
            </li>
          ))}
        </ol>
      </Section>

      <CTABand />
    </>
  );
}
