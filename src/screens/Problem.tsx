import { problem } from "../data/caseStudy";
import { PlaysOutLink } from "../components/case/PlaysOutLink";
import "../components/case/Case.css";

/** The problem: who has it, what it costs, the assumption, and what evidence there is. */
export function Problem() {
  return (
    <div className="stack case">
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <p className="label">Case</p>
        <h1>The problem</h1>
        <p className="case-lead">{problem.summary}</p>
      </header>

      <div className="case-columns">
        <section className="case-card" aria-labelledby="who-title">
          <h2 id="who-title">Who has it</h2>
          <ul>
            {problem.who.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
        <section className="case-card" aria-labelledby="costs-title">
          <h2 id="costs-title">What it costs</h2>
          <ul className="case-list">
            {problem.costs.map((c) => (
              <li key={c.text}>
                <span>{c.text}</span>
                <PlaysOutLink to={c.playsOut} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="case-card case-card--assumption" aria-labelledby="assumption-title">
        <p className="label">What we assume</p>
        <h2 id="assumption-title">{problem.assumption.text}</h2>
        <PlaysOutLink to={problem.assumption.playsOut} />
      </section>

      <section className="stack" aria-labelledby="evidence-title">
        <h2 id="evidence-title">What evidence we have, and what we do not</h2>
        <div className="case-columns">
          <div className="case-card">
            <h3>We have</h3>
            <ul>
              {problem.evidenceHave.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div className="case-card case-card--gap">
            <h3>We do not have</h3>
            <ul>
              {problem.evidenceNot.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
