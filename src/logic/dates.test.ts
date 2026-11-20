import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { contractDates, noticeDeadline, noticeDeadlineFor, rollForward, yearlyPaymentMonth } from "./dates";

const factsOf = (id: string) => contracts.find((c) => c.id === id)!.facts;

describe("rollForward", () => {
  it("rolls the end date by the renewal term while it is on or before today", () => {
    expect(rollForward("2025-04-30", 12, "2026-11-19")).toBe("2027-04-30");
  });

  it("rolls when the end date is exactly today", () => {
    expect(rollForward("2026-11-19", 12, "2026-11-19")).toBe("2027-11-19");
  });

  it("leaves a future end date alone", () => {
    expect(rollForward("2027-06-30", 12, "2026-11-19")).toBe("2027-06-30");
  });

  it("leaves a contract that does not renew at its end date", () => {
    expect(rollForward("2026-01-31", null, "2026-11-19")).toBe("2026-01-31");
  });
});

describe("noticeDeadline", () => {
  it("is the end date minus the notice days", () => {
    expect(noticeDeadline("2027-04-30", 60)).toBe("2027-03-01");
  });

  it("is the end date itself with no notice period", () => {
    expect(noticeDeadline("2027-06-14", null)).toBe("2027-06-14");
  });
});

describe("noticeDeadlineFor", () => {
  it("counts days back from the end date", () => {
    expect(noticeDeadlineFor("2027-04-30", { days: 60, months: null })).toBe("2027-03-01");
  });

  it("counts calendar months back when the contract gives months, keeping month end", () => {
    expect(noticeDeadlineFor("2027-08-31", { days: null, months: 3 })).toBe("2027-05-31");
  });
});

describe("yearlyPaymentMonth", () => {
  it("finds a supplier paid in the same month each year", () => {
    expect(yearlyPaymentMonth(["2025-03-12", "2026-03-10"])).toBe(3);
  });

  it("needs two years and one month", () => {
    expect(yearlyPaymentMonth(["2026-03-10"])).toBeNull();
    expect(yearlyPaymentMonth(["2025-03-12", "2026-04-10"])).toBeNull();
    expect(yearlyPaymentMonth(["2026-03-01", "2026-03-20"])).toBeNull();
  });
});

describe("contractDates on the sample contracts", () => {
  it("Cloudmetric: rolls to 30 Apr 2027, notice deadline 1 Mar 2027, Derived", () => {
    expect(contractDates(factsOf("cloudmetric-subscription"), DEMO_START)).toMatchObject({
      label: "derived",
      endDate: "2027-04-30",
      noticeDeadline: "2027-03-01",
      autoRenews: true,
    });
  });

  it("Orbis: 1 Apr 2027 less 90 days of notice gives 1 Jan 2027", () => {
    expect(contractDates(factsOf("orbis-facilities"), DEMO_START)).toMatchObject({
      label: "derived",
      endDate: "2027-04-01",
      noticeDeadline: "2027-01-01",
    });
  });

  it("Greenleaf: the first year has passed, the Client's yearly option sets the next date, and it does not renew on its own", () => {
    expect(contractDates(factsOf("greenleaf-grounds"), DEMO_START)).toMatchObject({
      endDate: "2026-12-31",
      noticeDeadline: "2026-12-01",
      autoRenews: false,
    });
  });

  it("Arjun Rao: does not renew and gives no notice period, so the decision is due by the end date", () => {
    expect(contractDates(factsOf("arjun-rao-consultant"), DEMO_START)).toMatchObject({
      endDate: "2027-02-28",
      noticeDeadline: "2027-02-28",
      autoRenews: false,
    });
  });

  it("Datavane: every deadline fact checked by the owner, so Confirmed, with notice in months", () => {
    expect(contractDates(factsOf("datavane-subscription"), DEMO_START)).toMatchObject({
      label: "confirmed",
      endDate: "2027-08-31",
      noticeDeadline: "2027-05-31",
    });
  });

  it("Kestrel: unreadable start, paid every March, so a Bounded window", () => {
    const dates = contractDates(factsOf("kestrel-marketing"), DEMO_START, ["2025-03-14", "2026-03-12"]);
    expect(dates).toEqual({
      label: "bounded",
      endDate: null,
      noticeDeadline: null,
      earliestDeadline: "2027-01-29",
      latestDeadline: "2027-02-28",
      autoRenews: true,
    });
  });

  it("Kestrel without a payment rhythm has no window", () => {
    const dates = contractDates(factsOf("kestrel-marketing"), DEMO_START, []);
    expect(dates.label).toBe("bounded");
    expect(dates.earliestDeadline).toBeNull();
  });

  it("Pinecrest: Order Form missing, so Unknown with no dates", () => {
    expect(contractDates(factsOf("pinecrest-msa"), DEMO_START)).toEqual({
      label: "unknown",
      endDate: null,
      noticeDeadline: null,
      earliestDeadline: null,
      latestDeadline: null,
      autoRenews: false,
    });
  });

  it("moves with the clock: after 30 Apr 2027 Cloudmetric rolls a year on", () => {
    expect(contractDates(factsOf("cloudmetric-subscription"), "2027-04-30")).toMatchObject({
      endDate: "2028-04-30",
      noticeDeadline: "2028-03-01",
    });
  });
});
