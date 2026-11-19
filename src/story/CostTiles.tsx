import { problem } from "../data/caseStudy";
import { PlaysOutLink } from "../components/case/PlaysOutLink";
import "./Story.css";

/** What the problem costs, one tile each, with a link to where the prototype shows it. */
export function CostTiles() {
  return (
    <ul className="cost-tiles" data-tour="problem-costs">
      {problem.costs.map((c, i) => (
        <li key={c.text} className="cost-tile">
          <span className="cost-tile__number num">{i + 1}</span>
          <p>{c.text}</p>
          <PlaysOutLink to={c.playsOut} />
        </li>
      ))}
    </ul>
  );
}
