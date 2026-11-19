/** Calendar arithmetic on ISO dates (YYYY-MM-DD). Works in whole UTC days, so time zones never shift a date. */

const DAY_MS = 86_400_000;

function parts(iso: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Not an ISO date: ${iso}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function format(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function toDayNumber(iso: string): number {
  const [y, m, d] = parts(iso);
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

function fromDayNumber(day: number): string {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

/** Last day of a month, with month counted from 1. */
export function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function addDays(iso: string, days: number): string {
  return fromDayNumber(toDayNumber(iso) + days);
}

/** Days from one date to another. Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return toDayNumber(to) - toDayNumber(from);
}

/**
 * Adds calendar months. A month-end date stays at month end (30 Apr + 12 = 30 Apr,
 * 28 Feb 2026 + 12 = 28 Feb 2027), and other days clamp to the target month's length.
 */
export function addMonths(iso: string, months: number): string {
  const [y, m, d] = parts(iso);
  const index = y * 12 + (m - 1) + months;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  const last = lastDayOfMonth(year, month);
  const day = d === lastDayOfMonth(y, m) ? last : Math.min(d, last);
  return format(year, month, day);
}

/** The last day of a term that starts on `start` and runs for `months` months. */
export function termEnd(start: string, months: number): string {
  return addDays(addMonths(start, months), -1);
}

export function laterOf(a: string, b: string): string {
  return a > b ? a : b;
}

export function earlierOf(a: string, b: string): string {
  return a < b ? a : b;
}

/** First and last day of a month, as ISO dates. */
export function monthRange(year: number, month: number): [string, string] {
  return [format(year, month, 1), format(year, month, lastDayOfMonth(year, month))];
}
