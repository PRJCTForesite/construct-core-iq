import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useServerFn } from '@tanstack/react-start';
import { submitBetaApplication } from '@/lib/beta-application.functions';
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_LINK, STATES, ROLES, SIZES, PROJECT_COUNTS, SECTORS, PAIN_POINTS, SOURCES, applicationFromForm } from "@/content/beta-registration";

const title = "Apply for Beta Access — Foresite";
const description = "Apply for Foresite’s limited beta for Australian builders, trades and project teams. Contact admin@foresite.com.au or call 0437 722 552.";
export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): { enquiry?: "sales" | "demo" | "advisory" | undefined; service?: string | undefined } => ({
    enquiry: search['enquiry'] === "advisory" || search['enquiry'] === "demo" || search['enquiry'] === "sales" ? search['enquiry'] : undefined,
    service: typeof search['service'] === "string" ? search['service'].slice(0, 120) : undefined,
  }),
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/contact" }] }),
  component: ContactPage,
});

function ContactPage() {
  const search = Route.useSearch();
  const submitApplication = useServerFn(submitBetaApplication);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [deliveryError, setDeliveryError] = useState('');
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const result = applicationFromForm(new FormData(event.currentTarget), search.enquiry ?? 'beta', search.service ?? '');
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map(issue => [String(issue.path[0]), issue.message])));
      return;
    }
    setErrors({});
    setDeliveryError('');
    setStatus('sending');
    try {
      const response = await submitApplication({ data: result.data });
      if (response.accepted) setStatus('success');
      else { setStatus('idle'); setDeliveryError(response.error); }
    } catch {
      setStatus('idle');
      setDeliveryError('Your application could not be submitted. Please try again or contact us directly.');
    }
  }
  const selectClass = "mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
  const error = (key: string) => errors[key] ? <p id={`${key}-error`} role="alert" className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;
  return <>
    <section className="border-b border-border bg-surface"><div className="container-page py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-azure">Private beta</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">Apply for Beta Access</h1>
      <p className="mt-5 max-w-2xl text-lg text-secondary-foreground">Foresite is currently in a limited beta. Tell us about your business and we will be in touch within one business day.</p>
    </div></section>
    <Section><div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      {status === 'success' ? <div role="status" className="border-l-2 border-azure py-6 pl-6"><CheckCircle2 className="size-9 text-azure" /><h2 className="mt-4 text-2xl font-semibold">Thank You</h2><p className="mt-4 text-secondary-foreground">Thanks — we will review your application and be in touch within one business day. Beta places are limited.</p></div> : <form onSubmit={handleSubmit} noValidate className="min-w-0 space-y-8">
        {search.enquiry && <p className="border-l-2 border-azure pl-4 text-sm text-secondary-foreground">{search.enquiry === 'demo' ? 'Book a Demo' : search.enquiry === 'advisory' ? 'Advisory Consultation' : 'Software Pricing'}{search.service ? ` · ${search.service}` : ''}</p>}
        <fieldset><legend className="mb-5 text-lg font-semibold">Your details</legend><div className="grid gap-5 sm:grid-cols-2">
          {[{ id: 'name', label: 'Full name', type: 'text', auto: 'name', max: 100 }, { id: 'company', label: 'Company name', type: 'text', auto: 'organization', max: 120 }, { id: 'email', label: 'Email address', type: 'email', auto: 'email', max: 255 }, { id: 'phone', label: 'Phone number', type: 'tel', auto: 'tel', max: 30 }].map(field => <div key={field.id}><Label htmlFor={field.id}>{field.label} <span className="text-destructive">*</span></Label><Input className="mt-2" id={field.id} name={field.id} type={field.type} autoComplete={field.auto} maxLength={field.max} required aria-invalid={Boolean(errors[field.id])} aria-describedby={errors[field.id] ? `${field.id}-error` : undefined} />{error(field.id)}</div>)}
          <div><Label htmlFor="state">State / territory <span className="text-destructive">*</span></Label><select id="state" name="state" required className={selectClass} aria-invalid={Boolean(errors['state'])} defaultValue=""><option value="">Select state / territory</option>{STATES.map(value => <option key={value}>{value}</option>)}</select>{error('state')}</div>
          <div><Label htmlFor="role">Your role</Label><select id="role" name="role" className={selectClass} defaultValue=""><option value="">Select role (optional)</option>{ROLES.map(value => <option key={value}>{value}</option>)}</select>{error('role')}</div>
        </div></fieldset>
        <fieldset className="border-t border-border pt-7"><legend className="pr-3 text-lg font-semibold">Your business</legend><div className="grid gap-5 sm:grid-cols-2">
          {[{ id: 'size', label: 'Company size — internal staff', options: SIZES }, { id: 'projects', label: 'Number of active projects at any time', options: PROJECT_COUNTS }].map(field => <div key={field.id}><Label htmlFor={field.id}>{field.label}</Label><select id={field.id} name={field.id} className={selectClass} defaultValue=""><option value="">Select (optional)</option>{field.options.map(value => <option key={value}>{value}</option>)}</select>{error(field.id)}</div>)}
        </div><fieldset className="mt-6"><legend className="text-sm font-medium">Primary sector</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{SECTORS.map(value => <label key={value} className="flex items-start gap-2 text-sm text-secondary-foreground"><input className="mt-1 accent-azure" type="checkbox" name="sectors" value={value} />{value}</label>)}</div>{error('sectors')}</fieldset>
          <div className="mt-6"><Label htmlFor="tools">Current tools you use to manage projects</Label><Input id="tools" name="tools" className="mt-2" maxLength={500} placeholder="e.g. spreadsheets, Buildxact, email, nothing" />{error('tools')}</div>
        </fieldset>
        <fieldset className="border-t border-border pt-7"><legend className="pr-3 text-lg font-semibold">Biggest pain points right now</legend><p className="mb-4 text-sm text-muted-foreground">Select up to three</p><div className="space-y-3">{PAIN_POINTS.map(value => <label key={value} className="flex items-start gap-2 text-sm text-secondary-foreground"><input className="mt-1 accent-azure" type="checkbox" name="painPoints" value={value} checked={painPoints.includes(value)} disabled={painPoints.length >= 3 && !painPoints.includes(value)} onChange={e => setPainPoints(previous => e.target.checked ? [...previous, value] : previous.filter(item => item !== value))} />{value}</label>)}</div>{error('painPoints')}</fieldset>
        <div><Label htmlFor="source">How did you hear about Foresite?</Label><select id="source" name="source" className={selectClass} defaultValue=""><option value="">Select (optional)</option>{SOURCES.map(value => <option key={value}>{value}</option>)}</select>{error('source')}</div>
        <div><Label htmlFor="comments">Anything else you want us to know</Label><Textarea id="comments" name="comments" rows={5} maxLength={2000} className="mt-2" defaultValue={search.service ? `I would like to discuss ${search.service}.` : ''} />{error('comments')}</div>
        {deliveryError && <p role="alert" className="text-sm text-destructive">{deliveryError}</p>}
        <Button type="submit" size="lg" disabled={status === 'sending'} className="h-auto min-h-11 whitespace-normal">{status === 'sending' ? 'Submitting…' : 'Apply for Beta Access'}</Button>
        <p className="text-xs text-muted-foreground">Applications are forwarded to the Foresite team through FormSubmit.</p>
      </form>}
      <aside className="space-y-7 border-t border-border pt-7 lg:border-t-0 lg:pt-0">
        <div className="flex gap-4"><Mail className="mt-1 size-5 shrink-0 text-azure" /><div><h2 className="text-sm font-semibold">Email</h2><a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 inline-block break-all text-base text-azure">{CONTACT_EMAIL}</a></div></div>
        <div className="flex gap-4"><Phone className="mt-1 size-5 shrink-0 text-azure" /><div><h2 className="text-sm font-semibold">Phone</h2><a href={CONTACT_PHONE_LINK} className="mt-2 inline-block text-base text-azure">{CONTACT_PHONE}</a></div></div>
        <p className="border-t border-border pt-5 text-sm leading-relaxed text-secondary-foreground">Demo requests usually get a response within one business day.</p>
        <Link to="/login" className="inline-block text-xs text-muted-foreground">Developer / Beta Login</Link>
      </aside>
    </div></Section>
  </>;
}
