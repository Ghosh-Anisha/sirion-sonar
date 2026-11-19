import { intakeTests, otherStagesLose } from "../data/caseStudy";
import { LatentMatrix } from "../components/case/LatentMatrix";
import { PlaysOutLink } from "../components/case/PlaysOutLink";
import "../components/case/Case.css";

/** Why intake: the four tests, the latent versus blatant matrix, and why the other stages lose. */
export function Why() {
  return (
    <div className="stack case">
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <p className="label">Case</p>
        <h1>Why intake</h1>
        <p className="muted">
          Intake is the one stage every supplier request has to pass through, new or old. Four tests make the argument.
        </p>
      </header>

      <section className="stack" aria-labelledby="tests-title">
        <h2 id="tests-title">The four tests</h2>
        <ul className="case-cards">
          {intakeTests.map((t) => (
            <li key={t.name} className="case-card">
              <h3>{t.name}</h3>
              <p>{t.why}</p>
              <PlaysOutLink to={t.playsOut} />
            </li>
          ))}
        </ul>
        <p className="case-line">{otherStagesLose}</p>
      </section>

      <section className="stack" aria-labelledby="matrix-title">
        <h2 id="matrix-title">Latent versus blatant</h2>
        <p className="muted">
          The prototype leads with the top left, because that is where the money is. The bottom right is how people reach it.
        </p>
        <LatentMatrix />
        <p className="case-source">The placements are read from the text of the spec, where the matrix itself is a picture.</p>
      </section>
    </div>
  );
}
