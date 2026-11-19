import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { actionOptions, actionPastTense, itemTitle } from "./actions";
import { buildItems } from "./items";

const items = buildItems({ today: "2026-12-01", firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });

describe("actionOptions", () => {
  it("offers renew, renegotiate or end on a renewal", () => {
    const decide = items.find((i) => i.type === "decide")!;
    expect(actionOptions(decide).map((o) => o.kind)).toEqual(["renew", "renegotiate", "end"]);
  });

  it("offers accept or flag for finance on an invoice check", () => {
    const check = items.find((i) => i.id === "check:brightline-invoice")!;
    expect(actionOptions(check).map((o) => o.label)).toEqual(["Accept the invoice", "Flag for finance"]);
  });

  it("never offers to pay, hold, sign or send", () => {
    for (const item of items) {
      for (const option of actionOptions(item)) {
        expect(option.label, item.id).not.toMatch(/\b(pay|hold|sign|send)\b/i);
        expect(option.kind).not.toBe("sent");
      }
    }
  });

  it("names every item and every action in plain words", () => {
    for (const item of items) expect(itemTitle(item)).not.toBe("");
    expect(actionPastTense("renegotiate")).toBe("chose to renegotiate");
  });
});
