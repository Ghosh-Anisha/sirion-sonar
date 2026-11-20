import { decisionLadder, modelVsAgent, redLine } from "../../data/architecture";
import "./Sections.css";

/** The decision rule as a ladder: reach for the lightest kind of work that does the job, and never let a model touch the red line. */
export function AgentLadder() {
  return (
    <div className="ladder" data-tour="solution-ladder">
      <ol className="ladder__rungs" aria-label="Which kind of work, lightest first">
        {decisionLadder.map((r, i) => (
          <li key={r.kind} className={`ladder__rung ladder__rung--${r.kind}`}>
            <span className="ladder__step num">{i + 1}</span>
            <span>
              <strong>{r.tool}</strong> {r.when}
            </span>
          </li>
        ))}
      </ol>
      <p className="ladder__note">{modelVsAgent}</p>
      <p className="ladder__red" role="note">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 2 14.5 13.5h-13ZM8 6.5v3M8 11.5v.01" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {redLine}
      </p>
    </div>
  );
}
