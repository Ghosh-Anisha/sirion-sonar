import { PILOT_SIZE } from "../../data/sources";
import { approveEntry } from "../../logic/accessText";
import { formatMoney } from "../../logic/format";
import { scopeSteps, spendShare } from "../../logic/pipeline";
import { firstReadPlan } from "../../state/firstReadPlan";
import { useActor } from "../../state/useActor";
import { useOnboarding } from "../../state/OnboardingContext";
import { Button } from "../ui/Button";
import "./Welcome.css";

const pilot = scopeSteps(firstReadPlan, true, PILOT_SIZE);
const share = spendShare(firstReadPlan, pilot);

/** The IT admin's side: what is asked, and two ways to answer it. */
export function AccessReview({ request }: { request: string[] }) {
  const { state, dispatch } = useOnboarding();
  const actor = useActor();
  const { approval } = state;
  const approve = (scope: "full" | "pilot") => dispatch({ type: "approve", scope, entry: approveEntry(scope, PILOT_SIZE, actor) });
  const chosen = approval.status === "approved" ? approval.scope : null;

  return (
    <section className="review" aria-labelledby="review-title">
      <p className="label">IT admin view</p>
      <h3 id="review-title">What is asked</h3>
      <ul>
        {request.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p>
        That reaches the files and mail of all <span className="num">{firstReadPlan.steps.length}</span> suppliers on the
        vendor list.
      </p>

      <div className="review__options">
        <div className={`review__option${chosen === "full" ? " review__option--on" : ""}`}>
          <h4 className="review__option-title">Approve as asked</h4>
          <p className="muted">Sonar reads for every supplier from the start.</p>
          <Button variant={chosen === "full" ? "primary" : "secondary"} onClick={() => approve("full")} aria-pressed={chosen === "full"}>
            {chosen === "full" ? "Approved as asked" : "Approve as asked"}
          </Button>
        </div>
        <div className={`review__option${chosen === "pilot" ? " review__option--on" : ""}`}>
          <h4 className="review__option-title">Narrow it to a pilot</h4>
          <p className="muted">
            Only the top <span className="num">{PILOT_SIZE}</span> suppliers by spend, {share}% of what the company pays them.
            Widen it once the pilot shows what Sonar opens.
          </p>
          <Button variant={chosen === "pilot" ? "primary" : "secondary"} onClick={() => approve("pilot")} aria-pressed={chosen === "pilot"}>
            {chosen === "pilot" ? "Approved for the pilot" : "Approve the pilot only"}
          </Button>
        </div>
      </div>
      <details className="review__pilot">
        <summary>The {PILOT_SIZE} suppliers in the pilot</summary>
        <ol>
          {pilot.map((s) => (
            <li key={s.vendorId}>
              {s.vendorName}, <span className="num">{formatMoney(s.spend)}</span>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
