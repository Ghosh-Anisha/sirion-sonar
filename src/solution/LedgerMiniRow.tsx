import type { Label } from "../data/types";
import { formatShortDate } from "../logic/format";
import { Badge } from "../components/ui/Badge";
import { useLit } from "./LitContext";

/** One row of the mini ledger: supplier, notice deadline and label. Lights up when the example looks it up. */
export function LedgerMiniRow({ id, supplier, deadline, label }: { id: string; supplier: string; deadline: string | null; label: Label }) {
  const lit = useLit(`ledger-${id}`);
  return (
    <span className={`ledger-mini__row${lit ? " ledger-mini__row--lit" : ""}`}>
      <span>{supplier}</span>
      <span className="num">{deadline ? formatShortDate(deadline) : "Not known"}</span>
      <Badge kind={label} />
    </span>
  );
}
