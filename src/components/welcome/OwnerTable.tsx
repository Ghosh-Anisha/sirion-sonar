import { people } from "../../data/people";
import { suggestedOwners } from "../../data/sources";
import { vendors } from "../../data/vendors";
import { proposedOwner } from "../../logic/owners";
import { firstReadPlan } from "../../state/firstReadPlan";
import { useOnboarding } from "../../state/OnboardingContext";
import { PROCUREMENT_LEAD } from "../../state/ViewerContext";
import "./Welcome.css";

const rows = firstReadPlan.steps.filter((s) => s.result === "none").map((s) => vendors.find((v) => v.id === s.vendorId)!);
const owners = people.filter((p) => p.role !== "it-admin");

/** The owner each supplier gets in the table: one set in the wizard, else the one proposed. */
export function useOwnerChoices(): Record<string, string | null> {
  const { state } = useOnboarding();
  return Object.fromEntries(rows.map((v) => [v.id, v.id in state.owners ? state.owners[v.id] : proposedOwner(v, suggestedOwners)]));
}

/** A quick table to give each supplier with no contract an owner. Two are left without one on purpose. */
export function OwnerTable() {
  const { dispatch } = useOnboarding();
  const chosen = useOwnerChoices();

  return (
    <section className="stack" style={{ gap: "var(--space-3)" }} aria-labelledby="owners-title">
      <h3 id="owners-title">Who owns each supplier</h3>
      <p className="muted">
        Filled in from the team that approved each supplier's bills. Two are left empty on purpose: their items go to{" "}
        {PROCUREMENT_LEAD.name}, the procurement lead, so nothing waits on nobody.
      </p>
      <div className="table-wrap">
        <table className="table">
          <caption className="visually-hidden">Owners for suppliers with no contract</caption>
          <thead>
            <tr>
              <th scope="col">Supplier</th>
              <th scope="col">Paid for</th>
              <th scope="col">Owner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id}>
                <th scope="row" className="owner-table__name">
                  {v.name}
                </th>
                <td>{v.category}</td>
                <td>
                  <select
                    className="owner-table__select"
                    aria-label={`Owner for ${v.name}`}
                    value={chosen[v.id] ?? ""}
                    onChange={(e) => dispatch({ type: "owners", owners: { [v.id]: e.target.value || null } })}
                  >
                    <option value="">No owner yet</option>
                    {owners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}, {p.title}
                      </option>
                    ))}
                  </select>
                  {chosen[v.id] === null && <span className="owner-table__note">Goes to {PROCUREMENT_LEAD.name}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
