import { backend } from "../../data/architecture";
import "./Sections.css";

/** How it runs: one isolated environment per customer, left to right, with the cross cutting parts underneath. */
export function BackendDiagram() {
  return (
    <div className="backend" data-tour="solution-backend">
      <figure className="backend__figure" aria-labelledby="backend-caption">
        <figcaption id="backend-caption" className="backend__box-label">
          {backend.boxLabel}. Numbered in the order data flows.
        </figcaption>
        <ol className="backend__flow">
          {backend.flow.map((n) => (
            <li key={n.id} className={`backend__node backend__node--${n.id}`}>
              <strong>{n.name}</strong>
              <ul>
                {n.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <ul className="backend__band" aria-label="Across every step">
          {backend.crossCutting.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </figure>
      <div className="backend__explainers">
        {backend.explainers.map((e, i) => (
          <section key={e.title} className="backend__explainer" aria-label={e.title}>
            <p className="backend__explainer-title">{e.title}</p>
            {i === 0 && (
              <ol className="backend__states" aria-label="Workflow states per vendor">
                {backend.states.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            )}
            <ul>
              {e.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
