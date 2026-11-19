import { useState } from "react";
import { contracts } from "../../data/contracts";
import { emails } from "../../data/emails";
import { payments } from "../../data/payments";
import { controlsFor, sampleDocs } from "../../logic/dataControls";
import { Icon } from "../../components/ui/Icon";
import "./Sections.css";

const docs = sampleDocs(contracts, emails, payments.length);

/** Pick a sample document and see how it is classified and which controls apply. */
export function DocControlsPanel() {
  const [id, setId] = useState(docs[0].id);
  const doc = docs.find((d) => d.id === id)!;
  const result = controlsFor(doc.kind);
  return (
    <div className="doc-panel" data-tour="solution-doc-panel">
      <label className="doc-panel__pick">
        <span className="label">Pick a sample document</span>
        <select value={id} onChange={(e) => setId(e.target.value)}>
          {docs.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      <div className="doc-panel__result" aria-live="polite">
        <p>
          <span className={`doc-panel__class doc-panel__class--${result.classification.toLowerCase()}`}>{result.classification}</span> {result.why}
        </p>
        <ul className="doc-panel__controls">
          {result.controls.map((c) => (
            <li key={c.control} className={c.applies ? "" : "doc-panel__control--off"}>
              <span className="doc-panel__mark">
                {c.applies ? <Icon name="confirmed" /> : null}
                <span>{c.applies ? "Applies" : "Not needed"}</span>
              </span>
              <span>
                <strong>{c.control}.</strong> {c.how}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
