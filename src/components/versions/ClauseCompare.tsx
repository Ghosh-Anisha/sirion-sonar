import type { ClauseChange } from "../../logic/redline";
import { Redline } from "./Redline";
import "./Versions.css";

interface ClauseCompareProps {
  changes: ClauseChange[];
  originalTitle: string;
  amendmentTitle: string;
}

const TAG: Record<ClauseChange["status"], string> = {
  same: "No change",
  changed: "Changed",
  added: "New clause",
  removed: "Removed",
};

/** The original and the amendment side by side, clause by clause, with the amended side as a redline. */
export function ClauseCompare({ changes, originalTitle, amendmentTitle }: ClauseCompareProps) {
  return (
    <div data-tour="versions-redline" className="compare" role="table" aria-label={`${originalTitle} compared with ${amendmentTitle}`}>
      <div className="compare__row compare__head" role="row">
        <span role="columnheader">{originalTitle}</span>
        <span role="columnheader">{amendmentTitle}</span>
      </div>
      {changes.map((c) => (
        <div key={c.id} className={`compare__row compare__row--${c.status}`} role="row">
          <div role="cell" className="compare__cell">
            <h4>
              {c.id}. {c.heading}
            </h4>
            <p>{c.before ?? "Not in this version."}</p>
          </div>
          <div role="cell" className="compare__cell">
            <h4>
              {c.id}. {c.heading} <span className={`compare__tag compare__tag--${c.status}`}>{TAG[c.status]}</span>
            </h4>
            <p>{c.status === "same" ? c.after : <Redline parts={c.parts} />}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
