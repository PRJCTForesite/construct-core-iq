import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronsUpDown, Menu, Plus, Search, Sparkles, LogOut } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import {
  GlobalSearch,
  QuickAdd,
  Notifications,
  RolePreview,
} from "@/components/platform/GlobalControls";
import { usePlatform } from "@/components/platform/PlatformProvider";
import mark from "@/assets/foresite-mark-transparent.png";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AppIcon } from "./AppIcon";
import { Avatar } from "./primitives";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAV, DEMO_USER } from "@/content/app";
import { hasSession, endDemoSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { previewPortal } from '@/lib/services/permissionsService';
import { WorkflowGuide } from './WorkflowGuide';

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { role } = usePlatform();
  return (
    <nav className="flex flex-col gap-0.5 px-2" aria-label="Application">
      {APP_NAV.filter((item) => !previewPortal(role) || item.to === previewPortal(role)).map(
        (item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/app" }}
            onClick={onNavigate}
            className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            activeProps={{ className: "bg-sidebar-accent text-sidebar-foreground" }}
          >
            <AppIcon name={item.icon} className="h-[1.05rem] w-[1.05rem] shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold",
                  item.label === "Defects"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-azure/20 text-azure",
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        ),
      )}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2.5 px-4">
        <img src={mark} alt="" width={28} height={28} className="h-7 w-7 rounded-md" />
        <span className="text-[0.9375rem] font-semibold tracking-tight">Foresite OS</span>
      </div>
      <div className="flex-1 overflow-y-auto pb-4">
        <NavList onNavigate={onNavigate} />
      </div>
      <UserCard />
    </div>
  );
}

function UserCard() {
  const { role } = usePlatform();
  const identity =
    role === "Client"
      ? {
          name: "Sarah Mitchell",
          initials: "SM",
          company: "Smith Residence",
          email: "sarah@example.com",
        }
      : DEMO_USER;
  const navigate = useNavigate();

  function signOut() {
    if (typeof window !== "undefined") endDemoSession();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="border-t border-sidebar-border p-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent">
          <Avatar
            initials={identity.initials}
            className="bg-sidebar-primary/25 text-sidebar-foreground"
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{identity.name}</span>
            <span className="block truncate text-xs text-sidebar-foreground/60">
              {identity.company}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {identity.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/app/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TopBar({
  crumb,
  searchPlaceholder,
  actions,
}: {
  crumb: ReactNode;
  searchPlaceholder: string;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = usePlatform();
  const clientSurface = pathname === "/app/client-portal" || role === "Client";

  return (
    <header className="sticky top-0 z-40 grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-b-2xl border-b border-border bg-background/90 px-3 backdrop-blur-md sm:gap-3 sm:px-4 lg:rounded-none lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_auto] lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[17rem] overflow-hidden border-sidebar-border bg-sidebar p-0 [&>button]:text-sidebar-foreground">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="min-w-0 truncate text-sm text-muted-foreground">{crumb}</div>
      </div>

      <div className="hidden min-w-0 lg:block">{!clientSurface && <GlobalSearch />}</div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <WorkflowGuide />
        {!clientSurface && (
          <>
            <div className="lg:hidden">
              <GlobalSearch />
            </div>
            <Notifications />
            {actions ?? <QuickAdd />}
            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/app/ai-insights">
                <Sparkles className="h-4 w-4 text-azure" /> AI
              </Link>
            </Button>
          </>
        )}
        <Avatar initials={role === "Client" ? "SM" : DEMO_USER.initials} className="hidden sm:grid" />
      </div>
    </header>
  );
}

/** Chrome for the signed-in application. Presentational only. */
export function AppShell({ children }: { children?: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = usePlatform();
  useEffect(() => {
    const portal = previewPortal(role);
    if (portal && pathname !== portal) void navigate({ to: portal });
  }, [role, pathname, navigate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasSession()) {
      navigate({ to: "/login", replace: true });
    }
  }, [navigate, pathname]);

  const active = APP_NAV.find((item) =>
    item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to),
  );

  const searchPlaceholder =
    active?.label === "Financials"
      ? "Show overdue invoices · Search by client or project"
      : active?.label === "Defects"
        ? "Open defects · Search by trade, location"
        : active?.label === "Communications"
          ? "Find waterproofing emails · Show overdue invoices"
          : "Search everything… projects, invoices, people, defects";

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-[17rem] shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-[17rem]">
          <SidebarBody />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          crumb={
            <span className="flex items-center gap-2">
              <span className="font-medium text-foreground">{active?.label ?? "Dashboard"}</span>
              {active?.to === "/app" && <span className="hidden sm:inline">/ Command Center</span>}
            </span>
          }
          searchPlaceholder={searchPlaceholder}
        />
        <RolePreview />
        <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
          {role === "Client" && pathname !== "/app/client-portal" ? null : (children ?? <Outlet />)}
        </main>
      </div>
    </div>
  );
}
