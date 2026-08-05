import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";

import mark from "@/assets/foresite-mark.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SESSION_KEY } from "@/lib/session";
import { BRAND } from "@/content/site";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Foresite Construction Operating System" },
      {
        name: "description",
        content:
          "Sign in to Foresite to open your command centre: projects, tasks, defects, documents, communications and financials.",
      },
      { property: "og:title", content: "Sign in to Foresite" },
      { property: "og:description", content: "Access your Foresite construction operating system workspace." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("james@hartleyconstruction.com.au");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || password.length < 4) {
      setError("Enter your email and a password of at least 4 characters.");
      return;
    }
    setError(null);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email, at: Date.now() }));
    navigate({ to: "/app" });
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5">
            <img src={mark} alt="" width={32} height={32} className="h-8 w-8 rounded-md" />
            <span className="text-[1.0625rem] font-semibold tracking-tight text-foreground">{BRAND}</span>
          </div>

          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Sign in to your workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use your Foresite credentials. This preview accepts any email and password.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-secondary-foreground">
                <Checkbox defaultChecked /> Keep me signed in
              </label>
              <span className="text-sm font-medium text-azure">Forgot password?</span>
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full bg-azure text-azure-foreground hover:bg-azure/90">
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Need an account?{" "}
            <Link to="/contact" className="font-medium text-azure">
              Talk to our team
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-center">
        <div className="grid-blueprint absolute inset-0 opacity-[0.07]" aria-hidden="true" />
        <div className="relative max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-construction">Command centre</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Every project, invoice, defect and conversation in one operating system.
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-primary-foreground/75">
            <li>AI daily brief with the five things that need you today</li>
            <li>Live business health score across schedule, cost, comms and quality</li>
            <li>Client portal, trade coordination and financials in one place</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
