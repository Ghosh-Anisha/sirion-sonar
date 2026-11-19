import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
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

  it("routes the Orbis amendment to Versions, not to the list", () => {
    expect(trace("orbis-amendment").route).toEqual({ kind: "versions", contractId: "orbis-facilities", to: "/versions/orbis-facilities" });
    expect(result("orbis-amendment", "compare")).toBe(
      "Changes clauses 2, 3, 5. The end date would move from 31 Jan 2027 to 30 Jun 2027, and the notice deadline from 1 Jan 2027 to 1 May 2027.",
    );
    expect(result("orbis-amendment", "route")).toContain("Farah Siddiqui to accept or reject");
  });

  it("ends the Brightline email as a Check item with the invoice, the agreed rate and the clause, plus a Fix", () => {
    expect(trace("brightline-invoice").route).toMatchObject({ kind: "item", itemIds: ["check:brightline-invoice", "fix:brightline-invoice"] });
    expect(result("brightline-invoice", "compare")).toBe(
      "Billed Rs 8,31,600. At Rs 18,500 per trip in clause 3, the same work comes to Rs 7,77,000, so it is Rs 54,600 over. 38 of 42 trips on time in October, 90.5%, below the 95% in the contract.",
    );
    expect(result("brightline-invoice", "route")).toBe("Added 2 items to Needs you for Rohan Das.");
  });

  it("compares Ledgerline's price rise with the cap, and sends it to the procurement lead because nobody owns it", () => {
    expect(result("ledgerline-price-rise", "compare")).toBe("A 15% rise against a cap of 7% at most in clause 3. It is over the cap by 8%.");
    expect(result("ledgerline-price-rise", "route")).toBe("Added an item to Needs you for Kavya Raman, because nobody owns this supplier.");
  });

  it("files a matching invoice with no item", () => {
    expect(trace("greenleaf-invoice").route).toEqual({ kind: "filed", contractId: "greenleaf-pantry" });
    expect(result("greenleaf-invoice", "explain")).toBe("It matches the contract, so nothing needs a person.");
  });

  it("adds an email from a supplier with no contract to its Find item", () => {
    expect(result("bluepeak-invoice", "look-up")).toMatch(/^No contract on file for Bluepeak Security Services\. 2 payments totalling Rs 1,12,000/);
    expect(trace("bluepeak-invoice").route).toMatchObject({ kind: "item", itemIds: ["find:bluepeak"] });
  });

  it("stops at recognise when the sender is not a known supplier", () => {
    const stranger: Email = { ...emails[0], id: "stranger", from: { name: "A", address: "a@unknown.example" }, amendment: undefined };
    const t = traceEmail(stranger, ctx);
    expect(t.route).toEqual({ kind: "unknown" });
    expect(t.stages.map((s) => s.id)).toEqual(["read", "recognise"]);
  });
});
