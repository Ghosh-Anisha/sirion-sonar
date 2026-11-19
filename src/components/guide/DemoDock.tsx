import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { moments } from "../../data/journey";
import { tourScreenFor } from "../../data/tours";
import { useGuide } from "../../state/GuideContext";
import { resetDemo } from "../../state/resetDemo";
import { useJourney } from "../../state/useJourney";
import { ViewAsSwitcher } from "../layout/ViewAsSwitcher";
import { ThinkingToggle } from "../thinking/ThinkingToggle";
import { DemoRunner } from "./DemoRunner";
import { DemoGuide } from "./DemoGuide";
import { DEMO_FLAG, usePlayDemo } from "./usePlayDemo";
import "./Guide.css";

/**
 * The demo's own controls, kept at the bottom so the top of the screen is only the product.
 * Its height is shared as --dock-height, so the page leaves room for it and nothing sits underneath.
 */
export function DemoDock() {
  const { pathname } = useLocation();
  const { open, setOpen, startTour, tour, demo, setDemo } = useGuide();
  const play = usePlayDemo();
  const { count } = useJourney();
  const [more, setMore] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const screen = tourScreenFor(pathname);

  // Start the clickable demo when it was asked for before a reset.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(DEMO_FLAG)) {
        window.sessionStorage.removeItem(DEMO_FLAG);
        setDemo({ index: 0 });
      }
    } catch {
      // Session storage can be blocked. The demo then waits for its button.
    }
  }, [setDemo]);

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
      {demo ? <DemoRunner /> : open && !tour && <DemoGuide />}
      <div className="dock__bar">
        <button type="button" className="dock__play" onClick={play} disabled={demo !== null}>
          <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
          </svg>
          Start the clickable demo
        </button>
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
          Tour
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
