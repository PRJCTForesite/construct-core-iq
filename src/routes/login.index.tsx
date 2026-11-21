import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { Apple, ArrowRight, Building2, Check, Eye, Grid2X2, HardHat, KeyRound, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ACCESS_VIEWS, validateDemoLogin } from "@/content/access";
import { accessService } from "@/lib/services/accessService";
import { TeamQuickAccess } from "@/components/access/TeamAccess";

export const Route = createFileRoute("/login/")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "One account, every experience — Foresite Sign In" }, { name: "description", content: "Unified Foresite account access for owners, clients and trades. One platform, one login and permission-based experiences." }, { property: "og:title", content: "Foresite — Unified Account Access" }, { property: "og:description", content: "Sign in to one Foresite account for Owner, Client and Trade experiences." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});
function LoginPage() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [email, setEmail] = useState("james@hartleyconstruction.com.au");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forgot, setForgot] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const issue = validateDemoLogin(email, password);
    setError(issue);
    if (issue) return;
    window.sessionStorage.removeItem("foresite.beta-preview");
    window.sessionStorage.removeItem("foresite.onboarding-preview");
    setSubmitting(true);
    try {
      await accessService.signInWithPassword({ email: email.trim(), password, remember });
      setPassword("");
      await navigate({ to: "/login/workspaces" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in could not be completed. Please try again.");
    } finally { setSubmitting(false); }
  }
  return <>
    <TeamQuickAccess />
    <div className="mb-8 text-center"><p className="text-xs font-semibold uppercase tracking-widest text-azure">One platform. One login.</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Your Foresite account</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Owners, clients and trades. One account, multiple permission-based experiences.</p></div>
    <div className="grid gap-4 md:grid-cols-3">{ACCESS_VIEWS.map((view, i) => {
      const Icon = [Building2, Eye, HardHat][i] ?? Building2;
      return <article key={view.id} className={`flex flex-col rounded-lg border bg-card p-6 transition-colors ${selected === view.title ? "border-azure ring-1 ring-azure" : "border-border"}`}>
        <div className="flex items-center justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-md ${i === 2 ? "bg-construction/10 text-construction" : "bg-azure/10 text-azure"}`}><Icon className="h-5 w-5" /></span>{selected === view.title && <Check aria-label="Selected experience" className="h-5 w-5 text-azure" />}</div>
        <h2 className="mt-4 text-lg font-semibold">{view.title}</h2><p className="mt-2 min-h-16 text-sm leading-relaxed text-muted-foreground">{view.description}</p>
        <ul className="my-5 grid flex-1 content-start grid-cols-2 gap-x-2 gap-y-2.5">{view.features.map(feature => <li key={feature} className="flex items-start gap-1.5 text-xs"><Check className="mt-0.5 h-3 w-3 shrink-0 text-azure" />{feature}</li>)}</ul>
        <Button variant="outline" className="w-full" aria-label={`Continue with ${view.title}`} onClick={() => { setSelected(view.title); emailRef.current?.focus({ preventScroll: true }); emailRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" }); }}>Continue <ArrowRight /></Button>
      </article>;
    })}</div>
    <p className="mt-4 text-center text-xs text-muted-foreground">All three views use the same sign-in. Access is determined by your permissions, not the card you select.</p>
    <section id="shared-sign-in" className="mt-10 grid gap-8 border-t border-border pt-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div><span className="flex h-10 w-10 items-center justify-center rounded-md bg-azure/10 text-azure"><KeyRound className="h-5 w-5" /></span><h2 className="mt-4 text-2xl font-semibold">Sign in to Foresite</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">One account connects you to your organisation and the projects you’re part of.</p><div className="mt-6 border-l-2 border-azure pl-4"><p className="text-sm font-medium">New to Foresite?</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Start a new subscription without a code, or join your builder through an invitation.</p><Button asChild variant="link" className="mt-2 h-auto px-0 text-azure"><Link to="/login/register">Create Account <ArrowRight /></Link></Button></div><p className="mt-6 text-xs leading-relaxed text-muted-foreground">Demo access only. Use any valid email and a password of at least 4 characters. No credentials are verified or sent.</p></div>
      <div className="min-w-0"><form onSubmit={submit} className="space-y-4" noValidate><p className="text-xs font-medium text-muted-foreground" aria-live="polite">{selected ? `${selected} · Shared account sign-in` : "Shared account sign-in"}</p>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input ref={emailRef} id="email" type="email" autoComplete="username" className="h-10 pl-9" value={email} onChange={e => setEmail(e.target.value)} /></div></div>
        <div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="password" type="password" autoComplete="current-password" className="h-10 pl-9" value={password} onChange={e => setPassword(e.target.value)} /></div></div>
        <div className="flex items-center justify-between gap-2"><label className="flex items-center gap-2 text-sm"><Checkbox checked={remember} onCheckedChange={v => setRemember(v === true)} />Remember Me</label><Button type="button" variant="link" className="h-auto px-0 text-azure" onClick={() => setForgot(true)}>Forgot Password</Button></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={submitting} className="h-10 w-full bg-azure text-azure-foreground hover:bg-azure/90">{submitting ? "Signing in…" : "Sign In"} <ArrowRight /></Button>
      </form><div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">Connected sign-in · Coming soon</span><span className="h-px flex-1 bg-border" /></div><div className="grid gap-2">{[{name:"Microsoft", icon:Grid2X2}, {name:"Google", icon:null}, {name:"Apple", icon:Apple}].map(({name,icon:Icon}) => <Button key={name} disabled variant="outline" className="h-10 w-full">{Icon ? <Icon /> : <span aria-hidden="true" className="font-semibold">G</span>}Sign in with {name}</Button>)}</div></div>
    </section>
    <Dialog open={forgot} onOpenChange={setForgot}><DialogContent><DialogTitle>Password recovery</DialogTitle><DialogDescription>Password recovery will be available when live authentication is connected. This prototype does not store or verify passwords and cannot send reset emails.</DialogDescription><Button onClick={() => setForgot(false)}>Back to sign in</Button></DialogContent></Dialog>
  </>;
}