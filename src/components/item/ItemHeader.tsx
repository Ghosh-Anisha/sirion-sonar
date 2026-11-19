import { itemTitle } from "../../logic/actions";
import { formatDate } from "../../logic/format";
import { reasonLabel } from "../../logic/sentences";
import type { NeedsYouRow } from "../../state/useNeedsYou";
import { PROCUREMENT_LEAD } from "../../state/ViewerContext";
import { Badge } from "../ui/Badge";
import { DueChip } from "../home/DueChip";
import { EscalatedPill } from "../home/EscalatedPill";
import { WhyLink } from "../guide/WhyLink";
import { ThinkingBadge } from "../thinking/ThinkingBadge";

/** The item's type, title, sentence and who it is with. */
export function ItemHeader({ row, vendorName }: { row: NeedsYouRow; vendorName: string }) {
  const { item, routing, sentence, ownerName, group } = row;
  return (
    <header className={`item-screen__header item-screen__header--${group}`} data-tour="item-header">
      <div className="row">
        <Badge kind={item.type} />
        {routing.urgent && <Badge kind="urgent" />}
        <DueChip daysLeft={routing.daysLeft} group={group} />
        {routing.escalated && <EscalatedPill leadName={PROCUREMENT_LEAD.name} />}
        <ThinkingBadge at="item.routing" />
      </div>
      <h1>
        {vendorName}: {itemTitle(item).toLowerCase()}
      </h1>
      <p className="item-screen__sentence">
        {sentence} <WhyLink at={`home.${item.type}`} />
      </p>
      <p className="item-screen__meta">
        <span>{reasonLabel(item.reason)}</span>
        <span>
          Due <span className="num">{formatDate(item.dueDate)}</span>
        </span>
        <span>{ownerName ? `Owner: ${ownerName}` : `No owner, so it is with ${PROCUREMENT_LEAD.name}`}</span>
      </p>
    </header>
  );
}
