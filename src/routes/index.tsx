import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown, ArrowRight, Bell, Building2, Check, CreditCard, HardHat, Mail, MessageSquare, Sparkles, ThumbsDown, ThumbsUp, Users,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/site/Section";
import { PlatformShowcase } from "@/components/site/v2/PlatformShowcase";
import { TradeDirectoryDemo } from "@/components/site/v2/TradeDirectoryDemo";
import { Button } from "@/components/ui/button";
import { DIRECTORY, recommendTrades } from "@/content/trade-directory";

const TITLE = "Foresite — The Construction Operating System";
const DESC = "Complete visibility, greater control and operational intelligence. Foresite connects builders, trades and clients on one platform.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function CTAButtons({ light }: { light?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild size="lg" className="bg-azure text-azure-foreground hover:bg-azure/90">
        <Link to="/login/register">Start Free Trial <ArrowRight /></Link>
      </Button>
      <Button asChild size="lg" variant="outline" className={light ? "border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" : ""}>
        <Link to="/contact">Book Demo</Link>
      </Button>
    </div>
  );
}

const BENEFITS = ["Reduced Administrative Work", "Improved Communication", "Greater Transparency", "Complete Traceability", "Faster Decisions", "Higher Client Confidence"];

const MODULE_GROUPS = [
  { title: "Project Delivery", items: ["Projects", "Tasks", "Programme Tracking", "Project Health"] },
  { title: "Quality Management", items: ["Defects", "Approvals", "Client Sign-Off", "Rectification Tracking"] },
  { title: "Knowledge & Information", items: ["Documents", "Communications", "Photos", "Search"] },
  { title: "Commercial Management", items: ["Financials", "Variations", "Budgets", "Reporting"] },
  { title: "People & Permissions", items: ["Owner Workspace", "Client Portal", "Trade Portal", "Permissions Centre"] },
];

const HEALTH = [
  { label: "Schedule Health", value: 82 }, { label: "Financial Health", value: 91 }, { label: "Communication Health", value: 74 },
  { label: "Defect Health", value: 68 }, { label: "Delivery Health", value: 86 },
];

const AI_EXAMPLES = ["Project Risks", "Forecasting", "Document Summaries", "Communication Summaries", "Recommended Actions", "Trade Recommendations"];
const INDUSTRIES = ["Residential Builders", "Commercial Builders", "Civil Contractors", "Subcontractors", "Project Management Firms"];

const PLANS = [
  { name: "Starter", blurb: "For small builders getting organised.", directory: ["Basic Directory Access"] },
  { name: "Professional", blurb: "For growing teams running multiple projects.", directory: ["Directory Access", "Preferred Trades"], featured: true },
  { name: "Enterprise", blurb: "For multi-team and multi-region businesses.", directory: ["Directory", "Preferred Trades", "AI Trade Discovery", "Capacity Analytics"] },
];
const PLAN_INCLUDES = ["User-Based Pricing", "Implementation Services", "Founder Advisory", "Construction Intelligence Services"];

const TRIAL_STEPS = ["Create Account", "Add Organisation Details", "Provide Billing Information", "Access Full Functionality", "30 Day Trial", "Automatic Plan Assignment Based On Usage"];

