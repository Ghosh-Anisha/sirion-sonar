import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START, ORBIS_AMENDMENT_ARRIVES } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { people } from "../data/people";
import { vendors } from "../data/vendors";
import { routeItem } from "./alerts";
import { amendmentItemId } from "./arrivals";
import { contractDates } from "./dates";
import { numberValue } from "./facts";
import { buildItems, currentContracts, type ItemAction } from "./items";
import { paidByVendor } from "./match";
import { measures } from "./measures";

/*
 * The acceptance checks from docs/spec.md that can be tested without a screen.
 * Check 1 (a viewer can follow the demo) and 6 (no button pays, holds, signs or
 * sends without a click) are about screens.
 */

const leadId = people.find((p) => p.role === "procurement-lead")!.id;

const itemsOn = (today: string, actions: Record<string, ItemAction> = {}) =>
  buildItems({ today, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions });

const cloudmetricDecide = (today: string) =>
  itemsOn(today).find((i) => i.type === "decide" && i.vendorId === "cloudmetric");

describe("Check 2: the clock adds a Cloudmetric Decide item, then escalates it", () => {
  it("has no item on the first day, 102 days before the notice deadline", () => {
    expect(cloudmetricDecide(DEMO_START)).toBeUndefined();
    expect(cloudmetricDecide("2026-11-30")).toBeUndefined();
  });

  it("adds a Decide item 90 days before 1 Mar 2027", () => {
    const item = cloudmetricDecide("2026-12-01");
    expect(item).toMatchObject({ type: "decide", reason: "time", dueDate: "2027-03-01", ownerId: "neha", status: "open" });
    expect(routeItem(item!, "2026-12-01", leadId)).toMatchObject({ escalated: false, recipients: ["neha"] });
  });

  it("escalates it to the procurement lead 30 days later if nobody acts", () => {
    const item = cloudmetricDecide("2026-12-31")!;
    expect(routeItem(item, "2026-12-31", leadId)).toMatchObject({ escalated: true, recipients: ["neha", leadId] });
  });

  it("marks it urgent 21 days out, so it is urgent by the 7 day alert", () => {
    expect(routeItem(cloudmetricDecide("2027-02-07")!, "2027-02-07", leadId).urgent).toBe(false);
    expect(routeItem(cloudmetricDecide("2027-02-08")!, "2027-02-08", leadId).urgent).toBe(true);
    expect(routeItem(cloudmetricDecide("2027-02-22")!, "2027-02-22", leadId).urgent).toBe(true);
  });
});

