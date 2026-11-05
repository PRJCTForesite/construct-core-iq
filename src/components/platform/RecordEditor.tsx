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
export function RecordEditor() {
  const { editing, edit, save, records, can } = usePlatform();
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
        ? ["Reported", "Assigned", "In Progress", "Rectified", "Awaiting Approval"]
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
              {input("weight", "Task weight", "number")}
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
