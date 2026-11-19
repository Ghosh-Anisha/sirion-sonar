import type { Label } from "../../data/types";
import type { ItemType } from "../../logic/items";
import { Icon } from "./Icon";
import "./Badge.css";

export type BadgeKind = ItemType | Label | "urgent";

const TEXT: Record<BadgeKind, string> = {
  decide: "Decide",
  check: "Check",
  fix: "Fix",
  find: "Find",
  confirmed: "Confirmed",
  derived: "Derived",
  bounded: "Bounded",
  unknown: "Unknown",
  urgent: "Urgent",
};

const GROUP: Record<BadgeKind, string> = {
  decide: "Item type",
  check: "Item type",
  fix: "Item type",
  find: "Item type",
  confirmed: "Date confidence",
  derived: "Date confidence",
  bounded: "Date confidence",
  unknown: "Date confidence",
  urgent: "Priority",
};

interface BadgeProps {
  kind: BadgeKind;
}

export function Badge({ kind }: BadgeProps) {
  const text = TEXT[kind];
  return (
    <span className={`badge badge--${kind}`} role="img" aria-label={`${GROUP[kind]}: ${text}`}>
      <Icon name={kind} />
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
