import type { DeliveryReport, Fact, Invoice } from "../data/types";

/** Rounds money and percentages to two decimal places. */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function invoiceTotal(invoice: Invoice): number {
  return round2(invoice.lines.reduce((sum, line) => sum + line.quantity * line.unitRate, 0));
}

/** An agreed rate from a contract: a unit rate or a monthly fee. */
export interface RateTerm {
  contractId: string;
  fact: Fact;
}

export interface InvoiceCheck {
  invoiced: number;
  agreed: number;
  difference: number;
  /** The contract term the biggest difference is measured against. */
  term: RateTerm;
}

/**
 * Compares each invoice line with the agreed rate closest to it, so a supplier with
 * several contracts is checked against the right one. Returns null with no agreed rates.
 */
export function checkInvoice(invoice: Invoice, terms: RateTerm[]): InvoiceCheck | null {
  const priced = terms.filter((t) => typeof t.fact.value === "number");
  if (priced.length === 0 || invoice.lines.length === 0) return null;

  let agreed = 0;
  let worst = { gap: -Infinity, term: priced[0] };
  for (const line of invoice.lines) {
    const rateOf = (t: RateTerm) => t.fact.value as number;
    const term = priced.reduce((best, t) =>
      Math.abs(rateOf(t) - line.unitRate) < Math.abs(rateOf(best) - line.unitRate) ? t : best,
    );
    agreed += line.quantity * rateOf(term);
    const gap = line.quantity * (line.unitRate - rateOf(term));
    if (gap > worst.gap) worst = { gap, term };
  }
  const invoiced = invoiceTotal(invoice);
  agreed = round2(agreed);
  return { invoiced, agreed, difference: round2(invoiced - agreed), term: worst.term };
}

export function percentIncrease(current: number, proposed: number): number {
  return round2(((proposed - current) / current) * 100);
}

export function onTimePercent(report: DeliveryReport): number {
  return report.trips === 0 ? 100 : round2((report.onTime / report.trips) * 100);
}

export function serviceCredit(invoiced: number, creditPercent: number): number {
  return round2((invoiced * creditPercent) / 100);
}
