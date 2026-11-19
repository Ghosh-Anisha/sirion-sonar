import { DEMO_START } from "../../data/demo";
import { formatDate } from "../../logic/format";

/** Placeholder. The real clock, with buttons to move the date, comes with the Home screen. */
export function ClockControl() {
  return (
    <div className="clock">
      <span className="label">Demo date</span>
      <time className="clock__date num" dateTime={DEMO_START}>
        {formatDate(DEMO_START)}
      </time>
    </div>
  );
}
