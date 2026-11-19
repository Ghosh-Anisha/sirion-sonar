import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { people } from "../data/people";
import type { Person } from "../data/types";

interface ViewerValue {
  /** The person the demo is being viewed as. Starts as the procurement lead, who sees everything. */
  viewer: Person;
  setViewerId: (id: string) => void;
}

const ViewerContext = createContext<ViewerValue | null>(null);

export const PROCUREMENT_LEAD = people.find((p) => p.role === "procurement-lead")!;

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [viewerId, setViewerId] = useState(PROCUREMENT_LEAD.id);
  const value = useMemo<ViewerValue>(
    () => ({ viewer: people.find((p) => p.id === viewerId) ?? PROCUREMENT_LEAD, setViewerId }),
    [viewerId],
  );
  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
}

export function useViewer(): ViewerValue {
  const value = useContext(ViewerContext);
  if (!value) throw new Error("useViewer must be used inside ViewerProvider");
  return value;
}
