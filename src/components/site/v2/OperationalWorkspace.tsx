import { Activity, ArrowUpRight, CheckCircle2, ChevronDown, ClipboardCheck, HardHat, LayoutDashboard, ShieldCheck } from "lucide-react";
import projectPhoto from "@/assets/client-home-progress.jpg";

export function OperationalWorkspace() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-[var(--shadow-raised)]" aria-label="Foresite operational workspace preview">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold"><LayoutDashboard className="size-4 text-azure" /> Foresite <span className="hidden font-normal text-muted-foreground sm:inline">/ Project overview</span></div>
        <span className="text-xs text-muted-foreground">Sample workspace</span>
      </div>
      <div className="grid md:grid-cols-[180px_1fr]">
        <aside className="hidden border-r border-border bg-surface p-4 md:block" aria-label="Preview navigation">
          <p className="flex items-center justify-between text-xs font-semibold">Builder workspace <ChevronDown className="size-3" /></p>
          <div className="mt-5 space-y-2 text-xs">
            <p className="flex items-center gap-2 rounded-md bg-azure/10 px-3 py-2 font-semibold text-azure"><LayoutDashboard className="size-4" />Overview</p>
            {[{ label: "Trade activity", icon: HardHat }, { label: "Defects & evidence", icon: ShieldCheck }, { label: "Client approvals", icon: ClipboardCheck }, { label: "Project health", icon: Activity }].map(({ label, icon: Icon }) => <p key={label} className="flex items-center gap-2 px-3 py-2 text-muted-foreground"><Icon className="size-4" />{label}</p>)}
          </div>
        </aside>
        <div className="p-3 text-left sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div><h2 className="text-sm font-semibold sm:text-lg">Smith Residence</h2><p className="hidden text-xs text-muted-foreground sm:block">Melbourne, VIC · Lock-up stage</p></div>
            <span className="flex items-center gap-1 text-xs font-medium text-health-good"><CheckCircle2 className="size-3.5" />On track</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
            {[
              { label: "Project Health", value: "82", suffix: "/100", detail: "Delivery on track", tone: "text-health-good", icon: Activity },
              { label: "Open Defects", value: "6", suffix: "", detail: "2 ready for inspection", tone: "text-construction", icon: ShieldCheck },
              { label: "Outstanding Approvals", value: "3", suffix: "", detail: "1 decision due today", tone: "text-azure", icon: ClipboardCheck },
            ].map(({ label, value, suffix, detail, tone, icon: Icon }) => (
              <div key={label} className="rounded-md border border-border bg-card p-2 sm:p-3">
                <div className="flex items-start justify-between gap-1"><p className="text-[10px] font-medium leading-tight text-muted-foreground sm:text-xs">{label}</p><Icon className={`hidden size-4 shrink-0 sm:block ${tone}`} /></div>
                <p className={`mt-2 text-xl font-semibold sm:text-2xl ${tone}`}>{value}<span className="text-xs font-normal text-muted-foreground">{suffix}</span></p>
                <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">{detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-[1.25fr_1fr]">
            <div>
              <h3 className="flex items-center gap-2 text-xs font-semibold"><HardHat className="size-4 text-azure" />Trade Activity</h3>
              <ul className="mt-2 divide-y divide-border text-xs">
                <li className="flex justify-between gap-2 py-2"><span>Electrical rough-in <span className="hidden text-muted-foreground lg:inline">· Apex Electrical</span></span><span className="shrink-0 text-health-good">Complete</span></li>
                <li className="flex justify-between gap-2 py-2"><span>Plasterboard installation</span><span className="shrink-0 text-azure">In progress</span></li>
                <li className="hidden justify-between gap-2 py-2 sm:flex"><span>Waterproofing inspection</span><span className="text-muted-foreground">Tomorrow</span></li>
              </ul>
            </div>
            <div>
              <img src={projectPhoto} alt="Smith Residence at lock-up with roofing, windows and brickwork completed" className="mb-2 hidden h-20 w-full rounded-md object-cover sm:block" />
              <div className="flex items-center justify-between text-xs"><h3 className="font-semibold">Project Progress</h3><span className="font-semibold text-azure">64%</span></div>
              <div role="progressbar" aria-label="Project progress" aria-valuenow={64} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[64%] bg-azure" /></div>
              <p className="mt-2 hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">Next milestone: internal fit-out <ArrowUpRight className="size-3" /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}