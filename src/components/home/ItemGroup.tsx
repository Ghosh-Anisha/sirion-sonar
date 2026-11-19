import type { NeedsYouRow } from "../../state/useNeedsYou";
import { ItemRow } from "./ItemRow";
import "./ItemGroup.css";

interface ItemGroupProps {
  id: string;
  title: string;
  hint: string;
  rows: NeedsYouRow[];
}

/** A titled block of the Needs you list. Hidden when empty. */
export function ItemGroup({ id, title, hint, rows }: ItemGroupProps) {
  if (rows.length === 0) return null;
  return (
    <section className={`item-group item-group--${id}`} aria-labelledby={`group-${id}`}>
      <header className="item-group__header">
        <h2 id={`group-${id}`}>
          {title} <span className="item-group__count num">{rows.length}</span>
        </h2>
        <p className="muted">{hint}</p>
      </header>
      <ul className="item-group__list">
        {rows.map((row) => (
          <ItemRow key={row.item.id} row={row} />
        ))}
      </ul>
    </section>
  );
}
