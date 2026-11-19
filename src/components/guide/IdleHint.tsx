import { useEffect, useState } from "react";
import { useGuide } from "../../state/GuideContext";
import { useJourney } from "../../state/useJourney";
import { Button } from "../ui/Button";
import { useDoNext } from "./DemoGuide";
import "./Guide.css";

const IDLE_MS = 20_000;
const ACTIVITY = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/** After 20 seconds with nothing touched, a quiet line saying what to try next. Any activity hides it. */
export function IdleHint() {
  const { current } = useJourney();
  const { tour, autoplay } = useGuide();
  const goNext = useDoNext();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    const reset = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    };
    for (const e of ACTIVITY) window.addEventListener(e, reset, { passive: true });
    return () => {
      window.clearTimeout(timer);
      for (const e of ACTIVITY) window.removeEventListener(e, reset);
    };
  }, []);

  if (!idle || !current || tour || autoplay) return null;
  return (
    <div className="idle-hint" role="status">
      <p>
        <span className="label">Try next</span> {current.todo}
      </p>
      <Button variant="secondary" onClick={goNext}>
        Do this next
      </Button>
    </div>
  );
}
