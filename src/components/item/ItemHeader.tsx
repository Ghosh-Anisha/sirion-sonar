import { itemTitle } from "../../logic/actions";
import { formatDate } from "../../logic/format";
import { reasonLabel } from "../../logic/sentences";
import type { NeedsYouRow } from "../../state/useNeedsYou";
import { PROCUREMENT_LEAD } from "../../state/ViewerContext";
import { Badge } from "../ui/Badge";
import { ThinkingBadge } from "../thinking/ThinkingBadge";

/** The item's type, title, sentence and who it is with. */
export function ItemHeader({ row, vendorName }: { row: NeedsYouRow; vendorName: string }) {
  const { item, routing, sentence, ownerName } = row;
  return (
    <header className="item-screen__header">
      <div className="row">
        <Badge kind={item.type} />
        {routing.urgent && <Badge kind="urgent" />}
        <ThinkingBadge at="item.routing" />
      </div>
      <h1>
        {vendorName}: {itemTitle(item).toLowerCase()}
      </h1>
      <p className="item-screen__sentence">{sentence}</p>
      <p className="item-screen__meta">
        <span>{reasonLabel(item.reason)}</span>
        <span>
          Due <span className="num">{formatDate(item.dueDate)}</span>
        </span>
        <span>{ownerName ? `Owner: ${ownerName}` : `No owner, so it is with ${PROCUREMENT_LEAD.name}`}</span>
        {routing.escalated && <span className="item-screen__escalated">No action yet, also sent to {PROCUREMENT_LEAD.name}</span>}
      </p>
    </header>
  );
}
