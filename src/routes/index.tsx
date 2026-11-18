import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity, ArrowDown, ArrowRight, Bell, Building2, Check, ClipboardCheck, CreditCard, HardHat, Mail, MessageSquare, ShieldCheck, Sparkles, ThumbsDown, ThumbsUp, Users, Wallet,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/site/Section";
import { PlatformShowcase } from "@/components/site/v2/PlatformShowcase";
import { OperationalWorkspace } from "@/components/site/v2/OperationalWorkspace";
import { PlanCards } from "@/components/site/PlanCards";
import { TradeDirectoryDemo } from "@/components/site/v2/TradeDirectoryDemo";
import { Button } from "@/components/ui/button";
import { DIRECTORY, recommendTrades } from "@/content/trade-directory";

const TITLE = "Foresite — Reduce Delays. Protect Profit. Keep Projects Moving.";
const DESC = "Manage trades, variations, client approvals and defects with Foresite. Built for construction businesses that need project visibility, accountability and control.";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
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
        <Link to="/contact">Book</Link>
      </Button>
    </div>
  );
}

const BENEFITS = ["Reduced Administrative Work", "Improved Communication", "Greater Transparency", "Complete Traceability", "Faster Decisions", "Higher Client Confidence"];

const VALUE_CARDS = [
  { title: "Trade Control", icon: HardHat, tone: "bg-azure/10 text-azure", description: "Assign work. Track completion. Monitor compliance. Reduce subcontractor delays." },
  { title: "Financial Visibility", icon: Wallet, tone: "bg-health-good/10 text-health-good", description: "Manage variations, costs and project performance with confidence." },
  { title: "Defects & Evidence", icon: ShieldCheck, tone: "bg-construction/15 text-construction", description: "Capture photos, defects, approvals and project records from one place." },
  { title: "Client Decisions", icon: ClipboardCheck, tone: "bg-azure/10 text-azure", description: "Reduce selection delays and approval bottlenecks with a dedicated client experience." },
  { title: "Project Health", icon: Activity, tone: "bg-health-good/10 text-health-good", description: "Identify risks early and keep projects moving." },
];

const BUILDER_PROBLEMS = [
  { title: "Subcontractor Delays", icon: HardHat, outcome: "Keep trades accountable and work coordinated.", solutions: ["Trade Portal", "Task Management", "Trade Directory", "Upcoming Works"] },
  { title: "Cashflow Pressure", icon: Wallet, outcome: "See variations, costs and project performance together.", solutions: ["Project Visibility", "Variations", "Financial Tracking", "Project Health"] },
  { title: "Client Approval Delays", icon: ClipboardCheck, outcome: "Keep selections and decisions moving, without chasing emails.", solutions: ["Client Portal", "Selections", "Approvals", "Updates"] },
  { title: "Defects and Warranty Exposure", icon: ShieldCheck, outcome: "Keep evidence and rectification history connected to the job.", solutions: ["Defect Management", "Photo Evidence", "Audit History", "Rectification Tracking"] },
];

const MODULE_GROUPS = [
  { title: "Project Delivery", items: ["Projects", "Tasks", "Programme Tracking", "Project Health"] },
  { title: "Quality Management", items: ["Defects", "Approvals", "Client Sign-Off", "Rectification Tracking"] },
  { title: "Knowledge & Information", items: ["Documents", "Communications", "Photos", "Search"] },
  { title: "Commercial Management", items: ["Financials", "Variations", "Budgets", "Reporting"] },
  { title: "People & Permissions", items: ["Owner Workspace", "Client Portal", "Trade Portal", "Users & Permissions"] },
];

const HEALTH = [
  { label: "Schedule Health", value: 82 }, { label: "Financial Health", value: 91 }, { label: "Communication Health", value: 74 },
  { label: "Defect Health", value: 68 }, { label: "Delivery Health", value: 86 },
];

const AI_EXAMPLES = ["Project Risks", "Forecasting", "Document Summaries", "Communication Summaries", "Recommended Actions", "Trade Recommendations"];
const INDUSTRIES = ["Residential Builders", "Commercial Builders", "Civil Contractors", "Subcontractors", "Project Management Firms"];

const TRIAL_STEPS = ["Create Account", "Add Organisation Details", "Provide Billing Information", "Access Full Functionality", "30 Day Trial", "Automatic Plan Assignment Based On Usage"];

