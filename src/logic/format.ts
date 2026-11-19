const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats an ISO date (YYYY-MM-DD) as "14 Mar 2027". */
export function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Not an ISO date: ${iso}`);
  const [, year, month, day] = match;
  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) throw new Error(`Bad month in ${iso}`);
  return `${Number(day)} ${MONTHS[monthIndex]} ${year}`;
}

/** Groups whole digits the Indian way: 1,20,000 and 12,34,56,789. */
function groupIndian(digits: string): string {
  if (digits.length <= 3) return digits;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last3}`;
}

/** Formats rupees as "Rs 1,20,000". Paise are shown only when present. */
export function formatMoney(amount: number): string {
  if (!Number.isFinite(amount)) throw new Error(`Not a number: ${amount}`);
  const sign = amount < 0 ? "-" : "";
  const [whole, paise] = Math.abs(amount).toFixed(2).split(".");
  const tail = paise === "00" ? "" : `.${paise}`;
  return `${sign}Rs ${groupIndian(whole)}${tail}`;
}