describe("Check 3: accepting the Orbis amendment moves its dates", () => {
  const accepted = { [amendmentItemId("orbis-amendment")]: { kind: "accepted", on: ORBIS_AMENDMENT_ARRIVES, by: "farah" } as ItemAction };
  const orbisNow = (actions: Record<string, ItemAction>) =>
    currentContracts(contracts, emails, actions, {}).find((c) => c.id === "orbis-facilities")!;

  it("is not there on day one, and arrives by email during the demo", () => {
    expect(itemsOn(DEMO_START).some((i) => i.id === "change:orbis-amendment")).toBe(false);
    expect(itemsOn(ORBIS_AMENDMENT_ARRIVES).find((i) => i.id === "change:orbis-amendment")).toMatchObject({ type: "check", reason: "change", ownerId: "farah" });
  });

  it("moves the end date to 31 Mar 2028, the notice to 120 days, the deadline to 2 Dec 2027 and the fee to Rs 4,41,000", () => {
    const before = itemsOn(ORBIS_AMENDMENT_ARRIVES).find((i) => i.type === "decide" && i.vendorId === "orbis")!;
    expect(before.detail).toMatchObject({ dates: { endDate: "2027-04-01", noticeDeadline: "2027-01-01" } });

    const orbis = orbisNow(accepted);
    expect(contractDates(orbis.facts, ORBIS_AMENDMENT_ARRIVES)).toMatchObject({ endDate: "2028-03-31", noticeDeadline: "2027-12-02" });
    expect(numberValue(orbis.facts, "noticeDays")).toBe(120);
    expect(numberValue(orbis.facts, "monthlyFee")).toBe(441000);

    const after = itemsOn("2027-09-10", accepted).find((i) => i.type === "decide" && i.vendorId === "orbis")!;
    expect(after.detail).toMatchObject({ dates: { endDate: "2028-03-31", noticeDeadline: "2027-12-02" } });
  });

  it("clears the old renewal item, because the new deadline is more than 90 days away", () => {
    expect(itemsOn(ORBIS_AMENDMENT_ARRIVES, accepted).some((i) => i.type === "decide" && i.vendorId === "orbis")).toBe(false);
  });

  it("marks the amendment item done", () => {
    expect(itemsOn(ORBIS_AMENDMENT_ARRIVES, accepted).find((i) => i.id === "change:orbis-amendment")?.status).toBe("done");
  });

  it("keeps the original dates if the amendment is rejected", () => {
    const rejected = { [amendmentItemId("orbis-amendment")]: { kind: "rejected", on: ORBIS_AMENDMENT_ARRIVES, by: "farah" } as ItemAction };
    const item = itemsOn(ORBIS_AMENDMENT_ARRIVES, rejected).find((i) => i.type === "decide" && i.vendorId === "orbis")!;
    expect(item.detail).toMatchObject({ dates: { endDate: "2027-04-01" } });
    expect(numberValue(orbisNow(rejected).facts, "monthlyFee")).toBe(420000);
  });
});

describe("Check 4: the Brightline Check item shows the invoice, the agreed amount and the clause", () => {
  it("has all three", () => {
    const item = itemsOn(DEMO_START).find((i) => i.id === "check:brightline-invoice")!;
    expect(item).toMatchObject({ type: "check", reason: "arrival", ownerId: "rohan" });
    expect(item.detail).toMatchObject({
      kind: "invoice",
      invoiceNumber: "BL/26-27/0871",
      invoiced: 627900,
      agreed: 573300,
      difference: 54600,
      term: {
        contractId: "brightline-logistics",
        fact: {
          value: 42,
          sentence: "The agreed rate is Rs 42 per kilometre for a 10 tonne truck and Rs 58 per kilometre for a 20 tonne truck.",
          page: 1,
        },
      },
    });
  });
});

describe("Check 5: an item with no owner appears under the procurement lead", () => {
  it("routes every unowned item to the procurement lead only", () => {
    const unowned = itemsOn(DEMO_START).filter((i) => i.ownerId === null);
    expect(unowned.map((i) => i.id)).toContain("decide:ledgerline-payroll:2026-12-01");
    for (const item of unowned) {
      expect(routeItem(item, DEMO_START, leadId)).toMatchObject({ unowned: true, recipients: [leadId] });
    }
  });
});

describe("Check 7: Measures numbers come from the sample data and change when items are decided", () => {
  const measuresWith = (actions: Record<string, ItemAction>) =>
    measures({
      today: DEMO_START,
      firstReadOn: DEMO_START,
      items: itemsOn(DEMO_START, actions),
      contracts: currentContracts(contracts, emails, actions, {}),
      vendors,
      payments,
      paid: paidByVendor(payments, vendors, DEMO_START),
      actions,
      factEdits: {},
      opened: {},
      procurementLeadId: leadId,
      connectionsApproved: true,
    });

  it("moves the north star when a renewal is decided", () => {
    expect(measuresWith({}).northStar.share).toBeNull();
    const decided = measuresWith({ "decide:quillstone-retainer:2026-12-10": { kind: "end", on: DEMO_START, by: leadId } });
    expect(decided.northStar).toMatchObject({ decidedInTime: 1, share: 100 });
  });

  it("drops the count of items with no owner when one is acted on", () => {
    const before = measuresWith({}).metrics.find((m) => m.id === "unowned")!.value!;
    const after = measuresWith({ "decide:quillstone-retainer:2026-12-10": { kind: "end", on: DEMO_START, by: leadId } });
    expect(after.metrics.find((m) => m.id === "unowned")!.value).toBe(before - 1);
  });
});

