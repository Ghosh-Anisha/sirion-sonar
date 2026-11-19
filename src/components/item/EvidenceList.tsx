import type { Evidence } from "../../logic/evidence";
import { clauseRef } from "../../logic/factFormat";
import { Field } from "../ui/Field";
import "./EvidenceList.css";

/** The facts behind an item. Contract facts show the sentence they come from and link to the contract. */
export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  return (
    <ul className="evidence">
      {evidence.map((e) => (
        <li key={`${e.label}-${e.value}`} className="evidence__item">
          <Field
            label={e.label}
            value={e.value}
            confidence={e.confidence}
            source={e.fact && e.contractId ? { text: clauseRef(e.fact), to: `/contract/${e.contractId}?fact=${e.fact.field}` } : undefined}
          />
          {e.fact && <blockquote className="evidence__quote">{e.fact.sentence}</blockquote>}
          {e.note && <p className="evidence__note">{e.note}</p>}
        </li>
      ))}
    </ul>
  );
}
