import { matrix } from "../data/caseStudy";
import { PlaysOutLink } from "../components/case/PlaysOutLink";
import "./Story.css";

/**
 * Latent versus blatant as a clean 2x2. Cost runs down the side, how visible the problem is runs along the top,
 * and each quadrant lists its problems in plain words with a link to where the prototype shows them.
 */
export function ProblemMatrix() {
  return (
    <figure className="pmatrix" data-tour="story-matrix" aria-labelledby="pmatrix-caption">
      <figcaption id="pmatrix-caption" className="visually-hidden">
        Latent versus blatant: five problems in two quadrants, by cost and by whether people complain about them.
      </figcaption>
      <div className="pmatrix__frame">
        <span className="pmatrix__axis pmatrix__axis--top label">Nobody complains</span>
        <span className="pmatrix__axis pmatrix__axis--top-right label">People complain</span>
        <span className="pmatrix__axis pmatrix__axis--side label">Costly</span>
        <span className="pmatrix__axis pmatrix__axis--side-low label">Less costly</span>
        <div className="pmatrix__grid">
          {matrix.map((q) => (
            <section key={q.id} className={`pmatrix__cell pmatrix__cell--${q.id}${q.problems.length === 0 ? " pmatrix__cell--empty" : ""}`} aria-label={q.title}>
              <p className="pmatrix__title">{q.title}</p>
              {q.problems.length === 0 ? (
                <p className="muted">Nothing from the brief sits here.</p>
              ) : (
                <ul className="pmatrix__problems">
                  {q.problems.map((p) => (
                    <li key={p.text} className="pmatrix__problem">
                      <span>{p.text}</span>
                      <PlaysOutLink to={p.playsOut} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </figure>
  );
}
