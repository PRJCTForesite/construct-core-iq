import { LiveRegister } from "@/components/platform/ModuleFrame";
import { createFileRoute } from "@tanstack/react-router";
import { Paperclip, Phone, Reply, Sparkles } from "lucide-react";

import { Avatar, DOT_TONE, PageHeading, Panel, Pill } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { ACTIVE_THREAD, INBOX_THREADS } from "@/content/app";

export const Route = createFileRoute("/app/communications")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Communications \u2014 Foresite OS" },
      { property: "og:description", content: "Unified inbox for email, SMS and calls with AI summaries and extracted actions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Communications — Foresite OS" },
      { name: "description", content: "Unified inbox for email, SMS and calls with AI summaries and extracted actions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommunicationsPage,
});

const GROUPS = ["Today", "Yesterday"];

function CommunicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Communications"
        meta="Email · SMS · Calls · Internal — 7 unread"
        actions={
          <Button size="sm" className="bg-azure text-azure-foreground hover:bg-azure/90">
            <Reply className="h-4 w-4" /> Compose
          </Button>
        }
      />
      <LiveRegister kind="Communication" title="RFIs, site instructions & messages" module="Communications" detail={r=>`${r.category} · ${r.person}`} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)_minmax(0,0.8fr)]">
        <Panel title="Inbox" bodyClassName="p-0 sm:p-0" className="max-h-[42rem] overflow-y-auto">
          {GROUPS.map((group) => (
            <div key={group}>
              <p className="border-b border-border bg-surface px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                {group}
              </p>
              <ul className="divide-y divide-border">
                {INBOX_THREADS.filter((thread) => thread.group === group).map((thread) => (
                  <li key={thread.id}>
                    <button
                      className={`w-full px-4 py-3 text-left transition-colors hover:bg-surface ${
                        thread.id === "sarah-tile" ? "border-l-2 border-azure bg-azure/[0.04]" : ""
                      }`}
                    >
                      <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                        <span
                          className={`truncate text-sm ${thread.unread ? "font-semibold text-foreground" : "font-medium text-secondary-foreground"}`}
                        >
                          {thread.name}
                        </span>
                        <span className="shrink-0 text-[0.6875rem] text-muted-foreground">{thread.time}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{thread.project}</span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">{thread.preview}</span>
                      <span className="mt-2 block">
                        <Pill tone={thread.channel === "Missed Call" ? "bad" : thread.channel === "SMS" ? "good" : "info"}>
                          {thread.channel}
                        </Pill>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Panel>

        <div className="space-y-4">
          <Panel title={ACTIVE_THREAD.subject} subtitle={`${ACTIVE_THREAD.channel} · ${ACTIVE_THREAD.project}`}>
            <div className="rounded-lg border border-azure/25 bg-azure/[0.04] p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-azure" /> AI Summary
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-secondary-foreground">{ACTIVE_THREAD.aiSummary}</p>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                <Avatar initials="SM" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{ACTIVE_THREAD.from}</p>
                  <p className="text-xs text-muted-foreground">
                    To {ACTIVE_THREAD.to} · {ACTIVE_THREAD.sent}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-secondary-foreground">
                {ACTIVE_THREAD.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
              <Button size="sm" className="bg-azure text-azure-foreground hover:bg-azure/90">
                <Reply className="h-4 w-4" /> Reply
              </Button>
              <Button variant="outline" size="sm">
                <Sparkles className="h-4 w-4 text-azure" /> AI Draft
              </Button>
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4" /> Attach
              </Button>
            </div>
          </Panel>

          <Panel title="AI Extracted Actions" bodyClassName="space-y-3">
            {ACTIVE_THREAD.extractedActions.map((item) => (
              <div key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <span className={`h-2 w-2 shrink-0 rounded-full ${DOT_TONE[item.tone]}`} aria-hidden="true" />
                <span className="min-w-0 truncate text-sm text-foreground">{item.title}</span>
                <button className="shrink-0 text-xs font-semibold text-azure">{item.action}</button>
              </div>
            ))}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Contact" bodyClassName="space-y-4">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
              <Avatar initials="SM" className="h-10 w-10 text-xs" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">Sarah Mitchell</span>
                <span className="block truncate text-xs text-muted-foreground">Client · Smith Residence</span>
              </span>
            </div>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="truncate text-foreground">sarah@mitchell.com</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="text-foreground">0412 884 190</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Portal access</dt>
                <dd className="text-chart-5">Active</dd>
              </div>
            </dl>
            <Button variant="outline" size="sm" className="w-full">
              <Phone className="h-4 w-4" /> Call client
            </Button>
          </Panel>

          <Panel title="Project History" bodyClassName="space-y-3">
            {ACTIVE_THREAD.history.map((item) => (
              <div key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT_TONE[item.tone]}`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate text-sm text-foreground">{item.title}</span>
                  <span className="block text-xs text-muted-foreground">{item.meta}</span>
                </span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
