import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { enquiry?: "sales" | "demo" | "advisory" | undefined; service?: string | undefined } => ({
    enquiry: search['enquiry'] === "advisory" || search['enquiry'] === "demo" || search['enquiry'] === "sales" ? search['enquiry'] : undefined,
    service: typeof search['service'] === "string" ? search['service'].slice(0, 120) : undefined,
  }),
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Contact Foresite — Software, Demos & Advisory" },
      {
        name: "description",
        content:
          "Contact the Foresite team to discuss your projects, request software pricing, book a demo or discuss optional construction advisory services.",
      },
      { property: "og:title", content: "Contact Foresite — Software, Demos & Advisory" },
      {
        property: "og:description",
        content: "Send us your details and we will arrange a walkthrough of Foresite for your delivery team.",
      },
      { property: "og:url", content: "/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  company: z.string().trim().min(1, { message: "Company is required" }).max(120),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(1, { message: "Message is required" }).max(1000),
});

type Errors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

const FIELDS = [
  { id: "name", label: "Name", type: "text", autoComplete: "name" },
  { id: "company", label: "Company", type: "text", autoComplete: "organization" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  { id: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
] as const;

function ContactPage() {
  const search = Route.useSearch();
  const [errors, setErrors] = useState<Errors>({});
  const [intent, setIntent] = useState<"sales" | "demo" | "advisory">(search.enquiry ?? "sales");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = contactSchema.safeParse({
      name: form.get("name"),
      company: form.get("company"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
    });

    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    event.currentTarget.reset();
    toast.success(
      "Preview only — your request has not been sent. Enquiry delivery is not connected.",
    );
  }

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-azure">Contact</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            Let's talk about your projects
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-secondary-foreground">
            Tell us how you deliver and we will show you how Foresite fits — from a single project to a full portfolio.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-border bg-card p-7 shadow-panel">
            <div className="mb-6">
              <Label htmlFor="enquiry">Enquiry type</Label>
              <select id="enquiry" className="mt-2 w-full rounded-md border border-input bg-background p-2 text-sm" value={intent} onChange={e => setIntent(e.target.value as "sales" | "demo" | "advisory")}><option value="sales">Software pricing</option><option value="demo">Book Demo</option><option value="advisory">Advisory Consultation</option></select>
              {search.service && <p className="mt-2 text-sm text-azure">{search.service}</p>}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.id} className={field.id === "email" || field.id === "phone" ? "" : "sm:col-span-1"}>
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.id !== "phone" ? <span className="text-destructive"> *</span> : null}
                  </Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    maxLength={255}
                    aria-invalid={Boolean(errors[field.id])}
                    className="mt-1.5"
                  />
                  {errors[field.id] ? (
                    <p className="mt-1.5 text-xs text-destructive">{errors[field.id]}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-5">
              <Label htmlFor="message">
                Message<span className="text-destructive"> *</span>
              </Label>
              <Textarea key={search.service ?? search.enquiry} defaultValue={search.service ? `I would like to discuss ${search.service}.` : search.enquiry === "advisory" ? "I would like an advisory consultation." : ""} id="message" name="message" rows={6} maxLength={1000} className="mt-1.5" />
              {errors.message ? <p className="mt-1.5 text-xs text-destructive">{errors.message}</p> : null}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button type="submit" className="bg-azure text-azure-foreground hover:bg-azure/90">{intent === 'advisory' ? 'Request Advisory Consultation' : intent === 'demo' ? 'Book Demo' : 'Contact Sales'}</Button>
              <p className="w-full text-xs text-muted-foreground">Preview only · requests are not sent.</p>
            </div>
          </form>

          <aside className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "sales@foresite.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 018-4420" },
              { icon: MapPin, label: "Office", value: "Available for on-site walkthroughs by arrangement" },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-azure/10 text-azure">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-sm text-secondary-foreground">{item.value}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-border bg-surface p-5 text-sm leading-relaxed text-secondary-foreground">
              Demo requests usually get a response within one business day. Enterprise portfolios are handled by a
              dedicated team.
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
