import { Button } from '@/components/ui/button';
import { Openable, HealthBadge, DocumentBrowser, ReadDetail } from '@/components/app/WorkflowControls';
import { DefectPhoto } from '@/components/app/DefectPhoto';
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeading, Panel, Pill, StatusPill, StatTile, Avatar, type Tone } from "@/components/app/primitives";
import {
  COMPLIANCE, FUTURE_COMPLIANCE_REQUESTS, PROJECT_FEED, REGISTRATION_MINIMUM, SCHEDULE, TASK_COLUMNS,
  TRADE_DEFECTS, TRADE_DOCS, TRADE_NOTIFICATIONS, TRADE_PROFILE, TRADE_TASKS, TRADE_TODAY, UPCOMING_WORKS,
  markDefectComplete, registrationReady, upcomingWithin, urgentActions, visibleTradeDocs,
  type TaskStatus, type TradeDefect, type TradeTask,
} from "@/content/trade-portal";

const TABS = ["Dashboard", "Tasks", "Defects", "Documents", "Schedule", "Profile & Compliance", "Future Modules"] as const;
type Tab = (typeof TABS)[number];

const PRIORITY_TONE: Record<string, Tone> = { High: "bad", Medium: "warn", Low: "muted" };
const DEFECT_TONE: Record<string, Tone> = { Open: "bad", "In Progress": "warn", "Awaiting Inspection": "info", "Awaiting Review": "accent", Closed: "good" };
const fmt = (d: string) => new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short" });

function Btn({ children, onClick, variant = "outline", className, disabled }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "outline" | "warn"; className?: string; disabled?: boolean }) {
  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
        variant === "primary" && "bg-azure text-primary-foreground hover:bg-azure/90",
        variant === "outline" && "border border-border bg-card text-foreground hover:bg-muted",
        variant === "warn" && "bg-construction text-primary-foreground hover:bg-construction/90",
        className,
      )}
    >
      {children}
    </Button>
  );
}

