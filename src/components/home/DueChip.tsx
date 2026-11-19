import type { UrgencyGroup } from "../../logic/alerts";
import { dueIn } from "../../logic/sentences";
import { Icon } from "../ui/Icon";
import "./DueChip.css";

/** How close an item is, in words and color: red when urgent, amber within the month, grey after that. */
export function DueChip({ daysLeft, group }: { daysLeft: number; group: UrgencyGroup }) {
  return (
    <span className={`due-chip due-chip--${group}`}>
      {group === "urgent" && <Icon name="urgent" />}
      <span className="num">{dueIn(daysLeft)}</span>
    </span>
  );
}
