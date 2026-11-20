import type { Fact, Label } from "../data/types";
import { addDays, addMonths, monthRange, termEnd } from "./calendar";
import { dateValue, numberValue } from "./facts";
import { deadlineLabel } from "./labels";

export interface ContractDates {
  label: Label;
  /** The end of the current term, after rolling renewals forward. Null when not known exactly. */
  endDate: string | null;
  /** End date minus notice days. Null when not known exactly. */
  noticeDeadline: string | null;
  /** The earliest and latest the deadline could fall. Equal when exact, a window when Bounded, null when Unknown. */
  earliestDeadline: string | null;
  latestDeadline: string | null;
  autoRenews: boolean;
}

/** Rolls the end date forward by the renewal term while it is on or before today. */
export function rollForward(end: string, renewalMonths: number | null, today: string): string {
  if (!renewalMonths || renewalMonths <= 0) return end;
  let current = end;
  while (current <= today) current = addMonths(current, renewalMonths);
  return current;
}

/** The last day to give notice. With no notice period, the decision is due by the end date. */
export function noticeDeadline(end: string, noticeDays: number | null): string {
  return addDays(end, -(noticeDays ?? 0));
}

/** The notice period as the contract gives it: in days, or in calendar months back from the end date. */
export interface NoticePeriod {
  days: number | null;
  months: number | null;
}

/** The last day to give notice, counting calendar months when the contract gives months (31 Aug less 3 months is 31 May). */
export function noticeDeadlineFor(end: string, notice: NoticePeriod): string {
  return notice.months ? addMonths(end, -notice.months) : noticeDeadline(end, notice.days);
}

/**
 * The month a supplier is paid in, if it is paid once a year in the same month.
 * Needs payments in at least two different years. Month is counted from 1.
 */
export function yearlyPaymentMonth(paymentDates: string[]): number | null {
  const years = new Set(paymentDates.map((d) => d.slice(0, 4)));
  const months = new Set(paymentDates.map((d) => d.slice(5, 7)));
  if (years.size < 2 || months.size !== 1 || years.size !== paymentDates.length) return null;
  return Number([...months][0]);
}

/**
 * Works out a contract's current end date and notice deadline from its facts.
 * When the start date is unreadable but the supplier is paid every year in the same
 * month, the term most likely starts that month, which gives a deadline window.
 */
export function contractDates(facts: Fact[], today: string, paymentDates: string[] = []): ContractDates {
  const label = deadlineLabel(facts);
  const autoRenewal = numberValue(facts, "renewalTermMonths");
  // A renewal only the customer can trigger still sets the next date to decide by, but it does not renew on its own.
  const renewal = autoRenewal ?? numberValue(facts, "renewalOptionMonths");
  const notice: NoticePeriod = { days: numberValue(facts, "noticeDays"), months: numberValue(facts, "noticeMonths") };
  const term = numberValue(facts, "termMonths");
  const start = dateValue(facts, "startDate");
  const autoRenews = autoRenewal !== null;

  const initialEnd = dateValue(facts, "endDate") ?? (start && term ? termEnd(start, term) : null);
  if (initialEnd) {
    const endDate = rollForward(initialEnd, renewal, today);
    const deadline = noticeDeadlineFor(endDate, notice);
    return { label, endDate, noticeDeadline: deadline, earliestDeadline: deadline, latestDeadline: deadline, autoRenews };
  }

  const month = yearlyPaymentMonth(paymentDates);
  if (label === "bounded" && term && month) {
    const year = Math.max(...paymentDates.map((d) => Number(d.slice(0, 4))));
    const [firstDay, lastDay] = monthRange(year, month);
    const deadlineFrom = (startDate: string) =>
      noticeDeadlineFor(rollForward(termEnd(startDate, term), renewal, today), notice);
    return {
      label,
      endDate: null,
      noticeDeadline: null,
      earliestDeadline: deadlineFrom(firstDay),
      latestDeadline: deadlineFrom(lastDay),
      autoRenews,
    };
  }

  return { label, endDate: null, noticeDeadline: null, earliestDeadline: null, latestDeadline: null, autoRenews };
}
