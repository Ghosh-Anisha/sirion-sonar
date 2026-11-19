import { Link } from "react-router-dom";
import { formatDate } from "../../logic/format";
import { actionLabel, reasonLabel } from "../../logic/sentences";
import { PROCUREMENT_LEAD } from "../../state/ViewerContext";
import type { NeedsYouRow } from "../../state/useNeedsYou";
import { Badge } from "../ui/Badge";
import { ButtonLink } from "../ui/ButtonLink";
import { WhyLink } from "../guide/WhyLink";
import { ThinkingBadge } from "../thinking/ThinkingBadge";
import "./ItemRow.css";

/** One line on the Needs you list: a sentence, its type, why it is here, when it is due and whose it is. */
export function ItemRow({ row }: { row: NeedsYouRow }) {
  const { item, routing, sentence, ownerName } = row;
  const href = `/item/${encodeURIComponent(item.id)}`;
  const leadName = PROCUREMENT_LEAD.name;

  return (
    <li className="item-row" data-tour="item-row">
      <div className="item-row__badges" data-tour="item-badges">
        <Badge kind={item.type} />
        {routing.urgent && <Badge kind="urgent" />}
        <ThinkingBadge at={`home.${item.type}`} />
      </div>
      <div className="item-row__body">
        <Link to={href} className="item-row__sentence">
          {sentence}
        </Link>
        <p className="item-row__meta">
          <span>{reasonLabel(item.reason)}</span>
          <span>
            Due <span className="num">{formatDate(item.dueDate)}</span>
          </span>
          <span data-tour="item-owner">{ownerName ?? `No owner, sent to ${leadName}`}</span>
          <WhyLink at={`home.${item.type}`} />
          {routing.escalated && <span className="item-row__escalated" data-nudge="escalated">No action yet, also sent to {leadName}</span>}
        </p>
      </div>
      <ButtonLink to={href} variant="primary" className="item-row__action" data-nudge={`item:${item.id}`} aria-label={`${actionLabel(item)}: ${sentence}`}>
        {actionLabel(item)}
      </ButtonLink>
    </li>
  );
}
