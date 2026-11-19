import type { UrgencyGroup } from "../../logic/alerts";
import type { NeedsYouRow } from "../../state/useNeedsYou";
import { Icon, type IconName } from "../ui/Icon";
import "./StatTiles.css";

interface Tile {
  id: string;
  label: string;
  value: number;
  icon: IconName;
  tone: "urgent" | "check" | "decide" | "find";
  /** The group on the list to jump to, if any. */
  group?: UrgencyGroup;
}

function jump(group: UrgencyGroup) {
  document.getElementById(`group-${group}`)?.scrollIntoView({ block: "start" });
}

/** The list at a glance: how many are urgent, due this month, later, and paid with no contract. Each jumps to its group. */
export function StatTiles({ rows }: { rows: NeedsYouRow[] }) {
  const count = (g: UrgencyGroup) => rows.filter((r) => r.group === g).length;
  const tiles: Tile[] = [
    { id: "urgent", label: "Urgent", value: count("urgent"), icon: "urgent", tone: "urgent", group: "urgent" },
    { id: "month", label: "Due this month", value: count("month"), icon: "check", tone: "check", group: "month" },
    { id: "later", label: "Later", value: count("later"), icon: "decide", tone: "decide", group: "later" },
    { id: "find", label: "Paid with no contract", value: rows.filter((r) => r.item.type === "find").length, icon: "find", tone: "find" },
  ];
  return (
    <ul className="stat-tiles">
      {tiles.map((t) => {
        const body = (
          <>
            <span className={`tile tile--${t.tone}`} aria-hidden="true">
              <Icon name={t.icon} size={18} />
            </span>
            <span className="stat-tile__value num">{t.value}</span>
            <span className="stat-tile__label">{t.label}</span>
          </>
        );
        return (
          <li key={t.id}>
            {t.group && t.value > 0 ? (
              <button type="button" className={`stat-tile stat-tile--${t.tone}`} onClick={() => jump(t.group!)}>
                {body}
              </button>
            ) : (
              <div className={`stat-tile stat-tile--${t.tone}`}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
