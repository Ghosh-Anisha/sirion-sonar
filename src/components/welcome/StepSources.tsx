import { Link } from "react-router-dom";
import { sources } from "../../data/sources";
import { SourceCard } from "./SourceCard";
import "./Welcome.css";

/** Step 3: connect the three sources, each read-only, each through its own consent screen. */
export function StepSources() {
  return (
    <div className="stack">
      <p>
        Sonar asks for read-only access to up to three places. One is enough to go on, and the rest can be added later. Pick every product the company uses for each, then allow them. Every
        connect is written to the <Link to="/access">access log</Link>.
      </p>
      <div className="source-grid">
        {sources.map((s) => (
          <SourceCard key={s.id} source={s} />
        ))}
      </div>
    </div>
  );
}
