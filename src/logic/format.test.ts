import { describe, expect, it } from "vitest";
import { formatDate, formatMoney, formatMonthName, formatPercent, formatShortDate } from "./format";

describe("formatShortDate, formatMonthName and formatPercent", () => {
  it("formats for use inside sentences", () => {
    expect(formatShortDate("2027-03-01")).toBe("1 Mar");
    expect(formatMonthName("2026-10")).toBe("October");
    expect(formatPercent(15)).toBe("15%");
    expect(formatPercent(90.48)).toBe("90.5%");
  });
});

describe("formatDate", () => {
  it("shows day, short month and year", () => {
    expect(formatDate("2027-03-14")).toBe("14 Mar 2027");
    expect(formatDate("2026-11-19")).toBe("19 Nov 2026");
  });

  it("drops the leading zero on the day", () => {
    expect(formatDate("2027-03-01")).toBe("1 Mar 2027");
  });

  it("rejects anything that is not an ISO date", () => {
    expect(() => formatDate("14/03/2027")).toThrow();
    expect(() => formatDate("2027-13-01")).toThrow();
  });
});

describe("formatMoney", () => {
  it("uses Indian grouping", () => {
    expect(formatMoney(120000)).toBe("Rs 1,20,000");
    expect(formatMoney(123456789)).toBe("Rs 12,34,56,789");
    expect(formatMoney(1000)).toBe("Rs 1,000");
    expect(formatMoney(999)).toBe("Rs 999");
    expect(formatMoney(0)).toBe("Rs 0");
  });

  it("shows paise only when there are some", () => {
    expect(formatMoney(1500.5)).toBe("Rs 1,500.50");
    expect(formatMoney(1500)).toBe("Rs 1,500");
  });

  it("puts the sign before Rs", () => {
    expect(formatMoney(-25000)).toBe("-Rs 25,000");
  });
});
