import { daysBetween } from "./calendar";
import { formatDate, formatMoney, formatMonthName, formatPercent, formatShortDate } from "./format";
import type { Item, ItemDetail, Reason } from "./items";

/*
 * The one-line statement for each item on the Needs you list. Plain words:
 * what happened, what it costs, what to do. Every date and amount comes from
 * the item, which was computed in code.
 */

/** "That is 102 days away." Counts from today to a date. */
export function daysAway(today: string, date: string): string {
  const days = daysBetween(today, date);
  if (days > 1) return `That is ${days} days away.`;
  if (days === 1) return "That is tomorrow.";
  if (days === 0) return "That is today.";
  return days === -1 ? "That was yesterday." : `That was ${-days} days ago.`;
}

export function itemSentence(item: Item, vendorName: string, today: string): string {
  const d = item.detail;
  const by = formatShortDate(item.dueDate);
  const passed = daysBetween(today, item.dueDate) < 0;
  const when = daysAway(today, item.dueDate);
  switch (d.kind) {
    case "renewal": {
      const { endDate, autoRenews } = d.dates;
      if (!endDate) {
        return passed
          ? `${vendorName} renews on a date the scan does not show, and the safe date to tell them was ${by}. ${when}`
          : `${vendorName} renews on a date the scan does not show, so tell them by ${by} to be safe. ${when}`;
      }
      const end = formatDate(endDate);
      if (autoRenews) {
        return passed
          ? `${vendorName} renews on ${end}, and the last day to tell them was ${by}. ${when}`
          : `${vendorName} renews on ${end} unless you tell them by ${by}. ${when}`;
      }
      return passed
        ? `${vendorName} ends on ${end}, and the last day to ask about extending was ${by}. ${when}`
        : `${vendorName} ends on ${end}, so tell them by ${by} if you want to extend. ${when}`;
    }
    case "invoice":
      return `${vendorName} billed ${formatMoney(d.invoiced)} on invoice ${d.invoiceNumber}, which is ${formatMoney(d.difference)} more than the agreed rate, so check it before it is paid.`;
    case "price-rise":
      return `${vendorName} wants to raise its fee by ${formatPercent(d.increasePercent)} to ${formatMoney(d.proposed)} a month from ${formatDate(d.effectiveFrom)}, ${d.capPercent === null ? "and the contract sets no cap" : `above the ${formatPercent(d.capPercent)} cap in the contract`}, so ${passed ? "reply today" : `reply before ${by}`}.`;
    case "amendment":
      return `${vendorName} sent an amendment that moves the end date from ${formatDate(d.before.endDate!)} to ${formatDate(d.after.endDate!)}, so accept it or reject it.`;
    case "service":
      return `${vendorName} delivered ${d.onTime} of ${d.trips} trips on time in ${formatMonthName(d.month)}, below the ${formatPercent(d.targetPercent)} in the contract${d.credit === null ? "" : `, so you are owed a credit of ${formatMoney(d.credit)}`}.`;
    case "no-contract":
      return `You have paid ${vendorName} ${formatMoney(d.total)} with no contract on file, so find it or ask them for one.`;
  }
}

const ACTION_LABELS: Record<ItemDetail["kind"], string> = {
  renewal: "Decide",
  invoice: "Check invoice",
  "price-rise": "Review price",
  amendment: "Review change",
  service: "Claim credit",
  "no-contract": "Find contract",
};

export function actionLabel(item: Item): string {
  return ACTION_LABELS[item.detail.kind];
}

const REASON_LABELS: Record<Reason, string> = {
  time: "Date coming up",
  arrival: "Just arrived",
  absence: "Missing",
  change: "Terms changed",
};

export function reasonLabel(reason: Reason): string {
  return REASON_LABELS[reason];
}
