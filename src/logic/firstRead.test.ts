import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { planFirstRead, tally } from "./firstRead";

const plan = planFirstRead(vendors, contracts, payments, emails);

describe("planFirstRead", () => {
  it("sorts every payment line and says which rule decided it", () => {
    expect(plan.lines).toHaveLength(payments.length);
    const dropped = plan.lines.filter((l) => l.result === "not-supplier");
    expect(dropped.map((l) => l.rule)).toEqual(expect.arrayContaining(["payroll", "tax", "loan", "own-transfer", "refund", "reimbursement"]));
  });

  it("builds 24 suppliers from the kept lines, with two name pairs for a person to settle", () => {
    expect(plan.supplierGroups.length - plan.unsureNames.length).toBe(24);
    expect(plan.unsureNames).toHaveLength(2);
  });

  it("reads all 24 suppliers, highest spend first", () => {
    expect(plan.steps).toHaveLength(24);
    const spends = plan.steps.map((s) => s.spend);
    expect(spends).toEqual([...spends].sort((a, b) => b - a));
  });

  it("ends at 9 found, 2 partial and 13 not found", () => {
    expect(tally(plan.steps, plan.steps.length)).toEqual({ full: 9, partial: 2, none: 13 });
    expect(tally(plan.steps, 0)).toEqual({ full: 0, partial: 0, none: 0 });
  });

  it("explains partial reads with what is missing", () => {
    const kestrel = plan.steps.find((s) => s.vendorId === "kestrel")!;
    expect(kestrel).toMatchObject({ result: "partial", files: ["Ops/Scans/SCAN_0047.pdf"] });
    expect(kestrel.note).toMatch(/unreadable/);
  });

  it("logs every file and message it opened, and the searches that opened nothing", () => {
    expect(plan.access[0]).toMatchObject({ source: "payables" });
    expect(plan.access.filter((a) => a.source === "drive" && a.text.startsWith("Opened"))).toHaveLength(contracts.length);
    expect(plan.access.filter((a) => a.text.includes("Opened nothing"))).toHaveLength(13);
    expect(plan.access.filter((a) => a.source === "mail")).toHaveLength(emails.length);
  });
});
