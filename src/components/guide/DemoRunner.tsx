import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { demoSteps, type DemoSnapshot } from "../../data/demoSteps";
import { moments } from "../../data/journey";
import { people } from "../../data/people";
import { syncedStep } from "../../logic/demoSync";
import { useClock } from "../../state/ClockContext";
import { useDemoState } from "../../state/DemoStateContext";
import { useOnboarding } from "../../state/OnboardingContext";
import { useGuide } from "../../state/GuideContext";
import { useViewer } from "../../state/ViewerContext";
import { Button } from "../ui/Button";
import { DemoHotspot } from "./DemoHotspot";
import { clickMatches, findTarget, pressedByViewer } from "./demoTargets";
import "./Guide.css";

const FIND_WITHIN_MS = 3000;
/** A pause after the viewer's click, so its result shows before the next step points somewhere else. */
const AFTER_CLICK_MS = 450;

/**
 * The clickable demo. Each step points at one thing, and the bar follows the app: it shows the step after the
 * last one the app says has happened, however the viewer got there. Next moves the bar on by hand and never acts
 * on the app. Back shows an earlier step until the viewer does something. Switching person and moving the clock
 * have their own button, because there is nothing on screen to click for them.
 */
export function DemoRunner() {
  const { demo, setDemo } = useGuide();
  const navigate = useNavigate();
  const { today, setToday } = useClock();
  const { viewer, setViewerId } = useViewer();
  const { pathname } = useLocation();
  const { state: onboarding } = useOnboarding();
  const { state: demoState } = useDemoState();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [missing, setMissing] = useState(false);
  const [hold, setHold] = useState<number | null>(null);

  const snapshot = useMemo<DemoSnapshot>(
    () => ({
      path: decodeURIComponent(pathname),
      onboarding,
      actions: demoState.actions,
      sent: demoState.sent,
      factEdits: demoState.factEdits,
      viewerId: viewer.id,
      today,
    }),
    [pathname, onboarding, demoState, viewer.id, today],
  );
  // Whatever the viewer does lets go of a step held by Back.
  useEffect(() => setHold(null), [snapshot]);

  /** The furthest step reached by hand with Next. */
  const floor = demo?.index ?? 0;
  const index = hold ?? Math.max(syncedStep(demoSteps, snapshot), floor);
  const step = demoSteps[index];
  const action = step.action;
  const last = index === demoSteps.length - 1;
  const go = (to: number) => setDemo({ index: Math.min(Math.max(to, 0), demoSteps.length - 1) });
  const back = () => setHold(Math.max(index - 1, 0));
  /** Next steps forward through a held step first, then moves the bar past where the app is. */
  const next = () => {
    const reached = Math.max(syncedStep(demoSteps, snapshot), floor);
    if (hold !== null && hold + 1 < reached) return setHold(hold + 1);
    setHold(null);
    go(Math.max(index, reached - 1) + 1);
  };

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

  // Move on once the viewer presses the control the step asks for.
  useEffect(() => {
    if (!action || !pressedByViewer(action)) return;
    let moved = false;
    const onClick = (e: MouseEvent) => {
      if (moved || !clickMatches(e.target, action)) return;
      moved = true;
      window.setTimeout(() => {
        setHold(null);
        go(index + 1);
      }, AFTER_CLICK_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [index]);

  /** Switches person or moves the clock, the two steps with nothing on screen to click. */
  const setScene = () => {
    if (action && "clock" in action) setToday(action.clock);
    else if (action && "viewer" in action) setViewerId(action.viewer);
    next();
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
              <span className="demo-bar__pulse" aria-hidden="true" /> {action.label} on the screen and this bar follows. Already done it? Press Next in this bar.
            </p>
          )}
        </div>
        <div className="row demo-bar__controls">
          <Button onClick={back} disabled={index === 0}>
            Back
          </Button>
          {action && ("clock" in action || "viewer" in action) && (
            <Button variant="primary" onClick={setScene}>
              {person ? `Become ${person.name.split(" ")[0]}` : action.label}
            </Button>
          )}
          {!last && (
            <Button variant={waitsForClick || (action && ("clock" in action || "viewer" in action)) ? "secondary" : "primary"} onClick={next}>
              Next
            </Button>
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
