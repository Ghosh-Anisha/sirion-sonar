import type { Person } from "../data/types";
import type { Item } from "./items";

/**
 * Who sees which item, per the roles table in docs/spec.md.
 * Contract owners see their own suppliers. The procurement lead sees everything.
 * The finance lead sees invoice checks, prices and payments for every supplier,
 * but not renewal or service items for suppliers they do not own.
 * The IT admin sees connections and the access log, not items.
 */
export function canSee(item: Item, person: Person): boolean {
  switch (person.role) {
    case "procurement-lead":
      return true;
    case "contract-owner":
      return item.ownerId === person.id;
    case "finance-lead":
      return item.ownerId === person.id || (item.type !== "decide" && item.type !== "fix");
    case "it-admin":
      return false;
  }
}
