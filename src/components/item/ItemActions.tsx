import { actionOptions, actionPastTense } from "../../logic/actions";
import { formatDate } from "../../logic/format";
import type { ActionKind, Item } from "../../logic/items";
import { personName } from "../../state/useNeedsYou";
import { Button } from "../ui/Button";
import "./ItemActions.css";

interface ItemActionsProps {
  item: Item;
  onAct: (kind: ActionKind) => void;
}

/** The owner's choices for an item. Once one is made, it says who chose what and when. */
export function ItemActions({ item, onAct }: ItemActionsProps) {
  const options = actionOptions(item);
  if (options.length === 0) return null;

  if (item.action) {
    const who = personName.get(item.action.by) ?? item.action.by;
    return (
      <p className="item-actions__done" role="status">
        {who} {actionPastTense(item.action.kind)} on <span className="num">{formatDate(item.action.on)}</span>.
      </p>
    );
  }

  return (
    <div className="item-actions">
      <div className="row">
        {options.map((o, i) => (
          <Button key={o.kind} variant={i === 0 && item.type === "decide" ? "primary" : "secondary"} onClick={() => onAct(o.kind)}>
            {o.label}
          </Button>
        ))}
      </div>
      {options.some((o) => o.note) && (
        <ul className="item-actions__notes">
          {options
            .filter((o) => o.note)
            .map((o) => (
              <li key={o.kind}>
                <strong>{o.label}.</strong> {o.note}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
