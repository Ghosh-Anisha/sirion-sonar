import { describe, expect, it } from "vitest";
import { payments } from "../data/payments";
import type { Payment } from "../data/types";
import { vendors } from "../data/vendors";
import { classifyPayment, supplierPayments } from "./classify";

const line = (payee: string): Payment => ({ id: "x", date: "2026-11-01", payee, amount: 1000, reference: "" });
const ruleFor = (payee: string) => classifyPayment(line(payee)).rule;
const resultFor = (payee: string) => classifyPayment(line(payee)).result;

describe("classifyPayment", () => {
  it("drops payroll, tax, EMI, own transfers, refunds and reimbursements", () => {
    expect(ruleFor("SALARY PAYOUT OCT-2026 BULK")).toBe("payroll");
    expect(ruleFor("TDS CHALLAN 281 OCT")).toBe("tax");
    expect(ruleFor("GST PAYMENT SEP 2026")).toBe("tax");
    expect(ruleFor("EMI TERM LOAN A/C XX4471")).toBe("loan");
    expect(ruleFor("TRF TO OWN A/C XX9902")).toBe("own-transfer");
    expect(ruleFor("REFUND ORDER 55821")).toBe("refund");
    expect(ruleFor("EMP REIMB TRAVEL S PATIL")).toBe("reimbursement");
    for (const payee of ["SALARY PAYOUT", "TDS CHALLAN", "EMI LOAN", "TRF TO OWN A/C", "REFUND ORDER 1", "EMP REIMB"]) {
      expect(resultFor(payee), payee).toBe("not-supplier");
    }
  });

  it("keeps a supplier whose name contains a drop word", () => {
    expect(classifyPayment(line("LEDGERLINE PAYROLL SERVICES PVT LTD"))).toMatchObject({
      result: "supplier",
      rule: "business-name",
    });
    expect(resultFor("Ledgerline Payroll Svcs")).toBe("supplier");
  });

  it("sends cash and payments to a person to not sure", () => {
    expect(classifyPayment(line("PETTY CASH TOP UP"))).toMatchObject({ result: "not-sure", rule: "cash" });
    expect(classifyPayment(line("R K SHARMA"))).toMatchObject({ result: "not-sure", rule: "person-name" });
  });

  it("includes anything no rule catches, and says so", () => {
    const result = classifyPayment(line("COPPERLEAF COURIER"));
    expect(result).toMatchObject({ result: "supplier", rule: "kept" });
    expect(result.explanation).toMatch(/include/);
  });

  it("returns the rule and an explanation for every line", () => {
    for (const p of payments) {
      const c = classifyPayment(p);
      expect(c.paymentId).toBe(p.id);
      expect(c.rule).not.toBe("");
      expect(c.explanation).not.toBe("");
    }
  });
});

describe("on the sample payments", () => {
  const isVendorLine = (p: Payment) => vendors.some((v) => v.aliases.includes(p.payee));

  it("keeps every line paid to a known supplier", () => {
    for (const p of payments.filter(isVendorLine)) expect(classifyPayment(p).result, p.payee).toBe("supplier");
  });

  it("keeps nothing that is not a supplier", () => {
    expect(supplierPayments(payments).every(isVendorLine)).toBe(true);
  });

  it("splits the 62 lines into 48 supplier, 12 dropped and 2 not sure", () => {
    const counts = { supplier: 0, "not-supplier": 0, "not-sure": 0 };
    for (const p of payments) counts[classifyPayment(p).result] += 1;
    expect(counts).toEqual({ supplier: 48, "not-supplier": 12, "not-sure": 2 });
  });
});
