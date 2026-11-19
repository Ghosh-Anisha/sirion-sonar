import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { demoSteps } from "../../data/demoSteps";
import { moments } from "../../data/journey";
import { people } from "../../data/people";
import { useClock } from "../../state/ClockContext";
import { useGuide } from "../../state/GuideContext";
import { useViewer } from "../../state/ViewerContext";
import { Button } from "../ui/Button";
import { DemoHotspot } from "./DemoHotspot";
import { findTarget, pressedByViewer } from "./demoTargets";
import "./Guide.css";

const FIND_WITHIN_MS = 3000;
/** A pause after the viewer's click, so its result shows before the next step points somewhere else. */
const AFTER_CLICK_MS = 450;

/**
 * The clickable demo. Each step points at one thing and waits for the viewer to press it,
 * then moves on. Steps that only show something wait for Next. The bar says what the step is for,
 * and Do it for me presses the thing for anyone who is stuck.
 */
export function DemoRunner() {
  const { demo, setDemo } = useGuide();
  const navigate = useNavigate();
  const { setToday } = useClock();
  const { setViewerId } = useViewer();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [missing, setMissing] = useState(false);
  const index = demo?.index ?? 0;
  const step = demoSteps[index];
  const action = step.action;
  const last = index === demoSteps.length - 1;
  const go = (to: number) => setDemo({ index: Math.min(Math.max(to, 0), demoSteps.length - 1) });

  // Find what this step points at, waiting a little for the screen to render.
  useEffect(() => {
    setTarget(null);
    setMissing(false);
    if (!action) return;
    if ("go" in action) {
      navigate(action.go);
      return;
    }
    const until = Date.now() + FIND_WITHIN_MS;
    const timer = window.setInterval(() => {
      const el = findTarget(action);
      if (el) {
        setTarget(el);
        window.clearInterval(timer);
      } else if (Date.now() > until) {
        setMissing(true);
        window.clearInterval(timer);
      }
    }, 120);
    return () => window.clearInterval(timer);
    // A step's target is found once each time the step is reached.
  }, [index]);

  // Move on once the viewer presses the thing pointed at.
  useEffect(() => {
    if (!target || !pressedByViewer(action)) return;
    let moved = false;
    const onClick = (e: MouseEvent) => {
      if (moved || !(e.target instanceof Node) || !target.contains(e.target)) return;
      moved = true;
      window.setTimeout(() => go(index + 1), AFTER_CLICK_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [target, index]);

  /** Does the step for the viewer: presses the target, or sets the clock or the viewer. */
  const doIt = () => {
    if (action && "clock" in action) setToday(action.clock);
    else if (action && "viewer" in action) setViewerId(action.viewer);
    else if (target) return target.click();
    else if (action && "click" in action && action.fallback) navigate(action.fallback);
    go(index + 1);
  };

  const moment = moments.find((m) => m.id === step.moment);
  const person = action && "viewer" in action ? people.find((p) => p.id === action.viewer) : null;
  const waitsForClick = pressedByViewer(action) && !missing;

  return (
    <section className="demo-bar" aria-labelledby="demo-caption">
      <div className="demo-bar__progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / demoSteps.length) * 100}%` }} />
      </div>
      <div className="demo-bar__body">
        <div className="demo-bar__text">
          <p className="label">
            {moment ? moment.name : "Sirion Sonar"}, step <span className="num">{index + 1}</span> of <span className="num">{demoSteps.length}</span>
          </p>
          <p key={index} id="demo-caption" className="demo-bar__caption" aria-live="polite">
            {step.caption}
          </p>
          {waitsForClick && action && "label" in action && (
            <p className="demo-bar__hint">
              <span className="demo-bar__pulse" aria-hidden="true" /> {action.label} on the screen to go on.
            </p>
          )}
        </div>
        <div className="row demo-bar__controls">
          <Button onClick={() => go(index - 1)} disabled={index === 0}>
            Back
          </Button>
          {action && ("clock" in action || "viewer" in action) ? (
            <Button variant="primary" onClick={doIt}>
              {person ? `Become ${person.name.split(" ")[0]}` : action.label}
            </Button>
          ) : waitsForClick ? (
            <Button onClick={doIt}>Do it for me</Button>
          ) : (
            !last && (
              <Button variant="primary" onClick={() => go(index + 1)}>
                Next
              </Button>
            )
          )}
          <Button variant="quiet" onClick={() => setDemo(null)}>
            {last ? "Close" : "End demo"}
          </Button>
        </div>
      </div>
      {target && action && "label" in action && <DemoHotspot target={target} label={action.label} />}
    </section>
  );
}
