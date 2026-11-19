import { describe, expect, it } from "vitest";
import type { Fact, FactField, Label } from "../data/types";
import { deadlineFacts, deadlineLabel, weakestLabel } from "./labels";

const f = (field: FactField, label: Label, value: Fact["value"] = 1): Fact => ({
  field,
  value,
  sentence: "",
  clauseId: "1",
  page: 1,
  label,
  confirmedBy: label === "confirmed" ? "someone" : null,
});

describe("weakestLabel", () => {
  it("is only as strong as the weakest input", () => {
    expect(weakestLabel(["confirmed", "derived"])).toBe("derived");
    expect(weakestLabel(["confirmed", "bounded", "derived"])).toBe("bounded");
    expect(weakestLabel(["unknown", "confirmed"])).toBe("unknown");
    expect(weakestLabel(["confirmed", "confirmed"])).toBe("confirmed");
    expect(weakestLabel([])).toBe("unknown");
  });
});

describe("deadlineLabel", () => {
  it("is Confirmed when a person checked every fact the deadline uses", () => {
    expect(deadlineLabel([f("endDate", "confirmed", "2027-03-31"), f("noticeDays", "confirmed")])).toBe("confirmed");
  });

  it("is Derived when the system read it and nobody has checked", () => {
    expect(deadlineLabel([f("startDate", "derived", "2026-02-01"), f("termMonths", "derived")])).toBe("derived");
    expect(deadlineLabel([f("endDate", "confirmed", "2027-06-30"), f("noticeDays", "derived")])).toBe("derived");
  });

  it("is Bounded when the term is known but the start date is not", () => {
    expect(deadlineLabel([f("startDate", "bounded", null), f("termMonths", "derived")])).toBe("bounded");
  });

  it("is Unknown when the term is missing", () => {
    expect(deadlineLabel([f("startDate", "derived", "2025-09-10"), f("termMonths", "unknown", null)])).toBe("unknown");
    expect(deadlineLabel([f("startDate", "derived", "2025-09-10")])).toBe("unknown");
    expect(deadlineLabel([])).toBe("unknown");
  });

  it("ignores facts the deadline does not use, such as fees", () => {
    const facts = [f("endDate", "confirmed", "2027-03-31"), f("monthlyFee", "derived")];
    expect(deadlineFacts(facts)?.map((x) => x.field)).toEqual(["endDate"]);
    expect(deadlineLabel(facts)).toBe("confirmed");
  });

  it("uses the end date over start plus term when both exist", () => {
    const facts = [f("startDate", "derived", "2026-01-01"), f("termMonths", "derived"), f("endDate", "confirmed", "2026-12-31")];
    expect(deadlineLabel(facts)).toBe("confirmed");
  });
});
