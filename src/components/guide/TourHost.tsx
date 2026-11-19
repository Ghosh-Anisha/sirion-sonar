import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { tours, tourScreenFor } from "../../data/tours";
import { useGuide } from "../../state/GuideContext";
import { Tour } from "./Tour";

/** Lets the page render before a first-visit tour starts. */
const START_DELAY_MS = 600;

/** Runs each screen's tour once on the first visit, records the visit, and shows a tour when one is started. */
export function TourHost() {
  const { pathname } = useLocation();
  const { tour, toursSeen, startTour, endTour, visit, autoplay } = useGuide();
  const screen = tourScreenFor(pathname);

  useEffect(() => visit(pathname.split("/").slice(0, 2).join("/")), [pathname, visit]);

  useEffect(() => {
    if (!screen || tour || autoplay || toursSeen.includes(screen)) return;
    const timer = window.setTimeout(() => startTour(screen), START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [screen, tour, autoplay, toursSeen, startTour]);

  return tour ? <Tour key={`${tour}-${pathname}`} steps={tours[tour]} onClose={endTour} /> : null;
}
