import { stepReasons } from "../../data/architecture";
import { solutionSteps } from "../../data/story";
import { HoodLink } from "./HoodLink";
import "./Sections.css";

/** One row per pipeline step: who does it, why nothing heavier, what can go wrong and the guardrail, and how much is plain code. */
export function StepReasons() {
  return (
    <div className="table-wrap" data-tour="solution-steps-table">
      <table className="table reasons">
        <caption className="visually-hidden">Where we use agents and where we do not, step by step</caption>
        <thead>
          <tr>
            <th scope="col">Step</th>
            <th scope="col">What does it</th>
            <th scope="col">Why not something heavier</th>
            <th scope="col">What goes wrong, and the guardrail</th>
            <th scope="col">Done by code</th>
          </tr>
        </thead>
        <tbody>
          {stepReasons.map((r) => {
            const thinking = solutionSteps.find((s) => s.number === r.number)?.thinking;
            return (
              <tr key={r.number}>
                <th scope="row">
                  <span className="reasons__step">
                    <span className="num">{r.number}</span> {r.name}
                  </span>
                  {thinking && <HoodLink at={thinking} />}
                </th>
                <td>{r.doneBy}</td>
                <td>{r.whyNotHeavier}</td>
                <td>
                  <span className="reasons__fail">{r.failure}</span> {r.guardrail}
                </td>
                <td>
                  <div className="reasons__bar" role="meter" aria-label={`Share of ${r.name} done by code, an estimate`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={r.deterministic}>
                    <span style={{ width: `${r.deterministic}%` }} />
                  </div>
                  <span className="reasons__pct num">{r.deterministic}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="reasons__note">The code bar is an estimate of how much of each step needs no model.</p>
    </div>
  );
}
