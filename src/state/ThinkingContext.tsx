import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ThinkingKey } from "../data/thinking";

const STORAGE_KEY = "sirion-sonar.thinking";

function loadOn(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

interface ThinkingValue {
  /** Whether the Under the hood badges are showing. */
  on: boolean;
  setOn: (on: boolean) => void;
  /** The part whose drawer is open, if any. */
  open: ThinkingKey | null;
  show: (key: ThinkingKey) => void;
  close: () => void;
}

const ThinkingContext = createContext<ThinkingValue | null>(null);

/** The Show the thinking toggle. Remembered in this browser, so it stays on across pages and reloads. */
export function ThinkingProvider({ children }: { children: ReactNode }) {
  const [on, setOnState] = useState(loadOn);
  const [open, setOpen] = useState<ThinkingKey | null>(null);
  const value = useMemo<ThinkingValue>(
    () => ({
      on,
      setOn: (next) => {
        setOnState(next);
        if (!next) setOpen(null);
        try {
          window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
        } catch {
          // Storage can be blocked. The toggle still works for this visit.
        }
      },
      open,
      show: setOpen,
      close: () => setOpen(null),
    }),
    [on, open],
  );
  return <ThinkingContext.Provider value={value}>{children}</ThinkingContext.Provider>;
}

export function useThinking(): ThinkingValue {
  const value = useContext(ThinkingContext);
  if (!value) throw new Error("useThinking must be used inside ThinkingProvider");
  return value;
}
