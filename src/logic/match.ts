import type { Payment, Vendor } from "../data/types";
import { supplierPayments } from "./classify";

export type NameMatch = "same" | "unsure" | "different";

/** Company-form words that do not tell two suppliers apart. */
const DROPPED = new Set(["PVT", "PRIVATE", "LTD", "LIMITED", "LLP", "CO", "INC", "THE"]);
const SYNONYMS: Record<string, string> = { SVCS: "SERVICES", SVC: "SERVICES", AND: "&" };

function singular(token: string): string {
  return token.length > 3 && token.endsWith("S") && !token.endsWith("SS") ? token.slice(0, -1) : token;
}

/** Upper case, punctuation removed, company forms dropped, abbreviations expanded, plurals made singular. */
export function nameTokens(name: string): string[] {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9&]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((t) => SYNONYMS[t] ?? t)
    .filter((t) => !DROPPED.has(t))
    .map(singular);
}

/**
 * Same when the names are equal once normalised, even with spaces moved
 * ("Print Works" and "Printworks"). Unsure when they share their first word and one
 * name's words all appear in the other, or most words overlap. A person settles those.
 */
export function compareNames(a: string, b: string): NameMatch {
  const ta = nameTokens(a);
  const tb = nameTokens(b);
  if (ta.length === 0 || tb.length === 0) return "different";
  if (ta.join(" ") === tb.join(" ") || ta.join("") === tb.join("")) return "same";

  const setA = new Set(ta);
  const setB = new Set(tb);
  const shared = ta.filter((t) => setB.has(t)).length;
  const subset = ta.every((t) => setB.has(t)) || tb.every((t) => setA.has(t));
  const overlap = shared / new Set([...ta, ...tb]).size;
  if ((ta[0] === tb[0] && subset) || overlap >= 0.5) return "unsure";
  return "different";
}

export interface VendorMatch {
  vendor: Vendor;
  match: "same" | "unsure";
}

/** Finds the vendor a name belongs to, checking its name and every known spelling. A sure match beats an unsure one. */
export function matchVendor(name: string, vendors: Vendor[]): VendorMatch | null {
  let unsure: VendorMatch | null = null;
  for (const vendor of vendors) {
    for (const known of [vendor.name, ...vendor.aliases]) {
      const result = compareNames(name, known);
      if (result === "same") return { vendor, match: "same" };
      if (result === "unsure" && !unsure) unsure = { vendor, match: "unsure" };
    }
  }
  return unsure;
}

export function vendorForEmail(address: string, vendors: Vendor[]): Vendor | null {
  const domain = address.split("@")[1]?.toLowerCase();
  return vendors.find((v) => v.emailDomains.includes(domain)) ?? null;
}

/** Payments grouped by the vendor they surely belong to. Unsure matches are left out for a person to settle. */
export function paymentsByVendor(payments: Payment[], vendors: Vendor[]): Map<string, Payment[]> {
  const byVendor = new Map<string, Payment[]>();
  for (const payment of payments) {
    const found = matchVendor(payment.payee, vendors);
    if (found?.match !== "same") continue;
    byVendor.set(found.vendor.id, [...(byVendor.get(found.vendor.id) ?? []), payment]);
  }
  return byVendor;
}

/** Supplier payments made by today, grouped by the vendor they surely belong to. */
export function paidByVendor(payments: Payment[], vendors: Vendor[], today: string): Map<string, Payment[]> {
  return paymentsByVendor(supplierPayments(payments.filter((p) => p.date <= today)), vendors);
}

export interface NameGroups {
  /** Names merged as one supplier. The first name in each group is the one kept. */
  groups: string[][];
  /** Pairs that might be the same supplier. These go to the not sure bucket. */
  unsure: [string, string][];
}

/** Builds a vendor list from raw payee names, merging spellings of the same supplier. */
export function groupNames(names: string[]): NameGroups {
  const groups: string[][] = [];
  const unsure: [string, string][] = [];
  for (const name of names) {
    const same = groups.find((g) => compareNames(g[0], name) === "same");
    if (same) {
      if (!same.includes(name)) same.push(name);
      continue;
    }
    const maybe = groups.find((g) => compareNames(g[0], name) === "unsure");
    if (maybe) unsure.push([maybe[0], name]);
    groups.push([name]);
  }
  return { groups, unsure };
}
