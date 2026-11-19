import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { people } from "../data/people";
import { vendors } from "../data/vendors";
import { buildItems } from "./items";
import { weekStart, weeklyItems, weeklySubject } from "./weekly";

const items = buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });
const person = (id: string) => people.find((p) => p.id === id)!;

describe("weekStart", () => {
  it("is the Monday of the week", () => {
    expect(weekStart("2026-11-19")).toBe("2026-11-16");
    expect(weekStart("2026-11-16")).toBe("2026-11-16");
    expect(weekStart("2026-11-22")).toBe("2026-11-16");
  });
});

describe("weeklyItems", () => {
  it("gives an owner only their own open items", () => {
    const rohan = weeklyItems(items, person("rohan"), DEMO_START, "kavya");
    expect(rohan.length).toBeGreaterThan(0);
    expect(rohan.every((i) => i.ownerId === "rohan" && i.status === "open")).toBe(true);
  });

  it("gives the procurement lead the items with no owner and the escalated ones", () => {
    const kavya = weeklyItems(items, person("kavya"), DEMO_START, "kavya");
    expect(kavya.some((i) => i.ownerId === null)).toBe(true);
    expect(kavya.some((i) => i.id === "check:brightline-invoice")).toBe(true);
    expect(kavya.length).toBeLessThan(items.length);
  });

  it("gives the IT admin no email", () => {
    expect(weeklyItems(items, person("vikram"), DEMO_START, "kavya")).toEqual([]);
  });

  it("drops items once someone acts", () => {
    const acted = buildItems({
      today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails,
      actions: { "check:brightline-invoice": { kind: "flagged", on: DEMO_START, by: "rohan" } },
    });
    expect(weeklyItems(acted, person("rohan"), DEMO_START, "kavya").some((i) => i.id === "check:brightline-invoice")).toBe(false);
  });
});

describe("weeklySubject", () => {
  it("says how much needs the reader and how much is urgent", () => {
    expect(weeklySubject(4, 1, DEMO_START)).toBe("Sonar, week of 16 Nov 2026: 4 things need you, 1 urgent");
    expect(weeklySubject(1, 0, DEMO_START)).toBe("Sonar, week of 16 Nov 2026: 1 thing needs you");
    expect(weeklySubject(0, 0, DEMO_START)).toBe("Sonar, week of 16 Nov 2026: nothing needs you");
  });
});
