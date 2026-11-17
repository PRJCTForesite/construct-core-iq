import { LiveRegister } from "@/components/platform/ModuleFrame";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";

import {
  DOT_TONE,
  Meter,
  PageHeading,
  Panel,
  Pill,
  StatTile,
  type Tone,
} from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import {
  CASHFLOW_SERIES,
  CLIENT_RISK,
  FINANCIAL_KPIS,
  INVOICE_STATUS,
  OUTSTANDING_INVOICES,
  UPCOMING_PAYMENTS,
} from "@/content/app";

export const Route = createFileRoute("/app/financials")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Financials \u2014 Foresite OS" },
      { property: "og:description", content: "Cashflow, invoice status, outstanding invoices and client payment risk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Financials — Foresite OS" },
      { name: "description", content: "Cashflow, invoice status, outstanding invoices and client payment risk." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FinancialsPage,
});

const STATUS_TONE: Record<string, Tone> = { Overdue: "bad", Sent: "info" };
const RISK_TONE: Record<string, Tone> = { High: "bad", Medium: "warn", Low: "good" };

function CashflowBars() {
  const max = 460;
  return (
    <div className="mt-4 flex h-48 items-end gap-4">
      {CASHFLOW_SERIES.map((point) => (
        <div key={point.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end justify-center gap-1">
            <span className="w-1/3 rounded-t bg-azure" style={{ height: `${(point.inflow / max) * 100}%` }} />
            <span className="w-1/3 rounded-t bg-border" style={{ height: `${(point.outflow / max) * 100}%` }} />
          </div>
          <span className="text-[0.6875rem] text-muted-foreground">{point.month}</span>
        </div>
      ))}
    </div>
  );
}

function FinancialsPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        title="Financials"
        meta="FY25 · 7 active projects · updated 5 minutes ago"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="bg-azure text-azure-foreground hover:bg-azure/90">
              <Plus className="h-4 w-4" /> New Invoice
            </Button>
          </>
        }
      />
      <LiveRegister kind="Variation" title="Variations & claims" module="Financials" detail={r=>`${r.person} · $${r.amount.toLocaleString()}`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {FINANCIAL_KPIS.map((kpi) => (
          <StatTile key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <Panel
          title="Cashflow — Last 6 Months"
          action={
            <span className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-azure" /> Inflow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-border" /> Outflow
              </span>
            </span>
          }
        >
          <CashflowBars />
        </Panel>

        <Panel title="Invoice Status" bodyClassName="space-y-4">
          {INVOICE_STATUS.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-secondary-foreground">
                  <span className={`h-2 w-2 rounded-full ${DOT_TONE[item.tone]}`} aria-hidden="true" /> {item.label}
                </span>
                <span className="font-medium text-foreground">{item.share}%</span>
              </div>
              <Meter value={item.share} tone={item.tone} className="mt-1.5" />
              <p className="mt-1 text-[0.6875rem] text-muted-foreground">{item.value}</p>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="Outstanding Invoices" action="Filter" bodyClassName="p-0 sm:p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                {["Invoice", "Client", "Project", "Amount", "Issued", "Due", "Status", "Risk", ""].map((head) => (
                  <th key={head} className="px-4 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {OUTSTANDING_INVOICES.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-surface">
                  <td className="px-4 py-3.5 font-medium text-foreground">{invoice.id}</td>
                  <td className="px-4 py-3.5 text-secondary-foreground">{invoice.client}</td>
                  <td className="px-4 py-3.5 text-secondary-foreground">{invoice.project}</td>
                  <td className="px-4 py-3.5 font-medium tabular-nums text-foreground">{invoice.amount}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{invoice.issued}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{invoice.due}</td>
                  <td className="px-4 py-3.5">
                    <Pill tone={STATUS_TONE[invoice.status] ?? "muted"}>{invoice.status}</Pill>
                  </td>
                  <td className="px-4 py-3.5">
                    <Pill tone={RISK_TONE[invoice.risk] ?? "muted"}>{invoice.risk}</Pill>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="text-xs font-semibold text-azure">{invoice.action}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Upcoming Payments" bodyClassName="space-y-3">
          {UPCOMING_PAYMENTS.map((payment) => (
            <div key={payment.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-surface text-center leading-none">
                <span className="block text-sm font-semibold text-foreground">{payment.day}</span>
                <span className="block text-[0.625rem] text-muted-foreground">{payment.month}</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">{payment.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{payment.meta}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">{payment.amount}</span>
            </div>
          ))}
        </Panel>

        <Panel title="Client Payment Risk" bodyClassName="space-y-4">
          {CLIENT_RISK.map((client) => (
            <div key={client.name}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <span className="truncate text-sm font-medium text-foreground">{client.name}</span>
                <Pill tone={client.tone}>{client.level}</Pill>
              </div>
              <Meter value={client.share} tone={client.tone} className="mt-2" />
              <p className="mt-1 text-xs text-muted-foreground">{client.meta}</p>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
