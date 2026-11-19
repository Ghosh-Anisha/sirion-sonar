import { describe, expect, it } from "vitest";
import type { Fact, Invoice } from "../data/types";
import { checkInvoice, invoiceTotal, onTimePercent, percentIncrease, serviceCredit, type RateTerm } from "./checks";

const rate = (contractId: string, value: number): RateTerm => ({
  contractId,
  fact: { field: "unitRate", value, sentence: "", clauseId: "1", page: 1, label: "derived", confirmedBy: null } as Fact,
});

const invoice = (lines: Invoice["lines"]): Invoice => ({ number: "1", date: "2026-11-15", lines });

describe("checkInvoice", () => {
  it("measures the difference against the agreed rate", () => {
    const result = checkInvoice(invoice([{ description: "trip", quantity: 42, unitRate: 19800 }]), [rate("a", 18500)]);
    expect(result).toMatchObject({ invoiced: 831600, agreed: 777000, difference: 54600 });
  });

  it("picks the closest agreed rate when a supplier has several contracts", () => {
    const result = checkInvoice(invoice([{ description: "pantry", quantity: 1, unitRate: 42000 }]), [
      rate("water", 6500),
      rate("pantry", 42000),
    ]);
    expect(result).toMatchObject({ difference: 0, term: { contractId: "pantry" } });
  });

  it("returns null with nothing to compare against", () => {
    expect(checkInvoice(invoice([{ description: "x", quantity: 1, unitRate: 5 }]), [])).toBeNull();
  });
});

describe("money and percentages", () => {
  it("totals invoice lines, keeping paise", () => {
    expect(invoiceTotal(invoice([{ description: "pages", quantity: 9200, unitRate: 4.2 }]))).toBe(38640);
    expect(invoiceTotal(invoice([{ description: "x", quantity: 3, unitRate: 0.1 }]))).toBe(0.3);
  });

  it("computes the increase, the on time share and the credit", () => {
    expect(percentIncrease(65000, 74750)).toBe(15);
    expect(onTimePercent({ month: "2026-10", trips: 42, onTime: 38 })).toBe(90.48);
    expect(onTimePercent({ month: "2026-10", trips: 0, onTime: 0 })).toBe(100);
    expect(serviceCredit(831600, 5)).toBe(41580);
  });
});
