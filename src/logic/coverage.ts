import type { Contract, Payment, Vendor } from "../data/types";
import { paidByVendor } from "./match";

export interface Coverage {
  /** Suppliers we have paid. */
  paid: number;
  /** Of those, how many have a full contract, part of one, or none. */
  full: number;
  partial: number;
  none: number;
  /** Share of supplier spend, 0 to 100, that goes to suppliers with a contract record. */
  spendShare: number;
}

/**
 * How many of the suppliers we pay have a contract record. A supplier counts as full when
 * at least one of its contracts has no gap, and partial when every contract it has is missing a part.
 */
export function coverage(vendors: Vendor[], contracts: Contract[], payments: Payment[], today: string): Coverage {
  const paid = paidByVendor(payments, vendors, today);
  let full = 0;
  let partial = 0;
  let none = 0;
  let coveredSpend = 0;
  let totalSpend = 0;

  for (const [vendorId, lines] of paid) {
    const own = contracts.filter((c) => c.vendorId === vendorId);
    const spend = lines.reduce((sum, p) => sum + p.amount, 0);
    totalSpend += spend;
    if (own.length === 0) {
      none += 1;
      continue;
    }
    coveredSpend += spend;
    if (own.some((c) => c.gap === null)) full += 1;
    else partial += 1;
  }

  return {
    paid: paid.size,
    full,
    partial,
    none,
    spendShare: totalSpend === 0 ? 0 : Math.round((coveredSpend / totalSpend) * 100),
  };
}
