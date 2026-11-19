import type { Contract, Email } from "../data/types";
import { applyAmendment } from "./amend";
import { addDays, earlierOf, laterOf } from "./calendar";
import { checkInvoice, invoiceTotal, onTimePercent, percentIncrease, serviceCredit, type RateTerm } from "./checks";
import type { ContractDates } from "./dates";
import { findFact, numberValue } from "./facts";
import type { Draft, ItemInput } from "./items";
import { vendorForEmail } from "./match";

/** Invoices are due this many days after their date. */
export const PAYMENT_TERMS_DAYS = 30;
/** An amendment with no deadline in sight should be answered within this many days. */
export const AMENDMENT_REPLY_DAYS = 14;

export const amendmentItemId = (emailId: string) => `change:${emailId}`;

/**
 * Items raised by an email once it arrives: an invoice above the agreed rate (Check),
 * a missed service level (Fix), a price rise above the cap (Check), and an amendment
 * waiting for the owner (Check, reason change). An email from an unknown sender raises nothing.
 */
export function emailItems(
  email: Email,
  input: ItemInput,
  contracts: Contract[],
  datesOf: (c: Contract) => ContractDates,
): Draft[] {
  const vendor = vendorForEmail(email.from.address, input.vendors);
  if (!vendor) return [];
  const own = contracts.filter((c) => c.vendorId === vendor.id);
  const base = { vendorId: vendor.id, openedOn: laterOf(email.receivedOn, input.firstReadOn) };
  const items: Draft[] = [];

  const invoiceDue = email.invoice ? addDays(email.invoice.date, PAYMENT_TERMS_DAYS) : null;

  if (email.invoice) {
    const terms: RateTerm[] = own.flatMap((c) =>
      c.facts.filter((f) => f.field === "unitRate" || f.field === "monthlyFee").map((fact) => ({ contractId: c.id, fact })),
    );
    const check = checkInvoice(email.invoice, terms);
    if (check && check.difference > 0) {
      items.push({
        ...base,
        id: `check:${email.id}`,
        type: "check",
        reason: "arrival",
        dueDate: invoiceDue!,
        detail: { kind: "invoice", emailId: email.id, contractId: check.term.contractId, invoiceNumber: email.invoice.number, ...check },
      });
    }
  }

  if (email.deliveries) {
    const contract = own.find((c) => findFact(c.facts, "slaOnTimePercent"));
    const target = contract ? numberValue(contract.facts, "slaOnTimePercent") : null;
    const actual = onTimePercent(email.deliveries);
    if (contract && target !== null && actual < target) {
      const creditPercent = numberValue(contract.facts, "slaCreditPercent");
      const credit = email.invoice && creditPercent !== null ? serviceCredit(invoiceTotal(email.invoice), creditPercent) : null;
      items.push({
        ...base,
        id: `fix:${email.id}`,
        type: "fix",
        reason: "arrival",
        dueDate: invoiceDue ?? addDays(email.receivedOn, PAYMENT_TERMS_DAYS),
        detail: { kind: "service", emailId: email.id, contractId: contract.id, ...email.deliveries, onTimePercent: actual, targetPercent: target, credit },
      });
    }
  }

  if (email.priceChange) {
    const contract = own.find((c) => findFact(c.facts, "monthlyFee"));
    const { currentMonthlyFee, newMonthlyFee, effectiveFrom } = email.priceChange;
    const increase = percentIncrease(currentMonthlyFee, newMonthlyFee);
    const cap = contract ? numberValue(contract.facts, "priceCapPercent") : null;
    if (contract && increase > (cap ?? 0)) {
      const deadline = datesOf(contract).noticeDeadline;
      items.push({
        ...base,
        id: `check:${email.id}`,
        type: "check",
        reason: "arrival",
        dueDate: deadline ? earlierOf(deadline, effectiveFrom) : effectiveFrom,
        detail: { kind: "price-rise", emailId: email.id, contractId: contract.id, current: currentMonthlyFee, proposed: newMonthlyFee, increasePercent: increase, capPercent: cap, effectiveFrom },
      });
    }
  }

  if (email.amendment) {
    const original = input.contracts.find((c) => c.id === email.amendment!.contractId);
    if (original) {
      const before = datesOf(original);
      const after = datesOf(applyAmendment(original, email.amendment));
      items.push({
        ...base,
        id: amendmentItemId(email.id),
        type: "check",
        reason: "change",
        dueDate: before.noticeDeadline ?? addDays(email.receivedOn, AMENDMENT_REPLY_DAYS),
        detail: { kind: "amendment", emailId: email.id, contractId: original.id, before, after },
      });
    }
  }

  return items;
}
