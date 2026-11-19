import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEMO_START } from "../data/demo";
import { laterOf } from "../logic/calendar";

interface ClockValue {
  /** The demo's today. Every screen reads the date from here, never from the system clock. */
  today: string;
  /** Moves the clock. Dates before the demo start are held at the start. */
  setToday: (iso: string) => void;
  reset: () => void;
}

const ClockContext = createContext<ClockValue | null>(null);

export function ClockProvider({ children }: { children: ReactNode }) {
  const [today, setTodayState] = useState(DEMO_START);
  const value = useMemo<ClockValue>(
    () => ({
      today,
      setToday: (iso) => setTodayState(laterOf(iso, DEMO_START)),
      reset: () => setTodayState(DEMO_START),
    }),
    [today],
  );
  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
}

export function useClock(): ClockValue {
  const value = useContext(ClockContext);
  if (!value) throw new Error("useClock must be used inside ClockProvider");
  return value;
}
