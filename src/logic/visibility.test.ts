import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { people } from "../data/people";
import { vendors } from "../data/vendors";
import { buildItems } from "./items";
import { canSee, canSeeContract } from "./visibility";

const items = buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });
const person = (id: string) => people.find((p) => p.id === id)!;
const visibleTo = (id: string) => items.filter((i) => canSee(i, person(id)));

describe("canSee", () => {
  it("shows the procurement lead every item", () => {
    expect(visibleTo("kavya")).toHaveLength(items.length);
  });

  it("shows a contract owner only their own suppliers", () => {
    for (const owner of ["neha", "rohan", "farah"]) {
      const mine = visibleTo(owner);
      expect(mine.length, owner).toBeGreaterThan(0);
      expect(mine.every((i) => i.ownerId === owner), owner).toBe(true);
    }
  });

  it("never shows an owner an item with no owner", () => {
    expect(visibleTo("rohan").some((i) => i.ownerId === null)).toBe(false);
  });

  it("shows the finance lead checks and payments for everyone, but not others' renewals or service items", () => {
    const seen = visibleTo("arjun");
    expect(seen.some((i) => i.id === "check:brightline-invoice")).toBe(true);
    expect(seen.some((i) => i.type === "find")).toBe(true);
    expect(seen.some((i) => i.type === "decide" || i.type === "fix")).toBe(false);
  });

  it("shows the IT admin no items", () => {
    expect(visibleTo("vikram")).toHaveLength(0);
  });
});

describe("canSeeContract", () => {
  it("shows owners only their own contracts, the leads all of them, and IT none", () => {
    const count = (id: string) => contracts.filter((c) => canSeeContract(c, people.find((p) => p.id === id)!, vendors)).length;
    expect(count("kavya")).toBe(contracts.length);
    expect(count("arjun")).toBe(contracts.length);
    expect(count("vikram")).toBe(0);
    expect(count("neha")).toBeGreaterThan(0);
    expect(count("neha")).toBeLessThan(contracts.length);
  });
});
