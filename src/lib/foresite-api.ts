import type { PlatformRecord } from "@/content/platform";

/**
 * Connection point for the Foresite data service (FastAPI + PostgreSQL).
 * Set VITE_FORESITE_API_URL (e.g. https://api.foresite.com) to enable syncing.
 * Expected endpoints: PUT /records/{id} (upsert JSON record), DELETE /records/{id}.
 * Only real user records are sent; sample records never leave the browser.
 */
const base = () => (import.meta.env['VITE_FORESITE_API_URL'] as string | undefined)?.replace(/\/$/, "");

export const apiConfigured = () => Boolean(base());

export async function upsertRecord(record: PlatformRecord) {
  const url = base();
  if (!url) return;
  const res = await fetch(`${url}/records/${encodeURIComponent(record.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error(`Save failed (${res.status})`);
}

export async function deleteRecord(id: string) {
  const url = base();
  if (!url) return;
  const res = await fetch(`${url}/records/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete failed (${res.status})`);
}
