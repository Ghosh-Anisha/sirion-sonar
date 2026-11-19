import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { people } from "../data/people";
import { vendors } from "../data/vendors";
import { routeItem } from "./alerts";
import { amendmentItemId } from "./arrivals";
import { buildItems, type ItemAction } from "./items";

/*
 * The acceptance checks from docs/spec.md that can be tested without a screen.
 * Check 1 (a viewer can follow the demo) and 6 (no button pays, holds, signs or
 * sends without a click) are about screens. Check 7 (Measures) waits for measures.ts.
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

  it("marks it urgent at 7 days", () => {
    const item = cloudmetricDecide("2027-02-22")!;
    expect(routeItem(item, "2027-02-22", leadId).urgent).toBe(true);
  });
});

describe("Check 3: accepting the Orbis amendment moves its dates", () => {
  const accepted = { [amendmentItemId("orbis-amendment")]: { kind: "accepted", on: DEMO_START, by: "farah" } as ItemAction };

  it("changes the end date and the notice deadline", () => {
    const before = itemsOn(DEMO_START).find((i) => i.type === "decide" && i.vendorId === "orbis")!;
    expect(before.detail).toMatchObject({ dates: { endDate: "2027-01-31", noticeDeadline: "2027-01-01" } });

    const after = itemsOn("2027-02-01", accepted).find((i) => i.type === "decide" && i.vendorId === "orbis")!;
    expect(after.detail).toMatchObject({ dates: { endDate: "2027-06-30", noticeDeadline: "2027-05-01" } });
  });

  it("clears the old renewal item, because the new deadline is more than 90 days away", () => {
    expect(itemsOn(DEMO_START, accepted).some((i) => i.type === "decide" && i.vendorId === "orbis")).toBe(false);
  });

  it("marks the amendment item done", () => {
    expect(itemsOn(DEMO_START, accepted).find((i) => i.id === "change:orbis-amendment")?.status).toBe("done");
  });

  it("keeps the original dates if the amendment is rejected", () => {
    const rejected = { [amendmentItemId("orbis-amendment")]: { kind: "rejected", on: DEMO_START, by: "farah" } as ItemAction };
    const item = itemsOn(DEMO_START, rejected).find((i) => i.type === "decide" && i.vendorId === "orbis")!;
    expect(item.detail).toMatchObject({ dates: { endDate: "2027-01-31" } });
  });
});

describe("Check 4: the Brightline Check item shows the invoice, the agreed amount and the clause", () => {
  it("has all three", () => {
    const item = itemsOn(DEMO_START).find((i) => i.id === "check:brightline-invoice")!;
    expect(item).toMatchObject({ type: "check", reason: "arrival", ownerId: "rohan" });
    expect(item.detail).toMatchObject({
      kind: "invoice",
      invoiceNumber: "BL/26-27/0871",
      invoiced: 831600,
      agreed: 777000,
      difference: 54600,
      term: {
        contractId: "brightline-logistics",
        fact: {
          sentence: "The Customer will pay Rs 18,500 for each full truck trip between the Bhiwandi warehouse and the Pune store.",
          page: 2,
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
