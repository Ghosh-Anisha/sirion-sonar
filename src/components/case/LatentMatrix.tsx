import { Fragment } from "react";
import { matrix } from "../../data/caseStudy";
import { PlaysOutLink } from "./PlaysOutLink";
import "./Case.css";

/** A real 2x2: cost down the side, how visible the problem is along the top. */
export function LatentMatrix() {
  return (
    <figure className="matrix" aria-labelledby="matrix-caption">
      <figcaption id="matrix-caption" className="visually-hidden">
        Latent versus blatant: five problems in two quadrants
      </figcaption>
      <div className="matrix__grid">
        <span className="matrix__corner" aria-hidden="true" />
        <span className="matrix__col label">Latent: nobody complains</span>
        <span className="matrix__col label">Blatant: people complain</span>
        {(["costly", "cheap"] as const).map((row) => (
          <Fragment key={row}>
            <span className="matrix__row label">{row === "costly" ? "Costly" : "Less costly"}</span>
            {matrix
              .filter((q) => q.row === row)
              .map((q) => (
                <section key={q.id} className={`quadrant${q.problems.length === 0 ? " quadrant--empty" : ""}`} aria-labelledby={`q-${q.id}`}>
                  <h3 id={`q-${q.id}`}>{q.title}</h3>
                  <p className="muted">{q.note}</p>
                  {q.problems.length > 0 && (
                    <ul className="quadrant__problems">
                      {q.problems.map((p) => (
                        <li key={p.text}>
                          <span>{p.text}</span>
                          <PlaysOutLink to={p.playsOut} />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
          </Fragment>
        ))}
      </div>
    </figure>
  );
}
