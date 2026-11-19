import { formatDate } from "../../logic/format";
import { actionLabel } from "../../logic/sentences";
import type { NeedsYouRow } from "../../state/useNeedsYou";
import { DueChip } from "../home/DueChip";
import "./NextStep.css";

/** The one thing to do and the date to do it by, in the item's urgency color. Gone once someone has acted. */
export function NextStep({ row }: { row: NeedsYouRow }) {
  const { item, routing, group } = row;
  if (item.action) return null;
  return (
    <div className={`next-step next-step--${group}`}>
      <span className="label">Next step</span>
      <strong>
        {actionLabel(item)} by <span className="num">{formatDate(item.dueDate)}</span>
      </strong>
      <DueChip daysLeft={routing.daysLeft} group={group} />
    </div>
  );
}
