import { Link } from "react-router-dom";
import { actionLabel, reasonLabel } from "../../logic/sentences";
import { PROCUREMENT_LEAD } from "../../state/ViewerContext";
import type { NeedsYouRow } from "../../state/useNeedsYou";
import { WhyLink } from "../guide/WhyLink";
import { ThinkingBadge } from "../thinking/ThinkingBadge";
import { Badge } from "../ui/Badge";
import { ButtonLink } from "../ui/ButtonLink";
import { DueChip } from "./DueChip";
import { EscalatedPill } from "./EscalatedPill";
import "./ItemRow.css";

/** One line on the Needs you list: its type, a sentence, how close it is, whose it is, and the one thing to do. */
export function ItemRow({ row }: { row: NeedsYouRow }) {
  const { item, routing, sentence, ownerName, group } = row;
  const href = `/item/${encodeURIComponent(item.id)}`;
  const leadName = PROCUREMENT_LEAD.name;

  return (
    <li className={`item-row item-row--${group}`} data-tour="item-row">
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
          <DueChip daysLeft={routing.daysLeft} group={group} />
          {routing.escalated && (
            <span data-nudge="escalated">
              <EscalatedPill leadName={leadName} />
            </span>
          )}
          <span>{reasonLabel(item.reason)}</span>
          <span data-tour="item-owner">{ownerName ?? `No owner, sent to ${leadName}`}</span>
          <WhyLink at={`home.${item.type}`} />
        </p>
      </div>
      <ButtonLink to={href} variant="primary" className="item-row__action" data-nudge={`item:${item.id}`} aria-label={`${actionLabel(item)}: ${sentence}`}>
        {actionLabel(item)}
      </ButtonLink>
    </li>
  );
}
