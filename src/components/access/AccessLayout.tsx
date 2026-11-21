import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import logo from "@/assets/foresite-logo-transparent.png";
import logoDark from "@/assets/foresite-logo-transparent-dark.png";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

export function AccessLayout({ children }: { children: ReactNode }) {
  return <div className="access-theme min-h-screen bg-surface text-foreground">
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Foresite home"><img src={logo} width={190} height={40} alt="Foresite - Combined Construction Systems" className="h-auto w-[150px] max-w-full sm:w-[190px] dark:hidden" /><img src={logoDark} width={190} height={40} alt="" aria-hidden="true" className="hidden h-auto w-[150px] max-w-full sm:w-[190px] dark:block" /><span className="hidden border-l border-border pl-3 text-sm text-muted-foreground sm:block">Account access</span></Link>
        <div className="flex shrink-0 items-center gap-2"><ThemeToggle /><Button asChild variant="ghost" size="sm"><Link to="/" aria-label="Back to website"><ArrowLeft /><span className="hidden sm:inline">Back to website</span></Link></Button></div>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">{children}</main>
    <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-6 text-xs text-muted-foreground sm:px-8"><span>Foresite · Combined Construction Systems</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Beta preview · No live authentication or billing</span></footer>
  </div>;
}