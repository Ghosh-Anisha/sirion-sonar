import type { Vendor } from "../data/types";
import type { SourceId } from "../data/sources";
import type { Item } from "./items";

/** The vendor list with owners set in onboarding. A vendor not in `owners` keeps the owner it came with. */
export function withOwners(vendors: Vendor[], owners: Record<string, string | null>): Vendor[] {
  if (Object.keys(owners).length === 0) return vendors;
  return vendors.map((v) => (v.id in owners ? { ...v, ownerId: owners[v.id] } : v));
}

/** The owner the wizard puts in the table first: the one already known, else a suggestion, else nobody. */
export function proposedOwner(vendor: Vendor, suggestions: Record<string, string>): string | null {
  return vendor.ownerId ?? suggestions[vendor.id] ?? null;
}

/**
 * Open items that depend on a source, so revoking it shows what stops updating.
 * Payables finds suppliers paid with no contract, the drive holds the contracts behind
 * renewal dates, and mail brings invoices, price rises and service reports.
 */
export function itemsFromSource(source: SourceId, items: Item[]): Item[] {
  return items.filter((item) => {
    if (item.status !== "open") return false;
    if (source === "payables") return item.detail.kind === "no-contract";
    if (source === "drive") return item.detail.kind === "renewal";
    return "emailId" in item.detail;
  });
}
