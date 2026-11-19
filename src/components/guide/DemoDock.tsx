import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { moments } from "../../data/journey";
import { tourScreenFor } from "../../data/tours";
import { useGuide } from "../../state/GuideContext";
import { resetDemo } from "../../state/resetDemo";
import { useJourney } from "../../state/useJourney";
import { ViewAsSwitcher } from "../layout/ViewAsSwitcher";
import { ThinkingToggle } from "../thinking/ThinkingToggle";
import { DemoGuide } from "./DemoGuide";
import "./Guide.css";

/**
 * The demo's own controls, kept at the bottom so the top of the screen is only the product.
 * Its height is shared as --dock-height, so the page leaves room for it and nothing sits underneath.
 */
export function DemoDock() {
  const { pathname } = useLocation();
  const { open, setOpen, startTour, tour } = useGuide();
  const { count } = useJourney();
  const [more, setMore] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const screen = tourScreenFor(pathname);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const set = () => root.style.setProperty("--dock-height", `${el.offsetHeight}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--dock-height");
    };
  }, []);

  return (
    <div ref={ref} className="dock" role="region" aria-label="Demo controls">
      {open && !tour && <DemoGuide />}
      <div className="dock__bar">
        <span className="dock__label label">Demo</span>
        <button
          type="button"
          className={`dock__guide${open ? " dock__guide--on" : ""}`}
          data-tour="dock-guide"
          aria-expanded={open}
          aria-controls="demo-guide"
          onClick={() => setOpen(!open)}
        >
          Demo guide
          <span className="dock__progress num">
            {count} of {moments.length}
          </span>
        </button>
        <button type="button" className="dock__button" data-tour="dock-tour" disabled={!screen} onClick={() => screen && startTour(screen)}>
          Tour this screen
        </button>
        <button type="button" className="dock__button dock__more" aria-expanded={more} aria-controls="dock-extra" onClick={() => setMore(!more)}>
          {more ? "Fewer controls" : "More controls"}
        </button>
        <div id="dock-extra" className={`dock__extra${more ? " dock__extra--open" : ""}`}>
          <ViewAsSwitcher />
          <ThinkingToggle />
          <button type="button" className="dock__button" onClick={resetDemo}>
            Reset demo
          </button>
        </div>
      </div>
    </div>
  );
}
