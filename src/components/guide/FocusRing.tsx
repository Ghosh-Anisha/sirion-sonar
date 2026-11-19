import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { demoSteps } from "../../data/demoSteps";
import { useGuide } from "../../state/GuideContext";
import { useJourney } from "../../state/useJourney";
import "./Guide.css";

const CHECK_MS = 300;
const PAD = 6;

/**
 * A glowing ring around the thing to look at: the demo step's focus while the clickable demo runs,
 * or the next thing to click for the current moment. It never blocks a click.
 */
export function FocusRing() {
  const { demo, tour, nudged, nudgeClicked } = useGuide();
  const { next } = useJourney();
  const selector = demo ? (demoSteps[demo.index].focus ?? null) : next && !nudged.includes(next.nudge) ? `[data-nudge="${next.nudge}"]` : null;
  const nudgeId = !demo && next ? next.nudge : null;
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!selector) return setBox(null);
    const place = () => {
      const el = Array.from(document.querySelectorAll(selector)).find((e) => e.getClientRects().length > 0);
      const r = el?.getBoundingClientRect();
      setBox(r ? { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 } : null);
    };
    const onClick = (e: MouseEvent) => {
      if (nudgeId && e.target instanceof Element && e.target.closest(selector)) nudgeClicked(nudgeId);
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
  }, [selector, nudgeId, nudgeClicked]);

  if (!box || tour) return null;
  return createPortal(<span className={`focus-ring${demo ? " focus-ring--story" : ""}`} aria-hidden="true" style={box} />, document.body);
}
