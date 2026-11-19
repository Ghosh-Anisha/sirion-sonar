import { ConfirmQueue } from "./ConfirmQueue";
import { OwnerTable } from "./OwnerTable";
import "./Welcome.css";

/** Step 8: give each supplier with no contract an owner, then confirm the riskiest dates. */
export function StepOwners() {
  return (
    <div className="stack" style={{ gap: "var(--space-8)" }}>
      <OwnerTable />
      <ConfirmQueue />
    </div>
  );
}
