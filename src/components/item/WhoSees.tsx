import { people } from "../../data/people";
import type { Item } from "../../logic/items";
import { ROLE_NAME, seenBecause } from "../../logic/roles";
import { Avatar } from "../layout/Avatar";
import { Card } from "../ui/Card";
import "./WhoSees.css";

/** Who this item reaches and why, so each role's view is plain on every item. */
export function WhoSees({ item }: { item: Item }) {
  return (
    <Card title="Who sees this" tour="item-who">
      <ul className="who-sees">
        {people.map((p) => {
          const why = seenBecause(item, p);
          return (
            <li key={p.id} className={why ? "who-sees__person" : "who-sees__person who-sees__person--no"}>
              <Avatar person={p} size={28} />
              <span className="who-sees__text">
                <span className="who-sees__name">
                  {p.name} <span className={`role-tag role-tag--${p.role}`}>{ROLE_NAME[p.role]}</span>
                </span>
                <span className="who-sees__why">{why ?? "Does not see it"}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
