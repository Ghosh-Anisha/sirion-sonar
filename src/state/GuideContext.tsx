import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { TourScreen } from "../data/tours";

const STORAGE_KEY = "sirion-sonar.guide.v1";

interface Saved {
  open: boolean;
  toursSeen: TourScreen[];
  visited: string[];
  nudged: string[];
}

const FRESH: Saved = { open: false, toursSeen: [], visited: [], nudged: [] };

function load(): Saved {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<Saved>) : {};
    return { ...FRESH, ...saved };
  } catch {
    return FRESH;
  }
}

function add<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list : [...list, value];
}

interface GuideValue extends Saved {
  setOpen: (open: boolean) => void;
  tour: TourScreen | null;
  startTour: (screen: TourScreen) => void;
  endTour: () => void;
  visit: (path: string) => void;
  nudgeClicked: (id: string) => void;
}

const GuideContext = createContext<GuideValue | null>(null);

/** The demo guide: the panel, which tours were seen, where the viewer has been, and which nudges were clicked. */
export function GuideProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(load);
  const [tour, setTour] = useState<TourScreen | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Storage can be blocked. The guide still works for this visit.
    }
  }, [saved]);

  const value = useMemo<GuideValue>(
    () => ({
      ...saved,
      setOpen: (open) => setSaved((s) => ({ ...s, open })),
      tour,
      startTour: setTour,
      endTour: () => {
        if (tour) setSaved((s) => ({ ...s, toursSeen: add(s.toursSeen, tour) }));
        setTour(null);
      },
      visit: (path) => setSaved((s) => (s.visited.includes(path) ? s : { ...s, visited: add(s.visited, path) })),
      nudgeClicked: (id) => setSaved((s) => (s.nudged.includes(id) ? s : { ...s, nudged: add(s.nudged, id) })),
    }),
    [saved, tour],
  );
  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuide(): GuideValue {
  const value = useContext(GuideContext);
  if (!value) throw new Error("useGuide must be used inside GuideProvider");
  return value;
}
