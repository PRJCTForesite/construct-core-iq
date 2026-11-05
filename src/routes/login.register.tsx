import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegistrationFlow } from "@/components/access/AccessFlow";
import { validateDemoLogin, validateOrganisationCode } from "@/content/access";
import { startDemoSession } from "@/lib/session";
export const Route = createFileRoute("/login/register")({
  head: () => ({ meta: [{ title: "Create Account — Foresite Controlled Registration" }, { name: "description", content: "Preview Foresite controlled registration with organisation code verification for one unified account." }, { property: "og:title", content: "Create your Foresite account" }, { property: "og:description", content: "Organisation-code registration for the unified Foresite ecosystem. Stage 1 prototype." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] }), component: RegisterPage,
});
function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [org, setOrg] = useState(""); const [code, setCode] = useState(""); const [error, setError] = useState<string | null>(null);
  function submit(e: FormEvent) {
    e.preventDefault();
    const issue = step === 1 ? (!name.trim() || !org.trim() ? "Enter your name and organisation." : validateDemoLogin(email, password)) : validateOrganisationCode(code);
    setError(issue); if (issue) return;
    setStep(step + 1); setPassword("");
  }
  return <><Button asChild variant="ghost" size="sm" className="mb-6 -ml-3"><Link to="/login"><ArrowLeft /> Back to sign in</Link></Button><p className="text-xs font-semibold uppercase tracking-widest text-azure">Controlled registration</p><h1 className="mt-3 text-3xl font-semibold">Create your Foresite account</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">One account for every organisation you work with. Organisation Codes help reduce spam and maintain project security.</p><div className="mt-8"><RegistrationFlow step={step} /></div>
    <section className="mx-auto max-w-lg py-10">
      {step === 0 && <><ShieldCheck className="h-10 w-10 text-azure" /><h2 className="mt-5 text-xl font-semibold">Access starts with an invitation</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">You can create an account independently. Before activation, you’ll need an Organisation Code supplied by an existing paid subscriber or Foresite Administration.</p><p className="mt-4 text-xs text-muted-foreground">This is a UI-only preview. No account will be created.</p><Button className="mt-6 bg-azure text-azure-foreground hover:bg-azure/90" onClick={() => setStep(1)}>Enter Details <ArrowRight /></Button></>}
      {(step === 1 || step === 2) && <form onSubmit={submit} noValidate className="space-y-5"><h2 className="text-xl font-semibold">{step === 1 ? "Enter your details" : "Organisation Verification"}</h2>
        {step === 1 ? <>{[{id:"name", label:"Full name",value:name,set:setName,type:"text",auto:"name"},{id:"register-email",label:"Email",value:email,set:setEmail,type:"email",auto:"email"},{id:"register-password",label:"Password",value:password,set:setPassword,type:"password",auto:"new-password"},{id:"organisation",label:"Organisation",value:org,set:setOrg,type:"text",auto:"organization"}].map(field => <div key={field.id} className="space-y-2"><Label htmlFor={field.id}>{field.label}</Label><Input id={field.id} type={field.type} autoComplete={field.auto} value={field.value} onChange={e => field.set(e.target.value)} /></div>)}</> : <><p className="text-sm text-muted-foreground">{name} · {org}</p><div className="space-y-2"><Label htmlFor="organisation-code">Organisation Code</Label><Input id="organisation-code" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter your organisation code" /></div><p className="text-xs leading-relaxed text-muted-foreground">In this preview, any non-empty code demonstrates the workflow. Codes are not checked against an organisation and do not grant real access.</p></>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-between gap-3"><Button type="button" variant="outline" onClick={() => { setStep(step - 1); setError(null); }}>Back</Button><Button type="submit" className="bg-azure text-azure-foreground hover:bg-azure/90">{step === 1 ? "Continue" : "Preview Verification"} <ArrowRight /></Button></div>
      </form>}
      {step === 3 && <><CheckCircle2 className="h-12 w-12 text-azure" /><h2 className="mt-5 text-2xl font-semibold">Access Granted</h2><p className="mt-3 text-sm text-muted-foreground">Registration workflow complete — prototype only.</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">No account has been created, your Organisation Code has not been verified, and no real permissions have been assigned.</p><Button className="mt-6 bg-azure text-azure-foreground hover:bg-azure/90" onClick={() => { startDemoSession(email, false); void navigate({ to: "/login/workspaces" }); }}>Preview My Workspaces <ArrowRight /></Button></>}
    </section></>;
}