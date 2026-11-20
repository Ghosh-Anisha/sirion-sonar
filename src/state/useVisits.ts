import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parseVisits, topPath, withVisit } from "../logic/visits";

const STORAGE_KEY = "sirion-sonar.visited";

function load(): string[] {
  try {
    return parseVisits(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/** Remembers each page the viewer opens, in this browser only. Rendered once, beside the routes. */
export function VisitRecorder() {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      const next = withVisit(load(), pathname);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage can be blocked. The checklist then ticks only the page being read.
    }
  }, [pathname]);
  return null;
}

/** The pages opened so far, always including the one being read. */
export function useVisits(): string[] {
  const { pathname } = useLocation();
  const [visited, setVisited] = useState<string[]>([]);
  useEffect(() => setVisited(load()), [pathname]);
  return withVisit(visited, topPath(pathname));
}
