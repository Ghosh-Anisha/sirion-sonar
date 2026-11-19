import { describe, expect, it } from "vitest";
import { addDays, addMonths, daysBetween, termEnd } from "./calendar";

describe("addDays", () => {
  it("crosses month and year ends", () => {
    expect(addDays("2027-04-30", -60)).toBe("2027-03-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("addMonths", () => {
  it("keeps a month-end date at month end", () => {
    expect(addMonths("2025-04-30", 12)).toBe("2026-04-30");
    expect(addMonths("2026-02-28", 12)).toBe("2027-02-28");
    expect(addMonths("2024-02-29", 12)).toBe("2025-02-28");
    expect(addMonths("2026-04-30", 1)).toBe("2026-05-31");
  });

  it("clamps other days to the target month", () => {
    expect(addMonths("2026-01-30", 1)).toBe("2026-02-28");
    expect(addMonths("2026-03-15", -3)).toBe("2025-12-15");
  });
});

describe("termEnd", () => {
  it("ends the day before the same date a term later", () => {
    expect(termEnd("2026-02-01", 12)).toBe("2027-01-31");
    expect(termEnd("2025-01-01", 24)).toBe("2026-12-31");
    expect(termEnd("2026-03-31", 12)).toBe("2027-03-30");
  });
});

describe("daysBetween", () => {
  it("counts whole days, negative when going back", () => {
    expect(daysBetween("2026-11-19", "2027-03-01")).toBe(102);
    expect(daysBetween("2027-03-01", "2026-11-19")).toBe(-102);
  });
});
