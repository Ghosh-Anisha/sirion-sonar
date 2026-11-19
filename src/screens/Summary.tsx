import { Link } from "react-router-dom";
import { moments } from "../data/journey";
import { Icon } from "../components/ui/Icon";
import { useJourney } from "../state/useJourney";
import "../components/guide/Guide.css";

const READ_MORE = [
  { to: "/why", text: "Why intake", line: "The four tests and where the money is." },
  { to: "/architecture", text: "How it works", line: "The eight steps, the five agents and where data lives." },
  { to: "/stakeholders", text: "Stakeholders", line: "Who wants what, and where they pull apart." },
];

/** The end of the journey: what the viewer saw, and where to read the reasoning behind it. */
export function Summary() {
  const { done, count } = useJourney();
  return (
    <div className="stack summary">
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>What you saw</h1>
        <p className="muted">
          <span className="num">{count}</span> of <span className="num">{moments.length}</span> moments of the story. Rows 1 to 8
          are the intake product. Row 9 is where Sirion takes over.
        </p>
      </header>
      <ol className="summary__list">
        {moments.map((m) => (
          <li key={m.id} className={`summary__row${done[m.id] ? " summary__row--done" : ""}`}>
            <span className="summary__mark">
              {done[m.id] ? <Icon name="confirmed" size={14} /> : null}
              <span>{done[m.id] ? "Seen" : "Not seen yet"}</span>
            </span>
            <div>
              <h2 className="summary__name">{m.name}</h2>
              <p>{m.saw}</p>
            </div>
          </li>
        ))}
      </ol>
      <section className="stack" aria-labelledby="read-more-title">
        <h2 id="read-more-title">The reasoning behind it</h2>
        <ul className="summary__links">
          {READ_MORE.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.text}</Link>
              <span className="muted">{l.line}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
