import { useState } from "react";
import { matrix } from "../data/caseStudy";
import "./Story.css";

/**
 * Latent versus blatant as a clean 2x2. Each problem is a dot; hover or focus one to read it.
 * Cost runs down the side, how visible the problem is runs along the top.
 */
export function ProblemMatrix() {
  const dots = matrix.flatMap((q) => q.problems.map((p, i) => ({ q, p, i })));
  const [active, setActive] = useState(0);
  const current = dots[active];
  return (
    <figure className="pmatrix" data-tour="story-matrix" aria-labelledby="pmatrix-caption">
      <figcaption id="pmatrix-caption" className="visually-hidden">
        Latent versus blatant: five problems. Use the dots to read each one.
      </figcaption>
      <div className="pmatrix__frame">
        <span className="pmatrix__axis pmatrix__axis--top label">Nobody complains</span>
        <span className="pmatrix__axis pmatrix__axis--top-right label">People complain</span>
        <span className="pmatrix__axis pmatrix__axis--side label">Costly</span>
        <span className="pmatrix__axis pmatrix__axis--side-low label">Less costly</span>
        <div className="pmatrix__grid">
          {matrix.map((q) => (
            <div key={q.id} className={`pmatrix__cell pmatrix__cell--${q.id}${q.problems.length === 0 ? " pmatrix__cell--empty" : ""}`}>
              <span className="pmatrix__title">{q.title}</span>
              <span className="pmatrix__dots">
                {dots
                  .filter((d) => d.q.id === q.id)
                  .map((d) => {
                    const n = dots.indexOf(d);
                    return (
                      <button
                        key={d.p.text}
                        type="button"
                        className={`pmatrix__dot${n === active ? " pmatrix__dot--on" : ""}`}
                        aria-label={d.p.text}
                        aria-pressed={n === active}
                        onMouseEnter={() => setActive(n)}
                        onFocus={() => setActive(n)}
                        onClick={() => setActive(n)}
                      />
                    );
                  })}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="pmatrix__reading" aria-live="polite">
        <span className="story-kicker">{current.q.title}</span>
        {current.p.text}.
      </p>
    </figure>
  );
}
