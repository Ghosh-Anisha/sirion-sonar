import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { contractDates } from "./dates";
import { applyFactEdits, parseFactInput, type FactEdits } from "./edits";
import { findFact } from "./facts";
import { buildItems } from "./items";

const cloudmetric = contracts.find((c) => c.id === "cloudmetric-subscription")!;
const pinecrest = contracts.find((c) => c.id === "pinecrest-msa")!;

describe("applyFactEdits", () => {
  it("confirming a fact keeps its value and makes it Confirmed by that person", () => {
    const edited = applyFactEdits(cloudmetric, { endDate: { kind: "confirmed", value: "2025-04-30", by: "neha", on: DEMO_START } });
    expect(findFact(edited.facts, "endDate")).toMatchObject({ value: "2025-04-30", label: "confirmed", confirmedBy: "neha" });
    expect(findFact(cloudmetric.facts, "endDate")!.label).toBe("derived");
  });

  it("correcting a fact changes its value but never its source sentence", () => {
    const edited = applyFactEdits(cloudmetric, { noticeDays: { kind: "corrected", value: 90, by: "neha", on: DEMO_START } });
    const before = findFact(cloudmetric.facts, "noticeDays")!;
    expect(findFact(edited.facts, "noticeDays")).toMatchObject({ value: 90, label: "confirmed", sentence: before.sentence });
  });

  it("returns the same contract when there are no edits", () => {
    expect(applyFactEdits(cloudmetric, {})).toBe(cloudmetric);
  });
});

describe("a correction flows through to the dates and the list", () => {
  const itemsWith = (edits: Record<string, FactEdits>, today: string) =>
    buildItems({
      today,
      firstReadOn: DEMO_START,
      vendors,
      contracts: contracts.map((c) => applyFactEdits(c, edits[c.id] ?? {})),
      payments,
      emails,
      actions: {},
    });

  it("moves Cloudmetric's notice deadline when the notice period is corrected", () => {
    const edited = applyFactEdits(cloudmetric, { noticeDays: { kind: "corrected", value: 90, by: "neha", on: DEMO_START } });
    expect(contractDates(edited.facts, DEMO_START).noticeDeadline).toBe("2027-01-30");
  });

  it("brings Cloudmetric onto the list on the first day once its deadline is within 90 days", () => {
    const edits = { "cloudmetric-subscription": { noticeDays: { kind: "corrected" as const, value: 90, by: "neha", on: DEMO_START } } };
    expect(itemsWith({}, DEMO_START).some((i) => i.vendorId === "cloudmetric")).toBe(false);
    expect(itemsWith(edits, DEMO_START).find((i) => i.vendorId === "cloudmetric")).toMatchObject({ type: "decide", dueDate: "2027-01-30" });
  });

  it("turns Pinecrest from Unknown into a dated contract once the term is typed in", () => {
    const edited = applyFactEdits(pinecrest, { termMonths: { kind: "corrected", value: 18, by: "neha", on: DEMO_START } });
    expect(contractDates(edited.facts, DEMO_START)).toMatchObject({
      label: "derived",
      endDate: "2027-03-09",
      noticeDeadline: "2027-02-07",
    });
  });
});

describe("parseFactInput", () => {
  it("accepts real dates only", () => {
    expect(parseFactInput("endDate", "2027-04-30")).toEqual({ ok: true, value: "2027-04-30" });
    expect(parseFactInput("endDate", "2027-02-30").ok).toBe(false);
    expect(parseFactInput("endDate", "30/04/2027").ok).toBe(false);
  });

  it("accepts whole numbers for periods and amounts above zero for money", () => {
    expect(parseFactInput("noticeDays", "90")).toEqual({ ok: true, value: 90 });
    expect(parseFactInput("noticeDays", "90.5")).toEqual({ ok: false, error: "Enter a whole number." });
    expect(parseFactInput("monthlyFee", "1,20,000")).toEqual({ ok: true, value: 120000 });
    expect(parseFactInput("unitRate", "4.20")).toEqual({ ok: true, value: 4.2 });
    expect(parseFactInput("monthlyFee", "0").ok).toBe(false);
    expect(parseFactInput("monthlyFee", "").ok).toBe(false);
  });
});
