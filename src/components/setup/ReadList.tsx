import type { ContractStatus } from "../../data/types";
import type { ReadStep } from "../../logic/firstRead";
import { formatMoney } from "../../logic/format";
import { Badge } from "../ui/Badge";
import "./Setup.css";

const RESULT: Record<ContractStatus, string> = { full: "Found", partial: "Partial", none: "Not found" };

/** Suppliers searched and read so far, highest spend first. Not found ones become Find items on Home. */
export function ReadList({ steps }: { steps: ReadStep[] }) {
  return (
    <ol className="read-list">
      {steps.map((s) => (
        <li key={s.vendorId} className="read-list__row">
          <span className="read-list__name">{s.vendorName}</span>
          <span className="read-list__spend num">{formatMoney(s.spend)}</span>
          <span className={`read-list__result read-list__result--${s.result}`}>
            {RESULT[s.result]}
            {s.result === "none" && <Badge kind="find" />}
          </span>
          <span className="read-list__note">{s.note}</span>
        </li>
      ))}
    </ol>
  );
}
