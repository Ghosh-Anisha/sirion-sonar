import type { Person, Vendor } from "../data/types";
import type { Item } from "./items";
import { canSee } from "./visibility";

/*
 * What each role sees, said plainly, so a viewer knows why the list looks the way it does.
 * The rules themselves live in visibility.ts. This only explains them.
 */

export const ROLE_NAME: Record<Person["role"], string> = {
  "procurement-lead": "Procurement lead",
  "finance-lead": "Finance lead",
  "contract-owner": "Contract owner",
  "it-admin": "IT admin",
};

/** One sentence on what this person sees, for the top of Home and the switch notice. */
export function roleView(person: Person, items: Item[], vendors: Vendor[]): string {
  const open = items.filter((i) => i.status === "open");
  const mine = open.filter((i) => canSee(i, person)).length;
  switch (person.role) {
    case "procurement-lead": {
      const unowned = open.filter((i) => i.ownerId === null).length;
      return `As procurement lead you see every item, ${open.length} in all, and the ${unowned} nobody owns come to you.`;
    }
    case "finance-lead":
      return `As finance lead you see invoice checks, price rises and missing contracts for every supplier, ${mine} of ${open.length} items.`;
    case "contract-owner": {
      const owned = vendors.filter((v) => v.ownerId === person.id).length;
      return `As a contract owner you see only your own ${owned} suppliers, ${mine} of ${open.length} items.`;
    }
    case "it-admin":
      return "As IT admin you see the connections and the access log, and no contract contents.";
  }
}

/** Why a person sees an item, or null when they do not. */
export function seenBecause(item: Item, person: Person): string | null {
  if (!canSee(item, person)) return null;
  if (item.ownerId === person.id) return "Owns this supplier";
  if (person.role === "procurement-lead") return item.ownerId === null ? "Nobody owns it, so it comes here" : "Sees every item";
  if (person.role === "finance-lead") return "Sees every invoice, price and payment";
  return null;
}