function Future({ label = "Future Module" }: { label?: string }) {
  return <Pill tone="accent">{label}</Pill>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col gap-1 text-[0.6875rem] font-medium text-muted-foreground">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-border bg-card px-2 py-1.5 text-xs text-foreground">
        <option value="All">All</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

export function TradePortal() {
  const [tab, setTab] = useState<Tab>("Dashboard");
  const [tasks, setTasks] = useState<TradeTask[]>(TRADE_TASKS);
  const [defects, setDefects] = useState<TradeDefect[]>(TRADE_DEFECTS);
  const urgent = urgentActions(tasks, defects);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <PageHeading
        title="Trade Portal"
        meta={`${TRADE_PROFILE.company} · Working for 3 builders across 3 projects`}
        actions={<Pill tone="info">Trade view · read-limited</Pill>}
      />
      <nav aria-label="Trade portal sections" className="flex flex-wrap gap-1 border-b border-border pb-px">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn("shrink-0 border-b-2 px-3 py-2 text-sm font-medium", tab === t ? "border-azure text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "Dashboard" && <Dashboard urgent={urgent} tasks={tasks} setTasks={setTasks} defects={defects} setDefects={setDefects} go={setTab} />}
      {tab === "Tasks" && <TasksBoard tasks={tasks} setTasks={setTasks} />}
      {tab === "Defects" && <DefectsPanel defects={defects} setDefects={setDefects} />}
      {tab === "Documents" && <Documents />}
      {tab === "Schedule" && <Schedule />}
      {tab === "Profile & Compliance" && <Profile />}
      {tab === "Future Modules" && <FutureModules />}
    </div>
  );
}

/* --------------------------------- Dashboard --------------------------------- */

function Dashboard({ urgent, tasks, setTasks, defects, setDefects, go }: {
  urgent: ReturnType<typeof urgentActions>; tasks: TradeTask[]; setTasks: (t: TradeTask[]) => void;
  defects: TradeDefect[]; setDefects: (d: TradeDefect[]) => void; go: (t: Tab) => void;
}) {
  const [feed, setFeed] = useState<(typeof PROJECT_FEED)[number]|null>(null);
  const [window, setWindow] = useState<7 | 14 | 30>(14);
  const [photos, setPhotos] = useState([
    { kind: "Progress", project: "Smith Residence", when: "Today" },
    { kind: "Defect", project: "Smith Residence", when: "Yesterday" },
    { kind: "Completion", project: "Parramatta Retail Hub", when: "2 days ago" },
  ]);
  const reviewDocs = 2;
  return (
    <div className="grid gap-5"><ReadDetail title={feed?.type??null} onClose={()=>setFeed(null)}><p className="text-sm">{feed?.project} · {feed?.who}</p><p>{feed?.text}</p></ReadDetail>
      <section aria-label="Urgent actions" className="rounded-xl border border-construction/40 bg-construction/5 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-[0.9375rem] font-semibold text-foreground">Urgent Actions</h2>
          <Pill tone="warn">Needs attention</Pill>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatTile label="Tasks due today" value={String(urgent.dueToday)} tone="warn" />
          <StatTile label="Tasks overdue" value={String(urgent.overdue)} tone="bad" />
          <StatTile label="Defects requiring action" value={String(urgent.defects)} tone="bad" />
          <StatTile label="Inspections requested" value={String(urgent.inspections)} tone="info" />
          <StatTile label="Documents to review" value={String(reviewDocs)} tone="warn" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="warn" onClick={() => go("Tasks")}>Open my tasks</Btn>
          <Btn variant="outline" onClick={() => go("Defects")}>Action defects</Btn>
          <Btn variant="outline" onClick={() => go("Documents")}>Review documents</Btn>
        </div>
      </section>

      <Panel title="Assigned Tasks" subtitle="Across every builder you work for">
        <TasksBoard tasks={tasks} setTasks={setTasks} compact />
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Defects Requiring Action" action={<button type="button" onClick={() => go("Defects")}>View all</button>}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["Open", "In Progress", "Awaiting Inspection", "Awaiting Review"] as const).map((s) => (
              <div key={s} className="rounded-lg border border-border p-3">
                <p className="text-[0.6875rem] text-muted-foreground">{s}</p>
                <p className="text-xl font-semibold tabular-nums">{defects.filter((d) => d.status === s).length}</p>
              </div>
            ))}
          </div>
          <ul className="mt-3 divide-y divide-border">
            {defects.filter((d) => d.status === "Open" || d.status === "In Progress").map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <span className="min-w-0 truncate">{d.title}{d.rejected && <span className="ml-2 text-xs text-destructive">Rejected</span>}</span>
                <Btn onClick={() => { setDefects(defects.map((x) => (x.id === d.id ? markDefectComplete(x) : x))); toast.success("Marked ready — builder notified"); }}>Mark ready</Btn>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Upcoming Works"
          action={
            <div role="group" aria-label="Upcoming window" className="flex gap-1">
              {([7, 14, 30] as const).map((w) => (
                <button key={w} type="button" onClick={() => setWindow(w)} className={cn("rounded px-2 py-0.5", window === w ? "bg-azure/10 text-azure" : "text-muted-foreground")}>
                  {w} days
                </button>
              ))}
            </div>
          }
        >
          <ul className="divide-y divide-border">
            {upcomingWithin(UPCOMING_WORKS, window).map((w) => (
              <li key={w.item} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 py-2 text-sm">
                <span className="min-w-0"><span className="block truncate font-medium">{w.item}</span><span className="text-xs text-muted-foreground">{w.project}</span></span>
                <span className="text-xs tabular-nums text-muted-foreground">{fmt(w.date)}</span>
              </li>
            ))}
            {upcomingWithin(UPCOMING_WORKS, window).length === 0 && <li className="py-2 text-sm text-muted-foreground">Nothing scheduled.</li>}
          </ul>
        </Panel>

        <Panel title="Project Feed" subtitle="Updates, mentions, site requests and documents">
          <ul className="space-y-3">
            {PROJECT_FEED.map((f) => (
              <li key={f.text}><Openable label={`Open ${f.type}: ${f.text}`} onOpen={()=>setFeed(f)} className="flex gap-3 text-sm">
                <Avatar initials={f.who.split(" ").map((p) => p[0]).join("").slice(0, 2)} />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground"><Pill tone={f.type === "Mention" ? "warn" : f.type === "Site Request" ? "bad" : "info"}>{f.type}</Pill> {f.project} · {f.when}</p>
                  <p className="mt-1 text-foreground">{f.text}</p>
                </div>
              </Openable></li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent Photos" action={<button type="button" onClick={() => { setPhotos([{ kind: "Site", project: "Smith Residence", when: "Just now" }, ...photos]); toast.success("Site photo uploaded"); }}>Upload photo</button>}>
          <div className="grid grid-cols-3 gap-2">
            {photos.slice(0, 6).map((p, i) => (
              <figure key={i} className="overflow-hidden rounded-lg border border-border">
                <div className="aspect-square bg-gradient-to-br from-muted to-secondary" />
                <figcaption className="p-1.5 text-[0.6875rem]"><span className="font-medium">{p.kind}</span><span className="block truncate text-muted-foreground">{p.project} · {p.when}</span></figcaption>
              </figure>
            ))}
          </div>
        </Panel>

        <WorkAssistant tasks={tasks} defects={defects} />

        <Panel title="Notifications">
          <ul className="space-y-1.5 text-sm">
            {TRADE_NOTIFICATIONS.map((n) => (
              <li key={n} className="flex items-center gap-2"><span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", n.startsWith("Overdue") || n.startsWith("Defect rejected") ? "bg-destructive" : "bg-azure")} />{n}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------ Work assistant ------------------------------ */

function WorkAssistant({ tasks, defects }: { tasks: TradeTask[]; defects: TradeDefect[] }) {
  const [answer, setAnswer] = useState("Ask about your own tasks, defects and shared drawings.");
  const prompts: Record<string, () => string> = {
    "Show My Tasks": () => tasks.filter((t) => t.status !== "Completed").map((t) => `${t.title} (${t.project})`).join("; "),
    "Show Open Defects": () => defects.filter((d) => d.status === "Open" || d.status === "In Progress").map((d) => d.title).join("; "),
    "Find Latest Drawing": () => { const d = visibleTradeDocs(TRADE_DOCS).filter((x) => x.category === "Drawings").sort((a, b) => b.updated.localeCompare(a.updated))[0]; return d ? `${d.name} ${d.revision} — ${d.project}` : "No shared drawings."; },
    "What Is Due This Week?": () => tasks.filter((t) => t.status !== "Completed" && t.due >= TRADE_TODAY && t.due <= "2025-06-23").map((t) => `${t.title} — ${fmt(t.due)}`).join("; "),
    "Show Upcoming Inspections": () => [...tasks.filter((t) => t.status === "Awaiting Inspection").map((t) => t.title), ...defects.filter((d) => d.status === "Awaiting Inspection").map((d) => d.title)].join("; "),
  };
  return (
    <Panel title="Work Assistant" subtitle="Only sees what your trade account can see" action={<Future label="Preview" />}>
      <div className="flex flex-wrap gap-1.5">
        {Object.keys(prompts).map((p) => <Btn key={p} onClick={() => setAnswer(prompts[p]?.() || "Nothing found.")}>{p}</Btn>)}
      </div>
      <p aria-live="polite" className="mt-3 rounded-lg bg-muted p-3 text-sm text-foreground">{answer}</p>
    </Panel>
  );
}

/* ---------------------------------- Tasks ---------------------------------- */

function TasksBoard({ tasks, setTasks, compact }: { tasks: TradeTask[]; setTasks: (t: TradeTask[]) => void; compact?: boolean }) {
  const [selected, setSelected] = useState<string|null>(null);
  const task = tasks.find(t=>t.id===selected);
  const [view, setView] = useState<"Kanban" | "List">("Kanban");
  const [f, setF] = useState({ employer: "All", project: "All", priority: "All", due: "All" });
  const uniq = (k: keyof TradeTask) => [...new Set(TRADE_TASKS.map((t) => String(t[k])))];
  const filtered = useMemo(() => tasks.filter((t) =>
    (f.employer === "All" || t.employer === f.employer) &&
    (f.project === "All" || t.project === f.project) &&
    (f.priority === "All" || t.priority === f.priority) &&
    (f.due === "All" || (f.due === "Overdue" ? t.due < TRADE_TODAY && t.status !== "Completed" : f.due === "Today" ? t.due === TRADE_TODAY : t.due <= "2025-06-23"))), [tasks, f]);
  const move = (id: string, status: TaskStatus) => setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  const body = (
    <div className="grid gap-4"><ReadDetail title={task?.title??null} onClose={()=>setSelected(null)}>{task&&<><p className="text-sm">{task.project} · {task.employer} · Due {fmt(task.due)}</p><HealthBadge status={task.due<TRADE_TODAY&&task.status!=='Completed'?'Delayed':task.status}/><p className="text-sm">Workers: {task.workers.join(', ')}</p><StatusSelect task={task} move={move}/></>}</ReadDetail>
      <div className="flex flex-wrap items-end gap-3">
        <Select label="Employer" value={f.employer} onChange={(v) => setF({ ...f, employer: v })} options={uniq("employer")} />
        <Select label="Project" value={f.project} onChange={(v) => setF({ ...f, project: v })} options={uniq("project")} />
        <Select label="Priority" value={f.priority} onChange={(v) => setF({ ...f, priority: v })} options={["High", "Medium", "Low"]} />
        <Select label="Due date" value={f.due} onChange={(v) => setF({ ...f, due: v })} options={["Overdue", "Today", "This week"]} />
        <div role="group" aria-label="Task view" className="ml-auto hidden rounded-md border border-border p-0.5 md:flex">
          {(["Kanban", "List"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={cn("rounded px-3 py-1 text-xs font-medium", view === v ? "bg-azure text-primary-foreground" : "text-muted-foreground")}>{v}</button>
          ))}
        </div>
      </div>
      {/* Mobile always list; desktop follows toggle (default Kanban) */}
      <div className={cn(view === "Kanban" ? "md:hidden" : "")}><TaskList tasks={filtered} move={move} open={setSelected} /></div>
      {view === "Kanban" && (
        <div className="hidden gap-3 md:grid md:grid-cols-3 xl:grid-cols-5">
          {TASK_COLUMNS.map((col) => (
            <div key={col} className="min-w-0 rounded-lg bg-muted/60 p-2">
              <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">{col} · {filtered.filter((t) => t.status === col).length}</p>
              <div className="space-y-2">
                {filtered.filter((t) => t.status === col).map((t) => (
                  <Openable key={t.id} label={`Open ${t.title}`} onOpen={()=>setSelected(t.id)} className="rounded-md border border-border bg-card p-2.5 text-xs shadow-panel">
                    <p className="font-medium text-foreground">{t.title}</p>
                    <p className="mt-1 text-muted-foreground">{t.project} · {t.employer}</p>
                    <div className="mt-2 flex items-center justify-between gap-1">
                      <Pill tone={PRIORITY_TONE[t.priority] ?? "muted"}>{t.priority}</Pill>
                      <span className={cn("tabular-nums", t.due < TRADE_TODAY && t.status !== "Completed" ? "text-destructive" : "text-muted-foreground")}>{fmt(t.due)}</span>
                    </div>
                    <HealthBadge status={t.due<TRADE_TODAY&&t.status!=='Completed'?'Delayed':t.status}/><StatusSelect task={t} move={move}/><TaskActions task={t} move={move} open={()=>setSelected(t.id)}/>
                  </Openable>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  return compact ? body : <Panel title="Assigned Tasks" subtitle="Kanban on desktop, list on mobile">{body}</Panel>;
}

function StatusSelect({ task, move }: { task: TradeTask; move: (id: string, s: TaskStatus) => void }) {
  return (
    <select aria-label={`Status for ${task.title}`} value={task.status} onChange={(e) => move(task.id, e.target.value as TaskStatus)} className="mt-2 w-full rounded border border-border bg-card px-1.5 py-1 text-[0.6875rem]">
      {TASK_COLUMNS.map((c) => <option key={c}>{c}</option>)}
    </select>
  );
}

function TaskActions({task,move,open}:{task:TradeTask;move:(id:string,s:TaskStatus)=>void;open:()=>void}) {return <div className="mt-2 flex flex-wrap gap-1.5"><Btn onClick={open}>View details</Btn>{task.status!=='Completed'&&<><Btn onClick={()=>move(task.id,'In Progress')}>Start work</Btn><Btn onClick={()=>move(task.id,'Awaiting Sign Off')}>Ready for review</Btn><Btn onClick={()=>move(task.id,'Awaiting Inspection')}>Request inspection</Btn></>}</div>}
function TaskList({tasks,move,open}:{tasks:TradeTask[];move:(id:string,s:TaskStatus)=>void;open:(id:string)=>void}) {return <div className="grid gap-3">{tasks.map(t=><Openable key={t.id} label={`Open ${t.title}`} onOpen={()=>open(t.id)} className="rounded-lg border border-border bg-card p-3"><h3 className="text-sm font-semibold">{t.title}</h3><p className="mt-1 text-xs text-muted-foreground">{t.project} · {t.employer} · Due {fmt(t.due)}</p><div className="mt-2"><HealthBadge status={t.due<TRADE_TODAY&&t.status!=='Completed'?'Delayed':t.status}/></div><StatusSelect task={t} move={move}/><TaskActions task={t} move={move} open={()=>open(t.id)}/></Openable>)}</div>}

/* --------------------------------- Defects --------------------------------- */

function DefectsPanel({ defects, setDefects }: { defects: TradeDefect[]; setDefects: (d: TradeDefect[]) => void }) {
  const [selected,setSelected] = useState<string|null>(null);
  const defect=defects.find(d=>d.id===selected);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const update = (id: string, fn: (d: TradeDefect) => TradeDefect) => setDefects(defects.map((d) => (d.id === id ? fn(d) : d)));
  return (
    <div className="grid gap-4"><ReadDetail title={defect?.title??null} onClose={()=>setSelected(null)}>{defect&&<><DefectPhoto title={defect.title} className="h-48 rounded-lg"/><HealthBadge status={defect.rejected?'Rejected':defect.status}/><p>{defect.project} · {defect.location}</p><p className="text-sm">{defect.notes.join(' · ')||'No rectification notes yet.'}</p><Btn onClick={()=>update(defect.id,markDefectComplete)}>Mark ready for review</Btn></>}</ReadDetail>
      <p className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
        Trades can upload photos and rectification notes, request inspection and mark defects ready for review. Only project-authorised users can close defects. The builder's “Request Inspection On Completion” setting is followed automatically.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {defects.map((d) => (
          <Openable key={d.id} label={`Open ${d.title}`} onOpen={()=>setSelected(d.id)} className=""><Panel title={d.title} subtitle={`${d.project} · ${d.location}`} action={<StatusPill tone={DEFECT_TONE[d.status] ?? "muted"}>{d.status}</StatusPill>}>
            <DefectPhoto title={d.title} className="mb-3 h-32 rounded"/><HealthBadge status={d.rejected?'Rejected':d.status}/>
            {d.rejected && <p className="mb-2 text-xs font-medium text-destructive">Rejected by builder — further rectification required.</p>}
            <p className="text-xs text-muted-foreground">Inspection on completion: <strong className="text-foreground">{d.requestInspectionOnCompletion ? "Yes" : "No"}</strong> · Photos: {d.photos}</p>
            {d.notes.length > 0 && <ul className="mt-2 list-disc pl-4 text-xs">{d.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>}
            <label className="mt-3 block text-xs font-medium text-muted-foreground">Rectification note
              <textarea value={notes[d.id] ?? ""} onChange={(e) => setNotes({ ...notes, [d.id]: e.target.value })} rows={2} className="mt-1 w-full rounded-md border border-border bg-card p-2 text-sm text-foreground" />
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              <Btn onClick={() => { update(d.id, (x) => ({ ...x, photos: x.photos + 1 })); toast.success("Photo uploaded"); }}>Upload photo</Btn>
              <Btn disabled={!notes[d.id]} onClick={() => { if (!notes[d.id]?.trim()) return; update(d.id, (x) => ({ ...x, notes: [...x.notes, notes[d.id] ?? ""], status: x.status === "Open" ? "In Progress" : x.status })); setNotes({ ...notes, [d.id]: "" }); }}>Add note</Btn>
              {d.requestInspectionOnCompletion && d.status !== "Awaiting Inspection" && d.status !== "Closed" && (
                <Btn onClick={() => { update(d.id, (x) => ({ ...x, status: "Awaiting Inspection", rejected: false })); toast.success("Inspection requested"); }}>Request inspection</Btn>
              )}
              {(d.status === "Open" || d.status === "In Progress") && (
                <Btn variant="primary" onClick={() => { update(d.id, markDefectComplete); toast.success("Marked ready for review"); }}>Mark ready for review</Btn>
              )}
              <button type="button" disabled title="Only project-authorised users can close defects" className="cursor-not-allowed rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground">Close defect (builder only)</button>
            </div>
          </Panel></Openable>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Documents -------------------------------- */

function Documents() {
  const [selected,setSelected] = useState<string|null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const docs = visibleTradeDocs(TRADE_DOCS, q).filter((d) => cat === "All" || d.category === cat);
  return (
    <Panel title="Documents & Drawings" subtitle="Only documents your builders have shared with you">
      <div className="mb-3 flex flex-wrap gap-2">
        <input aria-label="Search documents" placeholder="Search documents…" value={q} onChange={(e) => setQ(e.target.value)} className="min-w-48 flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm" />
        {["All", "Drawings", "Specifications", "SWMS", "Site Instructions", "Project Photos"].map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} className={cn("rounded-full px-3 py-1 text-xs", cat === c ? "bg-azure text-primary-foreground" : "bg-muted text-muted-foreground")}>{c}</button>
        ))}
      </div>
      <DocumentBrowser items={docs.map(d=>({id:d.id,title:d.name,category:d.category,date:d.updated,owner:'Builder'}))} onOpen={setSelected}/><ReadDetail title={docs.find(d=>d.id===selected)?.name??null} onClose={()=>setSelected(null)}><p className="text-sm">{docs.find(d=>d.id===selected)?.project} · {docs.find(d=>d.id===selected)?.revision}</p><p className="text-xs text-muted-foreground">Shared document record · file viewing is not connected.</p></ReadDetail>
    </Panel>
  );
}

/* --------------------------------- Schedule -------------------------------- */

function Schedule() {
  const block = (title: string, rows: { a: string; b: string; date: string }[]) => (
    <Panel title={title}>
      <ul className="divide-y divide-border">
        {rows.map((r) => <li key={r.a + r.date} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 py-2 text-sm"><span className="min-w-0"><span className="block font-medium">{r.a}</span>{r.b && <span className="text-xs text-muted-foreground">{r.b}</span>}</span><span className="text-xs tabular-nums text-muted-foreground">{fmt(r.date)}</span></li>)}
      </ul>
    </Panel>
  );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {block("Current Activity", SCHEDULE.current.map((s) => ({ a: s.activity, b: `${s.project} · ends`, date: s.ends })))}
      {block("Upcoming Activity", SCHEDULE.upcoming.map((s) => ({ a: s.activity, b: `${s.project} · starts`, date: s.starts })))}
      {block("Critical Dates", SCHEDULE.critical.map((s) => ({ a: s.label, b: "", date: s.date })))}
      {block("Required Completion Dates", SCHEDULE.completion.map((s) => ({ a: s.label, b: "", date: s.date })))}
      <p className="text-xs text-muted-foreground md:col-span-2">Simplified programme only — full builder schedules are not shared with trades.</p>
    </div>
  );
}

/* ------------------------------ Profile & compliance ------------------------------ */

const COMPLIANCE_TONE: Record<string, Tone> = { Verified: "good", Expiring: "warn", Missing: "bad", Requested: "info" };

function Profile() {
  const [items, setItems] = useState(COMPLIANCE);
  const [custom, setCustom] = useState("");
  const reg = registrationReady(items);
  const compliant = items.filter((i) => i.status === "Verified").length;
  const fields: [string, string][] = [
    ["Company Name", TRADE_PROFILE.company], ["ABN", TRADE_PROFILE.abn], ["Licence Number", TRADE_PROFILE.licence],
    ["Trade Category", TRADE_PROFILE.category], ["Service Area", TRADE_PROFILE.serviceArea], ["Contact Details", TRADE_PROFILE.contact],
    ["Website", TRADE_PROFILE.website], ["Insurance Status", TRADE_PROFILE.insurance],
    ["Compliance Status", `${compliant}/${items.length} verified`],
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Trade Company Profile" subtitle="Supports individual trades and trade businesses">
        <dl className="grid gap-3 sm:grid-cols-2">
          {fields.map(([k, v]) => <div key={k}><dt className="text-[0.6875rem] text-muted-foreground">{k}</dt><dd className="text-sm font-medium text-foreground">{v}</dd></div>)}
        </dl>
      </Panel>
      <Panel title="Compliance" subtitle={`Registration minimum: ${REGISTRATION_MINIMUM.join(", ")}`} action={<StatusPill tone={reg.ready ? "good" : "bad"}>{reg.ready ? "Registration ready" : `Missing ${reg.missing.join(", ")}`}</StatusPill>}>
        <ul className="divide-y divide-border">
          {items.map((i) => (
            <li key={i.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2 text-sm">
              <span className="min-w-0"><span className="font-medium">{i.name}</span>{i.required && <span className="ml-1.5 text-[0.6875rem] text-construction">Required</span>}{i.expiry && <span className="block text-xs text-muted-foreground">Expires {fmt(i.expiry)}</span>}</span>
              <span className="flex items-center gap-2">
                <StatusPill tone={COMPLIANCE_TONE[i.status] ?? "muted"}>{i.status}</StatusPill>
                {i.status !== "Verified" && <Btn onClick={() => { setItems(items.map((x) => (x.id === i.id ? { ...x, status: "Verified" } : x))); toast.success(`${i.name} uploaded`); }}>Upload</Btn>}
              </span>
            </li>
          ))}
        </ul>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!custom.trim()) return; setItems([...items, { id: `x${items.length}`, name: custom.trim(), status: "Missing", required: false }]); setCustom(""); }}>
          <input aria-label="Custom requirement" placeholder="Other custom requirement" value={custom} onChange={(e) => setCustom(e.target.value)} className="flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm" />
          <button type="submit" className="rounded-md bg-azure px-3 text-xs font-medium text-primary-foreground">Add</button>
        </form>
      </Panel>
      <Panel title="Additional Compliance Requests" subtitle="Builders will request these in a future release" action={<Future label="Planned Functionality" />} className="lg:col-span-2">
        <div className="flex flex-wrap gap-2">{FUTURE_COMPLIANCE_REQUESTS.map((r) => <span key={r} className="rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground">{r}</span>)}</div>
      </Panel>
    </div>
  );
}

/* ------------------------------ Future modules ------------------------------ */

function FutureModules() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Trade Directory" subtitle="Builders search registered trades on Foresite" action={<Future label="Coming Soon" />} className="lg:col-span-2">
        <div className="mb-3 flex flex-wrap gap-2">{["Trade Type", "Location", "Licences", "Tickets", "Insurance Status", "Availability", "Previous Projects"].map((f) => <span key={f} className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">{f} ▾</span>)}</div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[["ABC Electrical", "Electrical · Sydney"], ["XYZ Plumbing", "Plumbing · Central Coast"], ["Elite Painting", "Painting · Sydney"]].map(([n, m]) => (
            <div key={n} className="rounded-lg border border-dashed border-border p-3 opacity-80"><p className="text-sm font-semibold">{n}</p><p className="text-xs text-muted-foreground">{m}</p><p className="mt-2 text-[0.6875rem] text-muted-foreground">Insured · Licensed · Available</p></div>
          ))}
        </div>
      </Panel>
      <Panel title="Trade Variations" subtitle="Suggest Variation" action={<Future />}>
        <p className="text-xs text-muted-foreground">Examples: additional excavation, unexpected conditions, extra work required.</p>
        <ol className="mt-3 flex flex-wrap items-center gap-2 text-xs">{["Trade Suggests", "Builder Reviews", "Client Reviews", "Approved / Rejected"].map((s, i) => <li key={s} className="flex items-center gap-2">{i > 0 && <span aria-hidden="true">→</span>}<span className="rounded-md bg-muted px-2 py-1">{s}</span></li>)}</ol>
      </Panel>
      <Panel title="Progress Claims" action={<Future label="Future Functionality" />}>
        <div className="flex flex-wrap gap-2">{["Progress Claims", "Payment Claims", "Invoices", "Completion Claims"].map((s) => <span key={s} className="rounded-md border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground">{s}</span>)}</div>
        <p className="mt-3 rounded bg-muted p-2 font-mono text-[0.6875rem] text-muted-foreground">Dev note: Placeholder only. Future backend functionality required.</p>
      </Panel>
      <Panel title="Workforce Management" subtitle="Trade businesses manage their own staff" action={<Future label="Planned Functionality" />} className="lg:col-span-2">
        <div className="grid gap-3 sm:grid-cols-4">
          {[["Owner", "Company settings, compliance, billing"], ["Supervisor", "Allocate crews and review work"], ["Tradesperson", "Complete assigned tasks and defects"], ["Apprentice", "Supervised task access"]].map(([r, d]) => (
            <div key={r} className="rounded-lg border border-dashed border-border p-3"><p className="text-sm font-semibold">{r}</p><p className="mt-1 text-xs text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
