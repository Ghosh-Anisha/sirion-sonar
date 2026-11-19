import { PILOT_SIZE } from "../../data/sources";
import { estimateMinutes, scopeSteps, spendShare } from "../../logic/pipeline";
import { firstReadPlan } from "../../state/firstReadPlan";
import { useOnboarding } from "../../state/OnboardingContext";
import "./Welcome.css";

const plan = firstReadPlan;
const OPTIONS = [
  { id: "pilot" as const, title: `Pilot on the top ${PILOT_SIZE} suppliers by spend`, steps: scopeSteps(plan, true, PILOT_SIZE) },
  { id: "all" as const, title: `All ${plan.steps.length} suppliers`, steps: scopeSteps(plan, false, PILOT_SIZE) },
];

/** Step 5: start with a pilot or with every supplier, with a rough idea of how long each takes. */
export function StepStart() {
  const { state, dispatch } = useOnboarding();
  const pilotOnly = state.approval.status === "approved" && state.approval.scope === "pilot";

  return (
    <div className="stack">
      <fieldset className="choices">
        <legend className="visually-hidden">Where to start</legend>
        {OPTIONS.map((o) => {
          const blocked = o.id === "all" && pilotOnly;
          return (
            <label key={o.id} className={`choice${state.start === o.id ? " choice--on" : ""}${blocked ? " choice--off" : ""}`}>
              <input
                type="radio"
                name="start"
                value={o.id}
                checked={state.start === o.id}
                disabled={blocked}
                onChange={() => dispatch({ type: "start", start: o.id })}
              />
              <span className="choice__body">
                <span className="choice__title">{o.title}</span>
                <span className="choice__line">
                  About <span className="num">{estimateMinutes(plan, o.steps)}</span> minutes for a real read.{" "}
                  {o.id === "pilot"
                    ? `Covers ${spendShare(plan, o.steps)}% of supplier spend, and the rest can follow once it looks right.`
                    : "Every supplier the company pays, in one go."}
                </span>
                {blocked && <span className="choice__line">IT approved a pilot only, so this needs IT to widen the access first.</span>}
              </span>
            </label>
          );
        })}
      </fieldset>
      <p className="muted">
        The estimate counts a second per payment line, 45 seconds to search for each supplier and 2 minutes to read each
        contract. The demo plays it back in a few seconds.
      </p>
    </div>
  );
}
