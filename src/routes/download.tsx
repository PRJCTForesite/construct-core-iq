import { createFileRoute } from "@tanstack/react-router";
import { Apple, Monitor, Smartphone, QrCode } from "lucide-react";

import { CTABand } from "@/components/site/CTABand";
import { Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { APP_URL } from "@/content/site";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Download Foresite — Desktop and Mobile Apps" },
      {
        name: "description",
        content: "Download Foresite for Windows and Mac, or get the mobile app for Android and iPhone.",
      },
      { property: "og:title", content: "Download Foresite — Desktop and Mobile Apps" },
      {
        property: "og:description",
        content: "Foresite runs on Windows, Mac, Android and iPhone so site and office teams work from the same record.",
      },
      { property: "og:url", content: "/download" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/download" }],
  }),
  component: DownloadPage,
});

const DESKTOP = [
  {
    id: "windows",
    icon: Monitor,
    title: "Windows",
    detail: "Windows 10 and 11, 64-bit. Includes automatic updates.",
    cta: "Download for Windows",
  },
  {
    id: "mac",
    icon: Apple,
    title: "Mac",
    detail: "macOS 13 or later. Apple silicon and Intel supported.",
    cta: "Download for Mac",
  },
];

const MOBILE = [
  { id: "android", title: "Android", store: "Get it on Google Play" },
  { id: "iphone", title: "iPhone", store: "Download on the App Store" },
];

function DownloadPage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-azure">Download</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            Foresite on every device your team uses
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-secondary-foreground">
            Install the desktop application for office and commercial work, and the mobile app for inspections, defects
            and progress capture on site.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeading title="Desktop" description="Full platform access for delivery, document control and financial oversight." />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {DESKTOP.map((item) => (
            <article key={item.id} className="rounded-xl border border-border bg-card p-7 shadow-panel">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-azure/10 text-azure">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-secondary-foreground">{item.detail}</p>
              <Button asChild className="mt-6 bg-azure text-azure-foreground hover:bg-azure/90">
                <a href={APP_URL}>{item.cta}</a>
              </Button>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Mobile" description="Scan the code with your device camera, or install from the store." />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {MOBILE.map((item) => (
            <article key={item.id} className="flex gap-6 rounded-xl border border-border bg-card p-7 shadow-panel">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground">
                <QrCode className="h-14 w-14" aria-hidden="true" />
                <span className="sr-only">QR code for the {item.title} app</span>
              </div>
              <div>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-construction/10 text-construction">
                  <Smartphone className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{item.title}</h3>
                <Button asChild variant="outline" className="mt-4">
                  <a href={APP_URL}>{item.store}</a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CTABand
        title="Need Foresite deployed across your organisation?"
        description="We support managed rollout, single sign-on and device policies for enterprise teams."
      />
    </>
  );
}
