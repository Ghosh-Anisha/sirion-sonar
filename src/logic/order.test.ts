import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import type { Item } from "./items";
import { compareReview, orderItems, reviewQueue, type ReviewEntry } from "./order";

const entry = (contractId: string, label: ReviewEntry["label"], earliestDeadline: string | null): ReviewEntry => ({
  contractId,
  vendorId: contractId,
  label,
  earliestDeadline,
});

describe("compareReview", () => {
  it("puts Unknown and Bounded ahead of tidy contracts, even with later deadlines", () => {
    const sorted = [entry("tidy", "derived", "2026-12-01"), entry("bounded", "bounded", "2027-02-01"), entry("unknown", "unknown", null)].sort(compareReview);
    expect(sorted.map((e) => e.contractId)).toEqual(["unknown", "bounded", "tidy"]);
  });

  it("orders by earliest possible deadline within each group", () => {
    const sorted = [entry("b", "derived", "2027-03-01"), entry("a", "derived", "2026-12-10")].sort(compareReview);
    expect(sorted.map((e) => e.contractId)).toEqual(["a", "b"]);
  });
});

describe("reviewQueue on the sample data", () => {
  it("is the confirmation queue: riskiest first, confirmed contracts left out", () => {
    expect(reviewQueue(contracts, payments, vendors, DEMO_START).map((e) => [e.contractId, e.earliestDeadline])).toEqual([
      ["pinecrest-msa", null],
      ["kestrel-freight", "2027-01-29"],
      ["ledgerline-payroll", "2026-12-01"],
      ["quillstone-retainer", "2026-12-10"],
      ["orbis-facilities", "2027-01-01"],
      ["cloudmetric-subscription", "2027-03-01"],
      ["vantage-print", "2027-03-01"],
      ["brightline-logistics", "2027-04-01"],
      ["northstar-seats", "2027-05-02"],
      ["greenleaf-water", "2027-06-14"],
      ["greenleaf-pantry", "2027-08-31"],
    ]);
  });
});

describe("orderItems", () => {
  const item = (id: string, type: Item["type"], dueDate: string) => ({ id, type, dueDate }) as Item;

  it("orders by due date, then type, then id", () => {
    const ordered = orderItems([item("z", "find", "2026-12-19"), item("b", "check", "2026-12-01"), item("a", "decide", "2026-12-01")]);
    expect(ordered.map((i) => i.id)).toEqual(["a", "b", "z"]);
  });
});
