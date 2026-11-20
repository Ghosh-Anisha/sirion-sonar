import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { draftFor, fillTemplate } from "./drafts";
import { buildItems, itemRefs, type ActionKind, type Item } from "./items";

const items = [
  ...buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} }),
  ...buildItems({ today: "2026-12-01", firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} }),
];

const draftOf = (item: Item, decision: ActionKind | null = null) => {
  const refs = itemRefs(item);
  return draftFor(item, decision, {
    vendor: vendors.find((v) => v.id === item.vendorId)!,
    contract: contracts.find((c) => c.id === refs.contractId),
    email: emails.find((e) => e.id === refs.emailId),
    sender: "Kavya Raman, Procurement lead",
  });
};
const byId = (id: string) => items.find((i) => i.id === id)!;

describe("fillTemplate", () => {
  it("fills every word and refuses to leave one empty", () => {
    expect(fillTemplate("Pay {amount} by {date}.", { amount: "Rs 1,000", date: "1 Mar 2027" })).toBe("Pay Rs 1,000 by 1 Mar 2027.");
    expect(() => fillTemplate("Pay {amount}.", {})).toThrow();
  });
});

describe("draftFor", () => {
  it("writes a renewal reply only after the owner decides", () => {
    const item = byId("decide:cloudmetric-subscription:2027-03-01");
    expect(draftOf(item)).toBeNull();
    expect(draftOf(item, "end")).toMatchObject({
      to: "accounts@cloudmetric.example",
      subject: "Notice: not renewing our Cloudmetric analytics subscription agreement",
    });
    expect(draftOf(item, "end")!.body).toContain("ends on 30 Apr 2027. We are giving it before 1 Mar 2027, as clause 3");
  });

  it("asks Brightline for a corrected invoice with the computed amounts", () => {
    const draft = draftOf(byId("check:brightline-invoice"))!;
    expect(draft.to).toBe("billing@brightline-logistics.example");
    expect(draft.body).toContain("Invoice BL/26-27/0871 comes to Rs 6,27,900.");
    expect(draft.body).toContain("clause 4 of our agreement, Rs 42 per km for a 10 tonne truck, the same work comes to Rs 5,73,300");
    expect(draft.body).toContain("difference of Rs 54,600");
  });

  it("offers Ledgerline the fee at the cap", () => {
    const draft = draftOf(byId("check:ledgerline-price-rise"))!;
    expect(draft.body).toContain("limited to 5%, and the new fee is 15% higher. We can accept a fee of up to Rs 68,250 a month.");
  });

  it("claims a service credit when Brightline misses its on-time level", () => {
    // The sample shipment log meets the level, so this checks the claim with a log that misses it.
    const late = emails.map((e) => (e.id === "brightline-invoice" ? { ...e, deliveries: { month: "2026-10", trips: 38, onTime: 34 } } : e));
    const fix = buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails: late, actions: {} }).find((i) => i.id === "fix:brightline-invoice")!;
    const draft = draftFor(fix, null, { vendor: vendors.find((v) => v.id === "brightline")!, contract: contracts.find((c) => c.id === "brightline-logistics"), email: late.find((e) => e.id === "brightline-invoice"), sender: "Rohan Das, Operations manager" })!;
    expect(draft.body).toContain("Please send a credit note for Rs 12,558.");
  });

  it("has no draft for an amendment, which is answered on Versions", () => {
    expect(draftOf(byId("change:orbis-amendment"))).toBeNull();
  });

  it("fills every placeholder on every item that has a draft", () => {
    for (const item of items) {
      for (const decision of [null, "renew", "renegotiate", "end"] as const) {
        const draft = draftOf(item, decision);
        if (!draft) continue;
        expect(`${draft.subject} ${draft.body}`, item.id).not.toMatch(/[{}]/);
        expect(`${draft.subject} ${draft.body}`, item.id).not.toMatch(/—|–|!/);
      }
    }
  });
});