function Chips({ items }: { items: string[] }) {
  return <ul className="mt-6 flex flex-wrap gap-2">{items.map((i) => <li key={i} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground">{i}</li>)}</ul>;
}

function HomePage() {
  const recs = recommendTrades(DIRECTORY, "Roofer");
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-40" aria-hidden="true" />
        <div className="container-page relative py-20 text-center md:py-28">
          <p className="mx-auto inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-azure">Builders · Trades · Clients · One platform</p>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] text-foreground sm:text-6xl">The Construction Operating System</h1>
          <p className="mx-auto mt-6 text-xl font-medium text-secondary-foreground sm:text-2xl">Complete Visibility. Greater Control. Operational Intelligence.</p>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Foresite centralises projects, defects, documents, financials, communications, trades and clients into one connected platform designed for modern construction businesses.
          </p>
          <div className="mt-9 flex justify-center"><CTAButtons /></div>
          <p className="mt-6 text-sm text-muted-foreground">This application works for you, not the other way around.</p>
        </div>
      </section>

      {/* Showcase */}
      <Section>
        <div className="text-center">
          <SectionHeading align="center" eyebrow="Interactive platform showcase" title="One Platform. Multiple Experiences." description="Foresite adapts to every stakeholder while maintaining one connected source of truth." />
        </div>
        <div className="mt-10"><PlatformShowcase /></div>
      </Section>

      {/* Ecosystem */}
      <Section tone="navy">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading tone="light" eyebrow="Simplicity ecosystem" title="Builders, Trades and Clients. All Working From One Platform." />
            <ul className="mt-6 space-y-2 text-primary-foreground/80">
              <li>No more lost emails.</li><li>No more disconnected systems.</li><li>No more chasing updates.</li>
            </ul>
            <p className="mt-4 text-primary-foreground">Foresite keeps everyone informed, accountable and connected.</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((b) => <li key={b} className="flex items-center gap-2 text-sm"><Check className="size-4 text-azure" />{b}</li>)}
            </ul>
          </div>
          <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-2" aria-label="Builder, Foresite, Trades and Clients connected">
            {[{ l: "Builder", i: Building2 }, { l: "Foresite", i: Sparkles, hub: true }, { l: "Trades", i: HardHat }, { l: "Clients", i: Users }].map((n, idx) => (
              <div key={n.l} className="flex w-full flex-col items-center gap-2">
                {idx > 0 && <span className="text-azure" aria-hidden="true">↕</span>}
                <div className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-4 font-semibold ${n.hub ? "border-azure bg-azure text-azure-foreground" : "border-primary-foreground/20 bg-primary-foreground/5"}`}>
                  <n.i className="size-5" />{n.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Modules */}
      <Section tone="surface">
        <SectionHeading eyebrow="Core platform modules" title="Everything your business runs on, connected." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {MODULE_GROUPS.map((g) => (
            <div key={g.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">{g.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-secondary-foreground">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mt-6"><Link to="/features" className="inline-flex items-center gap-1 text-sm font-semibold text-azure">Explore all features <ArrowRight className="size-4" /></Link></div>
      </Section>

      {/* Health */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading eyebrow="Project health" title="Know Project Health Before Problems Become Claims." description="Foresite identifies risks early so action can be taken before issues become delays, disputes or additional costs." />
          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-panel)]">
            {HEALTH.map((h) => (
              <div key={h.label} className="mb-3">
                <div className="flex justify-between text-sm"><span className="text-foreground">{h.label}</span><span className="font-semibold text-foreground">{h.value}</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${h.value < 75 ? "bg-construction" : "bg-azure"}`} style={{ width: `${h.value}%` }} /></div>
              </div>
            ))}
            <div className="mt-4 flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-primary-foreground">
              <span className="font-semibold">Overall Project Health</span><span className="text-2xl font-semibold">80</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Portals */}
      <Section tone="surface">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-azure">Client Portal</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Give Clients Confidence.</h2>
            <p className="mt-3 text-secondary-foreground">Reduce phone calls, uncertainty and frustration with a dedicated client experience.</p>
            <Chips items={["Approvals", "Progress Photos", "Updates", "Milestones", "Defects", "Documents"]} />
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-azure">Trade Portal</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Keep Trades Productive.</h2>
            <p className="mt-3 text-secondary-foreground">Give trades the information they need when they need it.</p>
            <Chips items={["Tasks", "Defects", "Communications", "Compliance", "Drawings", "Upcoming Works"]} />
          </div>
        </div>
      </Section>

      {/* Trade Directory */}
      <Section>
        <SectionHeading eyebrow="Trade Directory" title="Find Trusted Trades Faster" description="Search, engage and manage verified trades already operating within the Foresite ecosystem." />
        <div className="mt-10"><TradeDirectoryDemo /></div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">Know Who Is Available Before You Call.</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-azure/10 px-3 py-1 text-xs font-semibold text-azure">Available</span>
              <span className="rounded-full bg-construction/15 px-3 py-1 text-xs font-semibold text-foreground">Busy</span>
              <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">Unavailable</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-secondary-foreground">
              <li>Trades can set project capacity thresholds.</li>
              <li>Availability updates automatically as project workload changes.</li>
              <li>Manual override options remain available.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">Verified Ratings</h3>
            <p className="mt-3 text-3xl font-semibold text-foreground"><span className="text-construction">★★★★★</span> 4.9</p>
            <p className="mt-1 text-sm text-secondary-foreground">42 Verified Reviews · 89 Completed Projects</p>
            <p className="mt-4 text-sm text-muted-foreground">Public ratings from verified projects only. Only organisations that have engaged and worked with a trade can leave reviews.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">Preferred Contractor Network</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-foreground"><ThumbsUp className="size-4 text-azure" /><b>Trades+</b> Preferred Contractors</p>
              <p className="flex items-center gap-2 text-foreground"><ThumbsDown className="size-4 text-destructive" /><b>Trades-</b> Internal Performance Warnings</p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Build internal preferred contractor networks, track high-performing subcontractors and retain organisational knowledge.</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground">AI Powered Trade Recommendations</h3>
          <div className="mt-6 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1.4fr]">
            <div className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground">New Defect</p><p className="font-semibold text-foreground">Roof Leak</p></div>
            <ArrowRight className="mx-auto hidden text-azure md:block" /><ArrowDown className="mx-auto text-azure md:hidden" />
            <div className="rounded-lg border border-azure bg-azure/10 p-4"><p className="flex items-center gap-2 font-semibold text-foreground"><Sparkles className="size-4 text-azure" />AI Analysis</p><p className="text-xs text-muted-foreground">Roofing · Melbourne · Working at heights</p></div>
            <ArrowRight className="mx-auto hidden text-azure md:block" /><ArrowDown className="mx-auto text-azure md:hidden" />
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Recommended Trades</p>
              <ol className="mt-1 space-y-1 text-sm font-medium text-foreground">{recs.map((r, i) => <li key={r.id}>{i + 1}. {r.name} <span className="text-muted-foreground">· {r.rating}★</span></li>)}</ol>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Promotes local trades, previous trades, highest rated trades and available trades.</p>
        </div>
      </Section>

      {/* AI */}
      <Section tone="navy">
        <SectionHeading tone="light" eyebrow="Platform intelligence" title="AI works alongside your team." description="AI works alongside your team to reduce administration, surface risks and improve decisions." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AI_EXAMPLES.map((a) => <div key={a} className="flex items-center gap-2 rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3 text-sm"><Sparkles className="size-4 text-azure" />{a}</div>)}
        </div>
      </Section>

      {/* Industries */}
      <Section>
        <SectionHeading eyebrow="Industries" title="Built for every part of construction." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {INDUSTRIES.map((i) => <Link key={i} to="/industries" className="rounded-xl border border-border bg-card p-5 font-semibold text-foreground hover:border-azure">{i}</Link>)}
        </div>
      </Section>

      {/* Pricing */}
      <Section tone="surface">
        <SectionHeading eyebrow="Pricing" title="Plans that grow with your business." description={`Every plan includes ${PLAN_INCLUDES.join(", ").toLowerCase()} options.`} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-xl border bg-card p-6 ${p.featured ? "border-azure shadow-[var(--shadow-raised)]" : "border-border"}`}>
              <h3 className="text-xl font-semibold text-foreground">{p.name}</h3>
              <p className="mt-1 text-sm text-secondary-foreground">{p.blurb}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trade Directory</p>
              <ul className="mt-2 space-y-1.5 text-sm text-foreground">{p.directory.map((d) => <li key={d} className="flex items-center gap-2"><Check className="size-4 text-azure" />{d}</li>)}</ul>
            </div>
          ))}
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary-foreground">{PLAN_INCLUDES.map((i) => <li key={i} className="flex items-center gap-2"><Check className="size-4 text-azure" />{i}</li>)}</ul>
        <div className="mt-6"><Link to="/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-azure">Compare plans <ArrowRight className="size-4" /></Link></div>
      </Section>

      {/* Trial */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Free trial" title="Try Foresite Free For 30 Days." />
            <ol className="mt-6 space-y-3">
              {TRIAL_STEPS.map((s, i) => <li key={s} className="flex items-center gap-3 text-foreground"><span className="grid size-7 place-items-center rounded-full bg-azure text-xs font-semibold text-azure-foreground">{i + 1}</span>{s}</li>)}
            </ol>
          </div>
          <div className="space-y-3 self-center">
            {[{ i: Mail, t: "Email Reminder", d: "Your trial ends in 7 days." }, { i: MessageSquare, t: "SMS Reminder", d: "3 days left on your Foresite trial." }, { i: CreditCard, t: "Billing Notification", d: "Professional plan assigned based on usage." }, { i: Bell, t: "Upgrade / Downgrade Options", d: "Change plans any time from Settings." }].map((n) => (
              <div key={n.t} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-panel)]">
                <n.i className="mt-0.5 size-5 text-azure" /><div><p className="font-semibold text-foreground">{n.t}</p><p className="text-sm text-muted-foreground">{n.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-20 text-center">
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold md:text-4xl">Stop Managing Construction Across Multiple Systems.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/75">Bring projects, clients, trades, communications and project intelligence together in one connected platform.</p>
          <div className="mt-8 flex justify-center"><CTAButtons light /></div>
        </div>
      </section>
    </>
  );
}
