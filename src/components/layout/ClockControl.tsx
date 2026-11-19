import { DEMO_START } from "../../data/demo";
import { addDays, addMonths } from "../../logic/calendar";
import { formatDate } from "../../logic/format";
import { useClock } from "../../state/ClockContext";
import { Button } from "../ui/Button";

/** Moves the demo date. Items appear, alerts fire and untouched items escalate as it passes each point. */
export function ClockControl() {
  const { today, setToday, reset } = useClock();
  return (
    <div className="clock" role="group" aria-label="Demo clock">
      <div className="clock__now">
        <span className="label">Today</span>
        <time className="clock__date num" dateTime={today} aria-live="polite">
          {formatDate(today)}
        </time>
      </div>
      <Button variant="secondary" onClick={() => setToday(addDays(today, 7))}>
        +1 week
      </Button>
      <Button variant="secondary" onClick={() => setToday(addMonths(today, 1))}>
        +1 month
      </Button>
      <label className="clock__picker">
        <span className="visually-hidden">Pick a date</span>
        <input
          type="date"
          value={today}
          min={DEMO_START}
          onChange={(e) => e.target.value && setToday(e.target.value)}
        />
      </label>
      <Button variant="quiet" onClick={reset} disabled={today === DEMO_START}>
        Reset
      </Button>
    </div>
  );
}