describe("The sample contracts' notice deadlines, as docs/contracts expects them", () => {
  const paid = paidByVendor(payments, vendors, DEMO_START);
  const deadline = (id: string) => {
    const contract = contracts.find((c) => c.id === id)!;
    return contractDates(contract.facts, DEMO_START, (paid.get(contract.vendorId) ?? []).map((p) => p.date)).noticeDeadline;
  };

  it.each([
    ["ledgerline-payroll", "2026-12-01"],
    ["greenleaf-grounds", "2026-12-01"],
    ["quillstone-retainer", "2026-12-10"],
    ["orbis-facilities", "2027-01-01"],
    ["swiftlane-transport", "2027-01-01"],
    ["cloudmetric-subscription", "2027-03-01"],
    ["brightline-logistics", "2027-04-01"],
    ["talentbridge-staffing", "2027-05-16"],
    ["datavane-subscription", "2027-05-31"],
  ])("%s: notice by %s", (id, expected) => {
    expect(deadline(id)).toBe(expected);
  });

  it("gives Greenleaf a deadline but not an automatic renewal, because only the Client can renew", () => {
    const greenleaf = contracts.find((c) => c.id === "greenleaf-grounds")!;
    expect(contractDates(greenleaf.facts, DEMO_START)).toMatchObject({ endDate: "2026-12-31", autoRenews: false });
  });

  it("gives Kestrel a window, not a date, and Pinecrest nothing", () => {
    const kestrel = contracts.find((c) => c.id === "kestrel-marketing")!;
    const dates = contractDates(kestrel.facts, DEMO_START, (paid.get("kestrel") ?? []).map((p) => p.date));
    expect(dates).toMatchObject({ label: "bounded", noticeDeadline: null, earliestDeadline: "2027-01-29", latestDeadline: "2027-02-28" });
    expect(deadline("pinecrest-msa")).toBeNull();
  });
});

describe("Day one on Home", () => {
  const open = itemsOn(DEMO_START).filter((i) => i.status === "open");
  const urgent = open.filter((i) => routeItem(i, DEMO_START, leadId).urgent);

  it("shows Ledgerline, Greenleaf and Quillstone as urgent Decide items", () => {
    expect(urgent.filter((i) => i.type === "decide").map((i) => i.vendorId).sort()).toEqual(["greenleaf", "ledgerline", "quillstone"]);
  });

  it("shows a Check item from the Ledgerline email: 15% against a 5% cap", () => {
    expect(open.find((i) => i.id === "check:ledgerline-price-rise")?.detail).toMatchObject({
      kind: "price-rise",
      current: 65000,
      proposed: 74750,
      increasePercent: 15,
      capPercent: 5,
      effectiveFrom: "2027-01-01",
    });
  });

  it("files the Datavane invoice, which matches the contract, with no item", () => {
    expect(open.some((i) => i.id.includes("datavane"))).toBe(false);
  });

  it("raises a Find item for every supplier paid with no contract", () => {
    expect(open.filter((i) => i.type === "find")).toHaveLength(12);
  });
});

describe("The Cloudmetric alert points", () => {
  it("fires 90 days out on 1 Dec 2026, 30 days out on 30 Jan 2027 and 7 days out on 22 Feb 2027", () => {
    const fired = (today: string) => routeItem(cloudmetricDecide(today)!, today, leadId).alertsFired;
    expect(fired("2026-12-01")).toEqual([90]);
    expect(fired("2027-01-29")).toEqual([90]);
    expect(fired("2027-01-30")).toEqual([90, 30]);
    expect(fired("2027-02-22")).toEqual([90, 30, 7]);
  });

  it("has escalated to the procurement lead by 29 Jan 2027, the demo guide's escalation date", () => {
    expect(routeItem(cloudmetricDecide("2027-01-29")!, "2027-01-29", leadId)).toMatchObject({ escalated: true, recipients: ["neha", leadId] });
  });
});
