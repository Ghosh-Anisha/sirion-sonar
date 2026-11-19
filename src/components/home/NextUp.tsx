import { actionLabel } from "../../logic/sentences";
import type { NeedsYouRow } from "../../state/useNeedsYou";
import { PROCUREMENT_LEAD } from "../../state/ViewerContext";
import { Badge } from "../ui/Badge";
import { ButtonLink } from "../ui/ButtonLink";
import { DueChip } from "./DueChip";
import { EscalatedPill } from "./EscalatedPill";
import "./NextUp.css";

const TITLE = { urgent: "Do this first", month: "Start here", later: "Next up" } as const;

/** The first item on the list, said plainly with its one action, so the next step is never a guess. */
export function NextUp({ row, urgentCount }: { row: NeedsYouRow; urgentCount: number }) {
  const { item, routing, sentence, group } = row;
  return (
    <section className={`next-up next-up--${group}`} aria-labelledby="next-up-title">
      <div className="next-up__text">
        <p id="next-up-title" className="next-up__title">
          {TITLE[group]}
          {urgentCount > 1 && <span className="next-up__more"> and {urgentCount - 1} more urgent below</span>}
        </p>
        <p className="next-up__sentence">{sentence}</p>
        <p className="next-up__meta">
          <Badge kind={item.type} />
          <DueChip daysLeft={routing.daysLeft} group={group} />
          {routing.escalated && <EscalatedPill leadName={PROCUREMENT_LEAD.name} />}
        </p>
      </div>
      <ButtonLink to={`/item/${encodeURIComponent(item.id)}`} variant="primary" className="next-up__action">
        {actionLabel(item)}
      </ButtonLink>
    </section>
  );
}
