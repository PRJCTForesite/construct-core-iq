import { createContext, useContext, useState, type ReactNode } from "react";
import {
  PORTAL_TEMPLATES,
  DEFAULT_STAGES,
  defaultApprovals,
  type PortalTemplate,
  type Stage,
  type Approval,
  type BuilderUpdate,
  type Suggestion,
} from "@/content/client-portal";

export type ProjectPortal = {
  templateId: string;
  stages: Stage[];
  contacts: string[];
  approvals: Approval[];
  suggestions: Suggestion[];
  updates: BuilderUpdate[];
  messages: { id: string; author: string; text: string; files: string[]; date: string }[];
  notifications: { id: string; title: string; date: string; read: boolean }[];
};
export function newProjectPortal(): ProjectPortal {
  return {
    templateId: "full",
    stages: DEFAULT_STAGES.map((s) => ({ ...s })),
    contacts: ["Builder", "Project Manager"],
    approvals: defaultApprovals(),
    suggestions: [],
    updates: [
      {
        id: "update-1",
        date: "2026-11-05",
        author: "James Hartley",
        completed:
          "Kitchen cabinetry installed. Bathroom wall tiling complete. External windows fitted.",
        upcoming: "Stone benchtop installation, electrical fit-off and internal painting.",
        risks: "Window delivery was delayed two days; the completion target remains unchanged.",
        approvals: "Kitchen tiles and internal paint colours require your confirmation.",
        photos: ["kitchen", "bathroom", "external"],
      },
    ],
    messages: [
      {
        id: "welcome",
        author: "James Hartley",
        text: "Your next site walkthrough is on Friday at 10 am. I look forward to showing you the new kitchen.",
        files: [],
        date: "5 Nov 2026",
      },
    ],
    notifications: [
      "New Builder Update",
      "New Photos Uploaded",
      "New Variation",
      "New Message",
      "Defect Status Changed",
      "Milestone Reached",
      "Project Health Changed",
      "Completion Date Changed",
    ].map((title, i) => ({ id: `notice-${i}`, title, date: "5 Nov 2026", read: false })),
  };
}
type PortalStore = {
  templates: PortalTemplate[];
  saveTemplate: (template: PortalTemplate) => void;
  projects: Record<string, ProjectPortal>;
  getProject: (id: string) => ProjectPortal;
  updateProject: (id: string, update: (p: ProjectPortal) => ProjectPortal) => void;
};
const Context = createContext<PortalStore | null>(null);
export function PortalProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState(PORTAL_TEMPLATES);
  const [projects, setProjects] = useState<Record<string, ProjectPortal>>({});
  const [fallback] = useState(newProjectPortal);
  return (
    <Context.Provider
      value={{
        templates,
        projects,
        getProject: (id) => projects[id] ?? fallback,
        saveTemplate: (t) =>
          setTemplates((old) =>
            old.some((x) => x.id === t.id) ? old.map((x) => (x.id === t.id ? t : x)) : [...old, t],
          ),
        updateProject: (id, update) =>
          setProjects((old) => ({ ...old, [id]: update(old[id] ?? newProjectPortal()) })),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePortal() {
  const store = useContext(Context);
  if (!store) throw new Error("PortalProvider missing");
  return store;
}
