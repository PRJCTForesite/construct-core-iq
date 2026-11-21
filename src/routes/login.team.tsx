import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { KeyRound, LoaderCircle, LockKeyhole, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnterTeamWorkspace, useTeamAccess } from "@/components/access/TeamAccess";
import { unlockTeamAccess } from "@/lib/team-access.functions";
import { TEAM_ACCESS_STORAGE_KEY } from "@/lib/team-access";

export const Route = createFileRoute("/login/team")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Team access — Foresite" },
    { name: "description", content: "Private Foresite team access." },
    { property: "og:title", content: "Team access — Foresite" },
    { property: "og:description", content: "Private Foresite team access." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: TeamAccessPage,
});

function TeamAccessPage() {
  const { state, refresh } = useTeamAccess();
  const enter = useEnterTeamWorkspace();
  const unlock = useServerFn(unlockTeamAccess);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const result = await unlock({ data: { passcode } });
      if (!result.ok) { setError(result.reason === "unavailable" ? "Team access is not available right now." : "That passcode isn't right."); return; }
      window.localStorage.setItem(TEAM_ACCESS_STORAGE_KEY, result.token);
      setPasscode("");
      refresh();
    } catch {
      setError("Team access could not be checked. Please try again.");
    } finally { setBusy(false); }
  }

  function forget() {
    try { window.localStorage.removeItem(TEAM_ACCESS_STORAGE_KEY); } catch { /* ignore */ }
    refresh();
  }

  return <section className="mx-auto max-w-md rounded-lg border border-border bg-card p-6 sm:p-8">
    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-azure/10 text-azure"><LockKeyhole className="h-5 w-5" /></span>
    <h1 className="mt-4 text-2xl font-semibold">Team access</h1>
    {state === "checking" && <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" /> Checking this device…</p>}
    {state === "trusted" && <>
      <p className="mt-2 text-sm text-muted-foreground">This device is recognised. One click takes you straight into the beta workspace.</p>
      <Button size="lg" className="mt-6 w-full" onClick={enter}><Zap /> Enter beta workspace</Button>
      <Button variant="link" className="mt-3 h-auto px-0 text-xs text-muted-foreground" onClick={forget}>Forget this device</Button>
    </>}
    {state === "locked" && <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
      <p className="text-sm text-muted-foreground">Enter the team passcode once on this device. After that, the one-click button appears here and on the sign-in page.</p>
      <div className="space-y-2"><Label htmlFor="team-passcode">Team passcode</Label><div className="relative"><KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="team-passcode" type="password" autoComplete="current-password" className="pl-9" value={passcode} onChange={event => setPasscode(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "team-passcode-error" : undefined} /></div></div>
      {error && <p id="team-passcode-error" role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy || !passcode}>{busy ? <LoaderCircle className="animate-spin" /> : null} Unlock this device</Button>
    </form>}
  </section>;
}
