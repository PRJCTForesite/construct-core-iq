import {
  Activity,
  Banknote,
  BarChart3,
  Boxes,
  Building2,
  CalendarDays,
  CheckSquare,
  FileText,
  HardHat,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  ShieldAlert,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import type { NavIcon } from "@/content/app";

const MAP = {
  dashboard: LayoutDashboard,
  workspace: UserRound,
  projects: Boxes,
  calendar: CalendarDays,
  tasks: CheckSquare,
  communications: MessagesSquare,
  documents: FileText,
  financials: Banknote,
  defects: ShieldAlert,
  clients: Users,
  trades: HardHat,
  reports: BarChart3,
  ai: Sparkles,
  settings: Settings,
  health: Activity,
  building: Building2,
} as const;

export function AppIcon({ name, className }: { name: NavIcon | "health" | "building"; className?: string }) {
  const Icon = MAP[name] ?? Boxes;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
