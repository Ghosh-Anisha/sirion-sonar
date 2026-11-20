import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START, ORBIS_AMENDMENT_ARRIVES } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { people } from "../data/people";
import type { Email } from "../data/types";
import { vendors } from "../data/vendors";
import { traceEmail, type InboundContext } from "./inbound";
import { buildItems } from "./items";
import { paidByVendor } from "./match";

const ctx: InboundContext = {
  vendors,
  contracts,
  originals: contracts,
  paid: paidByVendor(payments, vendors, DEMO_START),
  items: buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} }),
  people,
  procurementLeadId: "kavya",
  today: DEMO_START,
};
const trace = (id: string) => traceEmail(emails.find((e) => e.id === id)!, ctx);
const result = (id: string, stage: string) => trace(id).stages.find((s) => s.id === stage)!.result;

describe("traceEmail", () => {
  it("steps every sample email through all six stages in order", () => {
    for (const email of emails) {
      expect(traceEmail(email, ctx).stages.map((s) => s.id), email.id).toEqual(["read", "recognise", "look-up", "compare", "explain", "route"]);
    }
  });

  it("routes the Orbis amendment to Versions, not to the list, once it arrives", () => {
    const arrived: InboundContext = {
      ...ctx,
      today: ORBIS_AMENDMENT_ARRIVES,
      items: buildItems({ today: ORBIS_AMENDMENT_ARRIVES, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} }),
    };
    const t = traceEmail(emails.find((e) => e.id === "orbis-amendment")!, arrived);
    expect(t.route).toEqual({ kind: "versions", contractId: "orbis-facilities", to: "/versions/orbis-facilities" });
    expect(t.stages.find((s) => s.id === "compare")!.result).toBe(
      "Changes clauses 2, 3, 4. The end date would move from 1 Apr 2027 to 31 Mar 2028, and the notice deadline from 1 Jan 2027 to 2 Dec 2027.",
    );
    expect(t.stages.find((s) => s.id === "route")!.result).toContain("Farah Siddiqui to accept or reject");
  });

  it("ends the Brightline email as a Check item with the invoice, the agreed rate and the clause, and finds the on-time level met", () => {
    expect(trace("brightline-invoice").route).toMatchObject({ kind: "item", itemIds: ["check:brightline-invoice"] });
    expect(result("brightline-invoice", "compare")).toBe(
      "Billed Rs 6,27,900. At Rs 42 per km for a 10 tonne truck in clause 4, the same work comes to Rs 5,73,300, so it is Rs 54,600 over. 37 of 38 trips on time in October, 97.4%, at or above the 95% in the contract.",
    );
    expect(result("brightline-invoice", "route")).toBe("Added an item to Needs you for Rohan Das.");
  });

  it("compares Ledgerline's price rise with the cap, and sends it to the procurement lead because nobody owns it", () => {
    expect(result("ledgerline-price-rise", "compare")).toBe("A 15% rise against a cap of 5% at most in clause 5. It is over the cap by 10%.");
    expect(result("ledgerline-price-rise", "route")).toBe("Added an item to Needs you for Kavya Raman, because nobody owns this supplier.");
  });

  it("files a matching invoice with no item", () => {
    expect(trace("datavane-invoice").route).toEqual({ kind: "filed", contractId: "datavane-subscription" });
    expect(result("datavane-invoice", "compare")).toBe("Billed Rs 9,60,000, which matches Rs 9,60,000 a year in clause 4.");
    expect(result("datavane-invoice", "explain")).toBe("It matches the contract, so nothing needs a person.");
  });

  it("adds an email from a supplier with no contract to its Find item", () => {
    expect(result("bluepeak-invoice", "look-up")).toMatch(/^No contract on file for Bluepeak Security Services\. 1 payment totalling Rs 56,000/);
    expect(trace("bluepeak-invoice").route).toMatchObject({ kind: "item", itemIds: ["find:bluepeak"] });
  });

  it("stops at recognise when the sender is not a known supplier", () => {
    const stranger: Email = { ...emails[0], id: "stranger", from: { name: "A", address: "a@unknown.example" }, amendment: undefined };
    const t = traceEmail(stranger, ctx);
    expect(t.route).toEqual({ kind: "unknown" });
    expect(t.stages.map((s) => s.id)).toEqual(["read", "recognise"]);
  });
});
