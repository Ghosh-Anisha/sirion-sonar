import type { Contract, Email } from "../data/types";
import { addDays, earlierOf } from "./calendar";
import { checkInvoice, percentIncrease, round2, type RateTerm } from "./checks";
import { contractDates } from "./dates";
import { numberValue } from "./facts";
import { PAYMENT_TERMS_DAYS } from "./arrivals";

/*
 * What the problem costs in the sample data, for the cost cards on /story.
 * Every figure is worked out here from the contracts and emails, so the cards change when the data does.
 */

export interface RenewalCost {
  kind: "renewal";
  contractId: string;
  amount: number;
  /** The last day to give notice. */
  dueDate: string;
}

export interface PriceRiseCost {
  kind: "price-rise";
  contractId: string;
  emailId: string;
  increasePercent: number;
  capPercent: number;
  /** How much more a month than the cap allows. */
  overMonthly: number;
  /** The same over a year. This is the card's amount. */
  amount: number;
  noticeDays: number;
  /** The last day the supplier could give notice of a rise. */
  noticeBy: string;
  receivedOn: string;
  late: boolean;
  dueDate: string;
}

export interface InvoiceCost {
  kind: "invoice";
  contractId: string;
  emailId: string;
  amount: number;
  dueDate: string;
}

export interface LapseCost {
  kind: "lapse";
  contractId: string;
  /** The yearly fee for the service that stops. */
  amount: number;
  dueDate: string;
}

export interface RetainerCost {
  kind: "retainer";
  contractId: string;
  monthlyFee: number;
  months: number;
  amount: number;
  dueDate: string;
}

export type StoryCost = RenewalCost | PriceRiseCost | InvoiceCost | LapseCost | RetainerCost;

/** The contracts and emails the five cards are about. */
export const COST_SOURCES = {
  renewal: "cloudmetric-subscription",
  priceRise: { contractId: "ledgerline-payroll", emailId: "ledgerline-price-rise" },
  invoice: { contractId: "brightline-logistics", emailId: "brightline-invoice" },
  lapse: "greenleaf-grounds",
  retainer: "quillstone-retainer",
} as const;

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`The sample data is missing ${what}`);
  return value;
}

/** The five costs, in the order the cards show them. */
export function storyCosts(contracts: Contract[], emails: Email[], today: string): StoryCost[] {
  const contract = (id: string) => need(contracts.find((c) => c.id === id), `contract ${id}`);
  const email = (id: string) => need(emails.find((e) => e.id === id), `email ${id}`);
  const num = (c: Contract, field: Parameters<typeof numberValue>[1]) => need(numberValue(c.facts, field), `${field} on ${c.id}`);
  const deadline = (c: Contract) => need(contractDates(c.facts, today).noticeDeadline, `a notice deadline on ${c.id}`);

  const cloud = contract(COST_SOURCES.renewal);
  const renewal: RenewalCost = { kind: "renewal", contractId: cloud.id, amount: num(cloud, "annualFee"), dueDate: deadline(cloud) };

  const ledger = contract(COST_SOURCES.priceRise.contractId);
  const riseEmail = email(COST_SOURCES.priceRise.emailId);
  const rise = need(riseEmail.priceChange, "the price change in the Ledgerline email");
  const capPercent = num(ledger, "priceCapPercent");
  const noticeDays = num(ledger, "priceNoticeDays");
  const termEnd = need(contractDates(ledger.facts, today).endDate, "the Ledgerline end date");
  const overMonthly = round2(rise.newMonthlyFee - rise.currentMonthlyFee * (1 + capPercent / 100));
  const noticeBy = addDays(termEnd, -noticeDays);
  const priceRise: PriceRiseCost = {
    kind: "price-rise",
    contractId: ledger.id,
    emailId: riseEmail.id,
    increasePercent: percentIncrease(rise.currentMonthlyFee, rise.newMonthlyFee),
    capPercent,
    overMonthly,
    amount: round2(overMonthly * 12),
    noticeDays,
    noticeBy,
    receivedOn: riseEmail.receivedOn,
    late: riseEmail.receivedOn > noticeBy,
    dueDate: earlierOf(deadline(ledger), rise.effectiveFrom),
  };

  const bright = contract(COST_SOURCES.invoice.contractId);
  const invoiceEmail = email(COST_SOURCES.invoice.emailId);
  const invoice = need(invoiceEmail.invoice, "the Brightline invoice");
  const terms: RateTerm[] = bright.facts.filter((f) => f.field === "unitRate").map((fact) => ({ contractId: bright.id, fact }));
  const check = need(checkInvoice(invoice, terms), "an agreed Brightline rate");
  const overcharge: InvoiceCost = {
    kind: "invoice",
    contractId: bright.id,
    emailId: invoiceEmail.id,
    amount: check.difference,
    dueDate: addDays(invoice.date, PAYMENT_TERMS_DAYS),
  };

  const green = contract(COST_SOURCES.lapse);
  const lapse: LapseCost = { kind: "lapse", contractId: green.id, amount: num(green, "annualFee"), dueDate: deadline(green) };

  const quill = contract(COST_SOURCES.retainer);
  const monthlyFee = num(quill, "monthlyFee");
  const months = num(quill, "renewalTermMonths");
  const retainer: RetainerCost = { kind: "retainer", contractId: quill.id, monthlyFee, months, amount: monthlyFee * months, dueDate: deadline(quill) };

  return [renewal, priceRise, overcharge, lapse, retainer];
}

export interface Exposure {
  from: string;
  /** The last day of the window, inclusive. */
  to: string;
  total: number;
  included: StoryCost[];
  left: StoryCost[];
}

/** The costs whose date to act falls in the first `days` days from `start`, and their total. */
export function exposureWithin(costs: StoryCost[], start: string, days: number): Exposure {
  const to = addDays(start, days - 1);
  const inWindow = (c: StoryCost) => c.dueDate >= start && c.dueDate <= to;
  const included = costs.filter(inWindow);
  return { from: start, to, total: round2(included.reduce((sum, c) => sum + c.amount, 0)), included, left: costs.filter((c) => !inWindow(c)) };
}

/** Where each card links: the item in the demo, or the contract when the item is not on the list yet. */
export function costLink(cost: StoryCost): string {
  const item = (id: string) => `/item/${encodeURIComponent(id)}`;
  switch (cost.kind) {
    case "renewal":
      return `/contract/${cost.contractId}`;
    case "price-rise":
    case "invoice":
      return item(`check:${cost.emailId}`);
    case "lapse":
    case "retainer":
      return item(`decide:${cost.contractId}:${cost.dueDate}`);
  }
}
