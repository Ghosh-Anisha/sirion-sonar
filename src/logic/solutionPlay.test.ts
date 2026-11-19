import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { buildItems } from "./items";
import { invoicePlay } from "./solutionPlay";

const items = buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });

describe("invoicePlay", () => {
  it("follows the Brightline invoice in six steps with real amounts", () => {
    const steps = invoicePlay(items.find((i) => i.id === "check:brightline-invoice"), "Brightline Logistics", "Rohan Das", "Arjun Mehta");
    expect(steps).toHaveLength(6);
    expect(steps[0].caption).toBe("Brightline Logistics sends invoice BL/26-27/0871 for Rs 8,31,600.");
    expect(steps[2].caption).toBe("The contract and its agreed rate of Rs 18,500 per trip are looked up.");
    expect(steps[3].caption).toBe("Code finds the difference: Rs 54,600 above the agreed rate.");
    expect(steps[4].lit).toEqual(["cockpit-check:brightline-invoice"]);
    expect(steps.flatMap((s) => s.caption).join(" ")).not.toMatch(/[—–!]/);
  });

  it("has nothing to play without the invoice", () => {
    expect(invoicePlay(undefined, "", "", "")).toEqual([]);
  });
});
