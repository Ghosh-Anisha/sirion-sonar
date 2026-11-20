import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import type { Contract, Email } from "../data/types";
import { costLink, exposureWithin, storyCosts, type StoryCost } from "./storyCosts";

const byKind = (costs: StoryCost[]) => Object.fromEntries(costs.map((c) => [c.kind, c]));

describe("storyCosts", () => {
  it("works out the five costs from the sample data", () => {
    const costs = byKind(storyCosts(contracts, emails, DEMO_START));
    expect(costs.renewal).toMatchObject({ amount: 1800000, dueDate: "2027-03-01" });
    expect(costs["price-rise"]).toMatchObject({
      increasePercent: 15,
      capPercent: 5,
      overMonthly: 6500,
      amount: 78000,
      noticeDays: 60,
      noticeBy: "2026-11-01",
      receivedOn: "2026-11-18",
      late: true,
      dueDate: "2026-12-01",
    });
    expect(costs.invoice).toMatchObject({ amount: 54600, dueDate: "2026-12-15" });
    expect(costs.lapse).toMatchObject({ amount: 600000, dueDate: "2026-12-01" });
    expect(costs.retainer).toMatchObject({ monthlyFee: 250000, months: 12, amount: 3000000, dueDate: "2026-12-10" });
  });

  it("follows the data when it changes", () => {
    const edited: Contract[] = contracts.map((c) =>
      c.id === "cloudmetric-subscription"
        ? { ...c, facts: c.facts.map((f) => (f.field === "annualFee" ? { ...f, value: 2400000 } : f.field === "noticeDays" ? { ...f, value: 90 } : f)) }
        : c,
    );
    const mail: Email[] = emails.map((e) =>
      e.priceChange ? { ...e, receivedOn: "2026-10-20", priceChange: { ...e.priceChange, newMonthlyFee: 71500 } } : e,
    );
    const costs = byKind(storyCosts(edited, mail, DEMO_START));
    expect(costs.renewal).toMatchObject({ amount: 2400000, dueDate: "2027-01-30" });
    expect(costs["price-rise"]).toMatchObject({ increasePercent: 10, overMonthly: 3250, amount: 39000, late: false });
  });

  it("says which data is missing rather than showing a wrong figure", () => {
    expect(() => storyCosts(contracts.filter((c) => c.id !== "quillstone-retainer"), emails, DEMO_START)).toThrow(/quillstone-retainer/);
  });
});

describe("exposureWithin", () => {
  it("totals the costs due in the first 30 days of the demo and leaves Cloudmetric out", () => {
    const exposure = exposureWithin(storyCosts(contracts, emails, DEMO_START), DEMO_START, 30);
    expect(exposure.to).toBe("2026-12-18");
    expect(exposure.included.map((c) => c.kind)).toEqual(["price-rise", "invoice", "lapse", "retainer"]);
    expect(exposure.left.map((c) => c.kind)).toEqual(["renewal"]);
    expect(exposure.total).toBe(78000 + 54600 + 600000 + 3000000);
  });
});

describe("costLink", () => {
  it("links each card to its item in the demo, and Cloudmetric to its contract", () => {
    const links = storyCosts(contracts, emails, DEMO_START).map(costLink);
    expect(links).toEqual([
      "/contract/cloudmetric-subscription",
      "/item/check%3Aledgerline-price-rise",
      "/item/check%3Abrightline-invoice",
      "/item/decide%3Agreenleaf-grounds%3A2026-12-01",
      "/item/decide%3Aquillstone-retainer%3A2026-12-10",
    ]);
  });
});
