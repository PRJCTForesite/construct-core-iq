import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DOCUMENT_PORTAL_CATEGORIES } from "@/content/client-portal";
import { Textarea } from "@/components/ui/textarea";
import { Choice } from "@/components/app/PermissionControls";
import {
  TASK_STATES,
  DOCUMENT_CATEGORIES,
  PROJECT_NAMES,
  type PlatformRecord,
} from "@/content/platform";
import { usePlatform } from "./PlatformProvider";
import { clampWeight, weightedProgress, canSignOff } from '@/content/workflow';
import { HealthBadge } from '@/components/app/WorkflowControls';
import { DefectPhoto } from '@/components/app/DefectPhoto';
import { Minus, Plus } from 'lucide-react';
export function RecordEditor() {
  const { editing, edit, save, records, can, role } = usePlatform();
  const [draft, setDraft] = useState<PlatformRecord | null>(null);
  useEffect(() => setDraft(editing), [editing]);
  if (!draft) return null;
  const module = {
    Task: "Tasks",
    Project: "Projects",
    Defect: "Defects",
    Document: "Documents",
    Communication: "Communications",
    Variation: "Financials",
    Client: "Clients",
    Trade: "Trades",
    Event: "Calendar",
  }[draft.kind];
  const update = (key: keyof PlatformRecord, value: string | number | boolean) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  const input = (key: keyof PlatformRecord, label: string, type = "text") => (
    <label className="grid gap-1.5 text-xs font-medium" key={key}>
      {label}
      <Input
        type={type}
        value={String(draft[key])}
        onChange={(e) => update(key, type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </label>
  );
  const statuses =
    draft.kind === "Task"
      ? TASK_STATES
      : draft.kind === "Defect"
        ? ["Reported", "Assigned", "In Progress", "Rectified", "Awaiting Approval", "Awaiting Inspection", "Awaiting Client Review", "Rejected", ...(canSignOff(role) ? ['Closed'] : [])]
        : draft.kind === "Variation"
          ? ["Draft", "Awaiting approval", "Approved", "Sent", "Overdue", "Paid"]
          : [
              "Active",
              "Pending",
              "Current",
              "Awaiting approval",
              "Completed",
              "Archived",
              "Read",
              "Unread",
            ];
  return (
    <Dialog open={Boolean(editing)} onOpenChange={(v) => !v && edit(null)}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {records.some((r) => r.id === draft.id) ? "Edit" : "New"} {draft.kind.toLowerCase()}
          </DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.title.trim()) return;
            if (!can(module, records.some((r) => r.id === draft.id) ? "Edit" : "Create")) {
              toast.error("Access restricted in this role preview");
              return;
            }
            save(draft);
            toast.success(`${draft.kind} saved in demonstration`);
          }}
        >
          {input("title", "Title / name")}
          {draft.kind === 'Defect' && <><DefectPhoto title={draft.title} className="h-40 rounded-lg"/><HealthBadge status={draft.status} severity={draft.category}/></>}
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-xs">
              Project
              <Choice
                label="Project"
                value={draft.project}
                options={[
                  ...new Set([
                    ...PROJECT_NAMES,
                    ...records.filter((r) => r.kind === "Project").map((r) => r.title),
                    draft.project,
                  ]),
                ]}
                onChange={(v) => update("project", v)}
              />
            </label>
            <label className="grid gap-1.5 text-xs">
              Status
              <Choice
                label="Status"
                value={draft.status}
                options={[...new Set([...statuses, draft.status])]}
                onChange={(v) => update("status", v)}
              />
            </label>
            {input("person", "Assigned party")}
            {input("date", "Date", "date")}
          </div>
          {draft.kind === "Task" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-2"><label className="grid gap-1.5 text-xs font-medium">Weight (%)<div className="flex gap-2"><Button type="button" variant="outline" size="icon" aria-label="Decrease weight" disabled={!can('Tasks','Edit')} onClick={()=>{const next={...draft,weight:clampWeight(draft.weight-1)};setDraft(next);if(records.some(r=>r.id===draft.id))save(next,true)}}><Minus/></Button><Input type="number" min={0} max={100} aria-label="Weight (%)" value={draft.weight} disabled={!can('Tasks','Edit')} onChange={e=>{const next={...draft,weight:clampWeight(Number(e.target.value))};setDraft(next);if(records.some(r=>r.id===draft.id))save(next,true)}}/><Button type="button" variant="outline" size="icon" aria-label="Increase weight" disabled={!can('Tasks','Edit')} onClick={()=>{const next={...draft,weight:clampWeight(draft.weight+1)};setDraft(next);if(records.some(r=>r.id===draft.id))save(next,true)}}><Plus/></Button></div></label><p className="text-xs text-muted-foreground">Project weighted progress: {weightedProgress([...records.filter(r=>r.kind==='Task'&&r.project===draft.project&&r.id!==draft.id),draft])}%</p></div>
              {input("progress", "Progress (%)", "number")}
              {input("dependencies", "Dependencies")}
              {input("responsible", "Responsible parties")}
              {input("notified", "Notified parties")}
            </div>
          )}
          {["Client", "Trade"].includes(draft.kind) && (
            <div className="grid grid-cols-2 gap-3">
              {input("email", "Email", "email")}
              {input("phone", "Phone")}
              {draft.kind === "Trade" && (
                <>
                  {input("category", "Trade type")}
                  {input("insurance", "Insurance expiry", "date")}
                  {input("licence", "Licence expiry", "date")}
                  {input("induction", "Induction")}
                </>
              )}
            </div>
          )}
          {["Variation", "Project"].includes(draft.kind) &&
            input("amount", "Amount (AUD)", "number")}
          {draft.kind === "Document" && (
            <>
              <Choice
                label="Category"
                value={draft.category}
                options={DOCUMENT_CATEGORIES}
                onChange={(v) => update("category", v)}
              />
              {input("revision", "Current revision")}
              {input("tags", "Tags")}
              <label className="flex items-center justify-between text-sm">
                Share With Client
                <Switch
                  aria-label="Share With Client"
                  checked={draft.shareWithClient === true}
                  onCheckedChange={(v) => update("shareWithClient", v)}
                />
              </label>
              {draft.shareWithClient && (
                <Choice
                  label="Client document category"
                  value={draft.portalCategory || "Drawings"}
                  options={DOCUMENT_PORTAL_CATEGORIES}
                  onChange={(v) => update("portalCategory", v)}
                />
              )}
            </>
          )}
          {draft.kind === "Event" && (
            <Choice
              label="Event type"
              value={draft.category}
              options={[
                "Meeting",
                "Inspection",
                "Task Due Date",
                "Trade Booking",
                "Delivery",
                "Permit Expiration",
              ]}
              onChange={(v) => update("category", v)}
            />
          )}
          <label className="grid gap-1.5 text-xs">
            Notes
            <Textarea value={draft.notes} onChange={(e) => update("notes", e.target.value)} />
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => edit(null)}>
              Cancel
            </Button>
            <Button
              disabled={!can(module, records.some((r) => r.id === draft.id) ? "Edit" : "Create")}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
