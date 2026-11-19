import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useGuide } from "../../state/GuideContext";
import { useJourney } from "../../state/useJourney";
import "./Guide.css";

const CHECK_MS = 400;

/** A soft dot on the next thing to click for the current moment. It stops once that thing is clicked. */
export function NudgeDot() {
  const { next } = useJourney();
  const { nudged, nudgeClicked, tour } = useGuide();
  const id = next && !nudged.includes(next.nudge) ? next.nudge : null;
  const [spot, setSpot] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!id) return setSpot(null);
    const place = () => {
      const el = document.querySelector(`[data-nudge="${id}"]`);
      const r = el?.getBoundingClientRect();
      setSpot(r && r.width > 0 ? { top: r.top, left: r.right } : null);
    };
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(`[data-nudge="${id}"]`)) nudgeClicked(id);
    };
    place();
    const timer = window.setInterval(place, CHECK_MS);
    window.addEventListener("scroll", place, true);
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [id, nudgeClicked]);

  if (!spot || tour) return null;
  return createPortal(<span className="nudge-dot" aria-hidden="true" style={{ top: spot.top, left: spot.left }} />, document.body);
}
