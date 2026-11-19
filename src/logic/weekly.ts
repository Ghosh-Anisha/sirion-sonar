import type { Person } from "../data/types";
import { routeItem } from "./alerts";
import { addDays } from "./calendar";
import { formatDate } from "./format";
import type { Item } from "./items";
import { orderItems } from "./order";
import { canSee } from "./visibility";

/** The Monday of the week a date falls in. */
export function weekStart(today: string): string {
  const [y, m, d] = today.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return addDays(today, -((weekday + 6) % 7));
}

/**
 * The open items in one person's weekly email. An owner gets their own suppliers.
 * The procurement lead gets what has been routed to them: items with no owner and
 * escalated items. The finance lead gets what they can see. IT gets no email.
 */
export function weeklyItems(items: Item[], person: Person, today: string, procurementLeadId: string): Item[] {
  const open = items.filter((i) => i.status === "open");
  const mine = open.filter((item) => {
    switch (person.role) {
      case "contract-owner":
        return item.ownerId === person.id;
      case "procurement-lead":
        return routeItem(item, today, procurementLeadId).recipients.includes(person.id);
      case "finance-lead":
        return canSee(item, person);
      case "it-admin":
        return false;
    }
  });
  return orderItems(mine);
}

export function weeklySubject(count: number, urgent: number, today: string): string {
  const week = `week of ${formatDate(weekStart(today))}`;
  if (count === 0) return `Sonar, ${week}: nothing needs you`;
  const things = count === 1 ? "1 thing needs you" : `${count} things need you`;
  return urgent > 0 ? `Sonar, ${week}: ${things}, ${urgent} urgent` : `Sonar, ${week}: ${things}`;
}
