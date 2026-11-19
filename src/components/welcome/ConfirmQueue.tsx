import { useMemo } from "react";
import { Link } from "react-router-dom";
import { contracts } from "../../data/contracts";
import { confirmEdits, datesToConfirm } from "../../logic/confirmQueue";
import { fieldLabel, formatFactValue } from "../../logic/factFormat";
import { formatDate } from "../../logic/format";
import { useDemoState } from "../../state/DemoStateContext";
import { useLedger } from "../../state/useLedger";
import { useOnboarding } from "../../state/OnboardingContext";
import { vendorName } from "../../state/useNeedsYou";
import { useViewer } from "../../state/ViewerContext";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import "./Welcome.css";

/** The riskiest dates, earliest deadline first, each a yes or a look at the contract. */
export function ConfirmQueue() {
  const { paid, today } = useLedger();
  const { state, dispatch } = useOnboarding();
  const demo = useDemoState();
  const { viewer } = useViewer();
  const queue = useMemo(() => datesToConfirm(contracts, today, paid), [today, paid]);

  const confirm = (contractId: string, facts: (typeof queue)[number]["facts"]) => {
    dispatch({ type: "confirm", contractId, edits: confirmEdits(facts, viewer.id, today) });
    for (const fact of facts) {
      demo.dispatch({
        type: "edit-fact",
        contractId,
        field: fact.field,
        edit: { kind: "confirmed", value: fact.value, by: viewer.id, on: today },
        text: `confirmed the ${fieldLabel(fact.field).toLowerCase()}, ${formatFactValue(fact)}.`,
      });
    }
  };

  return (
    <section className="stack" style={{ gap: "var(--space-3)" }} aria-labelledby="confirm-title">
      <h3 id="confirm-title">Confirm the riskiest dates</h3>
      <p className="muted">
        These notice deadlines come first, and nobody has checked them yet. Each one is a yes, or a look at the contract. A
        yes turns the date from Derived to Confirmed.
      </p>
      <ol className="confirm-queue">
        {queue.map((d) => {
          const done = d.contract.id in state.confirmed;
          return (
            <li key={d.contract.id} className="confirm-queue__row">
              <div className="confirm-queue__text">
                <p>
                  <strong>{vendorName.get(d.contract.vendorId)}</strong>, notice deadline{" "}
                  <strong className="num">{formatDate(d.deadline)}</strong>
                </p>
                <p className="muted">
                  From {d.facts.map((f) => `${fieldLabel(f.field).toLowerCase()} ${formatFactValue(f)}`).join(", ")}.
                </p>
              </div>
              <Badge kind={done ? "confirmed" : d.label} />
              <div className="row confirm-queue__actions">
                {done ? (
                  <span className="muted">Confirmed</span>
                ) : (
                  <>
                    <Button variant="primary" onClick={() => confirm(d.contract.id, d.facts)}>
                      Yes, that is right
                    </Button>
                    <Link to={`/contract/${d.contract.id}?fact=${d.facts[0].field}`}>Check the contract</Link>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
