import type { IconName } from "@/content/site";
import {
  Boxes,
  CheckSquare,
  FileText,
  MessagesSquare,
  ShieldAlert,
  Wallet,
  Activity,
  Sparkles,
} from "lucide-react";

const MAP = {
  projects: Boxes,
  tasks: CheckSquare,
  defects: ShieldAlert,
  documents: FileText,
  communications: MessagesSquare,
  financials: Wallet,
  health: Activity,
  ai: Sparkles,
} as const;

export function FeatureIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = MAP[name];
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
