import type { StoryAssumption } from "../data/story";
import { PlaysOutLink } from "../components/case/PlaysOutLink";
import "./Story.css";

/** Assumption cards, each with a small meter for how settled it is. The least settled one is marked. */
export function AssumptionMeters({ items }: { items: StoryAssumption[] }) {
  return (
    <ul className="meters" data-tour="story-assumptions">
      {items.map((a) => (
        <li key={a.text} className={`meter-card${a.leastSettled ? " meter-card--open" : ""}`}>
          {a.leastSettled && <span className="meter-card__flag label">Least settled</span>}
          <p>{a.text}</p>
          <div className="meter" role="meter" aria-label="How settled" aria-valuemin={0} aria-valuemax={100} aria-valuenow={a.settled} aria-valuetext={`${a.settled} out of 100`}>
            <span style={{ width: `${a.settled}%` }} />
          </div>
          <p className="meter-card__value">
            <span className="num">{a.settled}</span> of 100 settled
          </p>
          {a.link && <PlaysOutLink to={a.link} />}
        </li>
      ))}
    </ul>
  );
}
