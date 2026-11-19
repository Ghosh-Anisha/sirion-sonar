import type { Contract, Label, Payment, Vendor } from "../data/types";
import { supplierPayments } from "./classify";
import { contractDates } from "./dates";
import type { Item, ItemType } from "./items";
import { paymentsByVendor } from "./match";

export interface ReviewEntry {
  contractId: string;
  vendorId: string;
  label: Label;
  /** The earliest the notice deadline could fall. Null when nothing is known, which is treated as could be today. */
  earliestDeadline: string | null;
}

const RISKY: Label[] = ["unknown", "bounded"];

/** Unknown and Bounded first, then by the earliest date a deadline could fall. */
export function compareReview(a: ReviewEntry, b: ReviewEntry): number {
  const riskA = RISKY.includes(a.label) ? 0 : 1;
  const riskB = RISKY.includes(b.label) ? 0 : 1;
  if (riskA !== riskB) return riskA - riskB;
  if (a.earliestDeadline !== b.earliestDeadline) {
    if (a.earliestDeadline === null) return -1;
    if (b.earliestDeadline === null) return 1;
    return a.earliestDeadline < b.earliestDeadline ? -1 : 1;
  }
  return a.contractId.localeCompare(b.contractId);
}

/** Contracts whose deadline nobody has confirmed yet, riskiest first. This is the owners' confirmation queue. */
export function reviewQueue(contracts: Contract[], payments: Payment[], vendors: Vendor[], today: string): ReviewEntry[] {
  const paid = paymentsByVendor(supplierPayments(payments.filter((p) => p.date <= today)), vendors);
  return contracts
    .map((c) => {
      const dates = contractDates(c.facts, today, (paid.get(c.vendorId) ?? []).map((p) => p.date));
      return { contractId: c.id, vendorId: c.vendorId, label: dates.label, earliestDeadline: dates.earliestDeadline };
    })
    .filter((entry) => entry.label !== "confirmed")
    .sort(compareReview);
}

const TYPE_ORDER: Record<ItemType, number> = { decide: 0, check: 1, fix: 2, find: 3 };

/** The Needs you list order: what is due first, then by type, then by id so the order never jumps. */
export function orderItems(items: Item[]): Item[] {
  return [...items].sort(
    (a, b) =>
      a.dueDate.localeCompare(b.dueDate) || TYPE_ORDER[a.type] - TYPE_ORDER[b.type] || a.id.localeCompare(b.id),
  );
}