function Chips({ items }: { items: string[] }) {
  return <ul className="mt-6 flex flex-wrap gap-2">{items.map((i) => <li key={i} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground">{i}</li>)}</ul>;
}

function HomePage() {
  const recs = recommendTrades(DIRECTORY, "Roofer");
  return (
    <div className="homepage-outcomes">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="container-page relative pb-5 pt-6 text-center sm:pb-8 sm:pt-10 md:pt-12">
          <p className="text-sm font-semibold text-azure">Foresite <span className="mx-2 text-border">/</span><span className="font-medium text-muted-foreground">The Construction Operating System</span></p>
          <h1 className="mx-auto mt-4 max-w-5xl text-3xl font-bold leading-[1.12] text-foreground sm:mt-5 sm:text-5xl lg:text-6xl">Reduce Delays. <span className="text-azure">Protect Profit.</span><br className="hidden sm:block" /> Keep Projects Moving.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-secondary-foreground sm:mt-5 sm:text-lg">
            Foresite connects projects, trades, clients, defects, documents and project intelligence into a single platform built for modern construction businesses.
          </p>
          <div className="mt-5 flex justify-center sm:mt-6"><CTAButtons /></div>
          <p className="mx-auto mt-3 max-w-xl text-[11px] leading-relaxed text-muted-foreground sm:mt-4 sm:text-sm">Built for builders who need visibility, accountability and control without the complexity of traditional enterprise software.</p>
          <div className="mx-auto mt-5 max-w-5xl sm:mt-8"><OperationalWorkspace /></div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-8" aria-label="Construction business outcomes">
        <div className="container-page grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {VALUE_CARDS.map(({ title, icon: Icon, tone, description }) => (
            <article key={title} className="rounded-lg border border-border bg-card p-5">
              <div className={`mb-4 grid size-10 place-items-center rounded-md ${tone}`}><Icon className="size-5" /></div>
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-border bg-surface py-10" aria-label="Platform scale placeholders">
        <div className="container-page text-center">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Built For Builders, Trades and Clients.</h2>
          <p className="mt-2 text-xs text-muted-foreground">Illustrative sample figures · not live customer statistics</p>
          <dl className="mt-7 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[{ label: "Projects Managed", value: "120" }, { label: "Defects Tracked", value: "1,850" }, { label: "Trades Connected", value: "340" }, { label: "Documents Managed", value: "6,200" }].map(({ label, value }) => (
              <div key={label}><dd className="text-3xl font-semibold text-foreground">{value}</dd><dt className="mt-1 text-sm text-muted-foreground">{label}</dt></div>
            ))}
          </dl>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="Less chasing. More control." title="Built Around The Problems Builders Actually Face." />
        <div className="mt-9 divide-y divide-border border-y border-border">
          {BUILDER_PROBLEMS.map(({ title, icon: Icon, outcome, solutions }) => (
            <div key={title} className="grid gap-5 py-7 md:grid-cols-[1fr_1.4fr] md:gap-10">
              <div className="flex items-start gap-3"><Icon className="mt-1 size-5 shrink-0 text-construction" /><div><h3 className="text-lg font-semibold text-foreground">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{outcome}</p></div></div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 self-center">{solutions.map((solution) => <li key={solution} className="flex items-center gap-2 text-sm font-medium text-secondary-foreground"><Check className="size-4 shrink-0 text-azure" />{solution}</li>)}</ul>
            </div>
          ))}
        </div>
      </Section>

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
          <h3 className="text-xl font-semibold text-foreground">Construction Intelligence · Trade Recommendations</h3>
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
        <SectionHeading tone="light" eyebrow="Supporting your decisions" title="Construction Intelligence" description="AI works alongside your team to reduce administration, surface risks and improve decisions — supporting the people who keep projects moving." />
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
        <SectionHeading eyebrow="Software subscriptions" title="Simple Pricing For Growing Construction Businesses." description="Only pay for internal users. Unlimited clients, trades and external users are included in every plan." />
        <div className="mt-10"><PlanCards compact /></div>
        <p className="mt-6 text-sm text-secondary-foreground">Implementation and construction advisory services are optional and priced separately from software.</p>
        <div className="mt-6"><Button asChild variant="outline"><Link to="/pricing">Explore Pricing &amp; Advisory Services <ArrowRight className="size-4" /></Link></Button></div>
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
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold md:text-4xl">Less Chasing. Fewer Delays. More Control.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/75">Keep trades accountable, decisions moving and project risks visible with Foresite.</p>
          <div className="mt-8 flex justify-center"><CTAButtons light /></div>
        </div>
      </section>
    </div>
  );
}
