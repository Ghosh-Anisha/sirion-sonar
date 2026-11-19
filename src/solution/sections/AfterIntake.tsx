import { afterIntake } from "../../data/architecture";
import { AskPanel } from "./AskPanel";
import "./Sections.css";

/** The 7th stage, below the diagram: what Sonar hands over, and where Sirion picks up. Clearly the pitch, not built. */
export function AfterIntake() {
  return (
    <div className="after">
      <div className="after__handoff" aria-hidden="true">
        <svg viewBox="0 0 24 40" width="24" height="40">
          <path className="flow-arrow__line" d="M12 2v32" />
          <path d="M6 28l6 8 6-8" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="after__handoff-label">{afterIntake.handoffTitle}</span>
      </div>
      <div className="after__panel">
        <div className="after__top">
          <div>
            <p className="after__title">
              <span className="num">7</span> {afterIntake.title}
            </p>
            <span className="after__badge">{afterIntake.badge}</span>
          </div>
          <p className="after__pitch" role="note">
            {afterIntake.pitch}
          </p>
        </div>
        <div className="after__grid">
          <div>
            <p className="label">{afterIntake.handoffTitle}</p>
            <ul className="after__pack">
              {afterIntake.handoff.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <ul className="after__caps" aria-label="What Sirion adds">
            {afterIntake.capabilities.map((c) => (
              <li key={c.name} className="after__cap">
                <strong>{c.name}</strong>
                <span>{c.line}</span>
              </li>
            ))}
          </ul>
        </div>
        <AskPanel />
        <p className="after__closing">{afterIntake.closing}</p>
      </div>
    </div>
  );
}
