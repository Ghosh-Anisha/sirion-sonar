import type { NorthStar } from "../../logic/measures";
import "./Measures.css";

/** The north star: the share of contract deadlines that got a decision before they passed. */
export function NorthStarCard({ star }: { star: NorthStar }) {
  const settled = star.decidedInTime + star.missed;
  return (
    <section className="north-star" aria-labelledby="north-star-title">
      <p id="north-star-title" className="label">
        North star
      </p>
      <h2>Share of contract deadlines that got a decision before they passed</h2>
      <p className="north-star__value num">{star.share === null ? "Not yet" : `${star.share}%`}</p>
      <div className="metric__bar north-star__bar" aria-hidden="true">
        <span className="metric__fill" style={{ width: `${star.share ?? 0}%` }} />
      </div>
      <p>
        {settled === 0
          ? "No deadline has passed or been decided yet, so there is nothing to count. "
          : `${star.decidedInTime} of ${settled} ${settled === 1 ? "deadline" : "deadlines"} decided in time, ${star.missed} missed. `}
        <span className="num">{star.pending}</span> more {star.pending === 1 ? "is" : "are"} open and not due yet.
      </p>
      <p className="muted">
        A decision means the owner chose renew, renegotiate or end. Sending a reply on its own does not count.
      </p>
    </section>
  );
}
