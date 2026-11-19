import { daysBetween } from "./calendar";
import type { Item } from "./items";

/** Alerts go out this many days before a deadline. */
export const ALERT_DAYS = [90, 30, 7] as const;
/** An open item escalates once it has waited this long, or once its deadline is this close. */
export const ESCALATE_DAYS = 30;
/** An open item is urgent this close to its deadline. */
export const URGENT_DAYS = 7;
/** Items due within this many days are grouped under This month. */
export const THIS_MONTH_DAYS = 30;

export type UrgencyGroup = "urgent" | "month" | "later";

/** The Home grouping: Urgent, This month, Later. */
export function urgencyGroup(routing: Routing): UrgencyGroup {
  if (routing.urgent) return "urgent";
  return routing.daysLeft <= THIS_MONTH_DAYS ? "month" : "later";
}

export interface Routing {
  /** Days until the due date. Negative once it has passed. */
  daysLeft: number;
  /** The alert points that have been reached, from 90 down. */
  alertsFired: number[];
  /** Open with an owner, and either untouched for 30 days or 30 days from its deadline. */
  escalated: boolean;
  urgent: boolean;
  /** Nobody owns the supplier, so the item goes straight to the procurement lead. */
  unowned: boolean;
  /** Who should see this item now. */
  recipients: string[];
}

/**
 * Works out who an item goes to on a given day.
 * The owner gets it first. If it has had no action by the 30 day alert, or for 30 days
 * since it opened, it also goes to the procurement lead. At 7 days it is urgent.
 * An item with no owner goes to the procurement lead from the start.
 */
export function routeItem(item: Item, today: string, procurementLeadId: string): Routing {
  const daysLeft = daysBetween(today, item.dueDate);
  const open = item.status === "open";
  const unowned = item.ownerId === null;
  const waited = daysBetween(item.openedOn, today);
  const escalated = open && !unowned && (daysLeft <= ESCALATE_DAYS || waited >= ESCALATE_DAYS);

  const recipients = unowned ? [procurementLeadId] : escalated ? [item.ownerId!, procurementLeadId] : [item.ownerId!];

  return {
    daysLeft,
    alertsFired: ALERT_DAYS.filter((d) => daysLeft <= d),
    escalated,
    urgent: open && daysLeft <= URGENT_DAYS,
    unowned,
    recipients: [...new Set(recipients)],
  };
}
