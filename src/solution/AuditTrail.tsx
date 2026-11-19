import { contracts } from "../data/contracts";
import { people } from "../data/people";
import { solution } from "../data/story";
import { fieldLabel, formatFactValue } from "../logic/factFormat";
import { actionPastTense } from "../logic/actions";
import { formatDate } from "../logic/format";
import { useDemoState } from "../state/DemoStateContext";
import { vendorName } from "../state/useNeedsYou";
import "./Solution.css";

const cloudmetric = contracts.find((c) => c.id === "cloudmetric-subscription")!;
const notice = cloudmetric.facts.find((f) => f.field === "noticeDays")!;
const checked = contracts.flatMap((c) => c.facts.map((f) => ({ c, f }))).find(({ f }) => f.confirmedBy)!;

/** Every fact keeps its chain: the sentence, the fact, its label, who confirmed it, and the decision made on it. Hover or focus a pill for a real example. */
export function AuditTrail() {
  const { state } = useDemoState();
  const decided = Object.entries(state.actions).find(([id, a]) => id.startsWith("decide:") && ["renew", "renegotiate", "end"].includes(a.kind));
  const examples = [
    `"${notice.sentence}"`,
    `${fieldLabel(notice.field)}: ${formatFactValue(notice)}, from the Cloudmetric contract.`,
    `${notice.label === "confirmed" ? "Confirmed" : "Derived"}: read from the file, and Derived until an owner checks it.`,
    `${people.find((p) => p.id === checked.f.confirmedBy)?.name} confirmed the ${fieldLabel(checked.f.field).toLowerCase()} for ${vendorName.get(checked.c.vendorId)}.`,
    decided
      ? `${people.find((p) => p.id === decided[1].by)?.name} ${actionPastTense(decided[1].kind)} on ${formatDate(decided[1].on)}.`
      : "The owner picks renew, renegotiate or end, and the log keeps who chose and when.",
  ];
  return (
    <div className="audit" data-tour="solution-audit">
      <p className="story-kicker">{solution.audit.title}</p>
      <ol className="audit__chain">
        {solution.audit.pills.map((pill, i) => (
          <li key={pill} className="audit__item">
            <button type="button" className="audit__pill" aria-describedby={`audit-${i}`}>
              {pill}
            </button>
            <span id={`audit-${i}`} role="tooltip" className="audit__tip">
              {examples[i]}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
