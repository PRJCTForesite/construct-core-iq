import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import mark from "@/assets/foresite-mark.png";
import { Button } from "@/components/ui/button";

export function AccessLayout({ children }: { children: ReactNode }) {
  return <div className="access-theme min-h-screen bg-surface text-foreground">
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Foresite home"><img src={mark} width={34} height={34} alt="" className="rounded-md" /><span className="text-xl font-semibold">Foresite</span><span className="hidden border-l border-border pl-3 text-sm text-muted-foreground sm:block">Account access</span></Link>
        <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft /> Back to website</Link></Button>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">{children}</main>
    <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-6 text-xs text-muted-foreground sm:px-8"><span>Foresite · Construction Operating System</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Beta preview · No live authentication or billing</span></footer>
  </div>;
}