import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { people } from "../data/people";
import { vendors } from "../data/vendors";
import { buildItems } from "./items";
import { roleView, seenBecause } from "./roles";

const items = buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });
const person = (id: string) => people.find((p) => p.id === id)!;

describe("roleView", () => {
  it("says what each role sees, with the counts", () => {
    expect(roleView(person("kavya"), items, vendors)).toMatch(/^As procurement lead you see every item, 20 in all, and the \d+ nobody owns come to you\.$/);
    expect(roleView(person("arjun"), items, vendors)).toMatch(/^As finance lead you see .* \d+ of 20 items\.$/);
    expect(roleView(person("neha"), items, vendors)).toMatch(/^As a contract owner you see only your own \d+ suppliers, \d+ of 20 items\.$/);
    expect(roleView(person("vikram"), items, vendors)).toMatch(/no contract contents/);
  });
});

describe("seenBecause", () => {
  it("explains why each person sees an item, or that they do not", () => {
    const brightlineInvoice = items.find((i) => i.id === "check:brightline-invoice")!;
    expect(seenBecause(brightlineInvoice, person("rohan"))).toBe("Owns this supplier");
    expect(seenBecause(brightlineInvoice, person("kavya"))).toBe("Sees every item");
    expect(seenBecause(brightlineInvoice, person("arjun"))).toBe("Sees every invoice, price and payment");
    expect(seenBecause(brightlineInvoice, person("neha"))).toBeNull();
    expect(seenBecause(brightlineInvoice, person("vikram"))).toBeNull();
    const unowned = items.find((i) => i.ownerId === null)!;
    expect(seenBecause(unowned, person("kavya"))).toBe("Nobody owns it, so it comes here");
  });
});
