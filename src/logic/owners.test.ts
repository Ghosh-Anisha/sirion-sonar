import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { suggestedOwners } from "../data/sources";
import { vendors } from "../data/vendors";
import { buildItems } from "./items";
import { itemsFromSource, proposedOwner, withOwners } from "./owners";

const items = buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });

describe("withOwners", () => {
  it("keeps the sample owners until someone sets one", () => {
    expect(withOwners(vendors, {})).toBe(vendors);
    const set = withOwners(vendors, { riverstone: "rohan", meridian: null });
    expect(set.find((v) => v.id === "riverstone")!.ownerId).toBe("rohan");
    expect(set.find((v) => v.id === "meridian")!.ownerId).toBeNull();
    expect(set.find((v) => v.id === "orbis")!.ownerId).toBe("farah");
  });
});

describe("proposedOwner", () => {
  it("leaves two suppliers with no contract unassigned on purpose", () => {
    const none = vendors.filter((v) => v.contractStatus === "none");
    expect(none.filter((v) => proposedOwner(v, suggestedOwners) === null).map((v) => v.id)).toEqual(["copperleaf", "banyan"]);
  });
});

describe("itemsFromSource", () => {
  it("finds the open items each source feeds", () => {
    expect(itemsFromSource("payables", items)).toHaveLength(13);
    expect(itemsFromSource("drive", items).every((i) => i.type === "decide")).toBe(true);
    expect(itemsFromSource("mail", items).length).toBeGreaterThan(0);
    expect(itemsFromSource("mail", items).every((i) => i.reason === "arrival" || i.reason === "change")).toBe(true);
  });
});
