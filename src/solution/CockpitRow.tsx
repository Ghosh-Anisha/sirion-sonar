import type { NeedsYouRow } from "../state/useNeedsYou";
import { DueChip } from "../components/home/DueChip";
import { Badge } from "../components/ui/Badge";
import { useLit } from "./LitContext";

/** One item in the cockpit, with the same badge, sentence and due chip as on Home. */
export function CockpitRow({ row }: { row: NeedsYouRow }) {
  const lit = useLit(`cockpit-${row.item.id}`);
  return (
    <li className={`cockpit__row cockpit__row--${row.group}${lit ? " cockpit__row--lit" : ""}`}>
      <span className="row" style={{ gap: "var(--space-1)" }}>
        <Badge kind={row.item.type} />
        <DueChip daysLeft={row.routing.daysLeft} group={row.group} />
      </span>
      <span className="cockpit__sentence">{row.sentence}</span>
    </li>
  );
}
