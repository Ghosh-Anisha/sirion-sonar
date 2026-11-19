import { assumptions } from "../data/caseStudy";
import { PlaysOutLink } from "../components/case/PlaysOutLink";
import "../components/case/Case.css";

/** What the case assumes, and what is not settled. The least settled one is marked. */
export function Assumptions() {
  return (
    <div className="stack case">
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <p className="label">Case</p>
        <h1>Assumptions</h1>
        <p className="muted">What the case takes as true without proof, and where each one shows up in the prototype.</p>
      </header>
      <ol className="assumptions" data-tour="assumptions-list">
        {assumptions.map((a) => (
          <li key={a.text} className={`assumption${a.leastSettled ? " assumption--open" : ""}`} data-tour={a.leastSettled ? "assumption-open" : undefined}>
            {a.leastSettled && <p className="assumption__flag label">Least settled</p>}
            <p>{a.text}</p>
            <PlaysOutLink to={a.playsOut} />
          </li>
        ))}
      </ol>
    </div>
  );
}
