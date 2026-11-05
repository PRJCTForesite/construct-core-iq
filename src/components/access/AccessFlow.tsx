import { ArrowRight, Check, KeyRound, ScanFace, ShieldCheck, LayoutDashboard } from "lucide-react";
import { REGISTRATION_STEPS } from "@/content/access";

export function RegistrationFlow({ step }: { step: number }) {
  return <ol className="grid grid-cols-2 gap-4 border-y border-border py-6 md:grid-cols-4" aria-label="Registration progress">{REGISTRATION_STEPS.map((label, i) => <li key={label} aria-current={step === i ? "step" : undefined} className="flex items-center gap-3"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${i <= step ? "border-azure bg-azure text-azure-foreground" : "border-border bg-background text-muted-foreground"}`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</span><span className={`text-xs font-medium ${i > step ? "text-muted-foreground" : "text-foreground"}`}>{label}</span></li>)}</ol>;
}
export function RoleExperienceFlow() {
  const steps = [{ label: "Login", icon: KeyRound }, { label: "Role Detection", icon: ScanFace }, { label: "Permissions Validation", icon: ShieldCheck }, { label: "User Experience", icon: LayoutDashboard }];
  return <section className="mt-12 border-t border-border pt-10">
    <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-semibold">Role Based Experiences</h2><span className="rounded-sm bg-secondary px-2 py-1 text-xs text-muted-foreground">Future framework</span></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-4">{steps.map(({ label, icon: Icon }, i) => <div key={label} className="flex items-center gap-3"><Icon className="h-5 w-5 shrink-0 text-azure" /><span className="text-sm font-medium">{label}</span>{i < 3 && <ArrowRight className="ml-auto hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />}</div>)}</div>
    <div className="mt-7 grid gap-4 border-y border-border py-5 sm:grid-cols-3">{[["Owner", "Workspace Dashboard"], ["Client", "Client View"], ["Trade", "Trade View"]].map(([role, view]) => <div key={role} className="flex items-center gap-3 text-sm"><span className="font-semibold">{role}</span><ArrowRight className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">{view}</span></div>)}</div>
    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">In the future, users will be automatically directed to the most appropriate experience based on permissions. Role detection, permissions validation and Client / Trade redirection are not active in this prototype.</p>
  </section>;
}