import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { itemEvidence } from "./evidence";
import { buildItems, itemRefs } from "./items";

const items = buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });
const evidenceFor = (id: string) => {
  const item = items.find((i) => i.id === id)!;
  return itemEvidence(item, contracts.find((c) => c.id === itemRefs(item).contractId));
};

describe("itemEvidence", () => {
  it("shows a renewal's dates and every fact they rest on, with sentences", () => {
    const evidence = evidenceFor("decide:orbis-facilities:2027-01-01");
    expect(evidence.map((e) => [e.label, e.value])).toEqual([
      ["Current term ends", "1 Apr 2027"],
      ["Last day to give notice", "1 Jan 2027"],
      ["End date", "1 Apr 2027"],
      ["Renews for", "12 months"],
      ["Notice period", "90 days"],
    ]);
    expect(evidence.slice(2).every((e) => e.fact && e.contractId === "orbis-facilities")).toBe(true);
  });

  it("shows a Bounded deadline as a window and the unreadable start date", () => {
    const evidence = evidenceFor("decide:kestrel-marketing:2027-01-29");
    expect(evidence[1]).toMatchObject({ value: "Between 29 Jan 2027 and 28 Feb 2027", confidence: "bounded" });
    expect(evidence.find((e) => e.label === "Start date")).toMatchObject({ value: "Unreadable in the file", confidence: "bounded" });
  });

  it("shows Brightline's invoice, the agreed amount and the clause", () => {
    const evidence = evidenceFor("check:brightline-invoice");
    expect(evidence.map((e) => e.value)).toEqual(["Rs 6,27,900", "Rs 5,73,300", "Rs 54,600", "Rs 42 per km for a 10 tonne truck"]);
    expect(evidence[3].fact?.sentence).toContain("Rs 42 per kilometre for a 10 tonne truck");
  });
});
