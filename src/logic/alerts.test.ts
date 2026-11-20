import { describe, expect, it } from "vitest";
import { routeItem, urgencyGroup } from "./alerts";
import type { Item } from "./items";

const item = (overrides: Partial<Item> = {}): Item => ({
  id: "decide:x:2027-03-01",
  type: "decide",
  reason: "time",
  vendorId: "x",
  ownerId: "neha",
  openedOn: "2026-12-01",
  dueDate: "2027-03-01",
  status: "open",
  action: null,
  detail: { kind: "no-contract", paymentIds: [], total: 0, lastPaid: "2026-01-01" },
  ...overrides,
});

describe("routeItem", () => {
  it("fires alerts at 90, 30 and 7 days before the deadline", () => {
    expect(routeItem(item(), "2026-12-01", "kavya").alertsFired).toEqual([90]);
    expect(routeItem(item(), "2027-01-30", "kavya").alertsFired).toEqual([90, 30]);
    expect(routeItem(item(), "2027-02-22", "kavya").alertsFired).toEqual([90, 30, 7]);
    expect(routeItem(item(), "2026-11-30", "kavya").alertsFired).toEqual([]);
  });

  it("goes to the owner alone at first", () => {
    expect(routeItem(item(), "2026-12-01", "kavya")).toMatchObject({ escalated: false, urgent: false, recipients: ["neha"] });
  });

  it("escalates to the procurement lead after 30 days with no action", () => {
    expect(routeItem(item(), "2026-12-30", "kavya").escalated).toBe(false);
    expect(routeItem(item(), "2026-12-31", "kavya")).toMatchObject({ escalated: true, recipients: ["neha", "kavya"] });
  });

  it("escalates at the 30 day alert even if the item is newer than 30 days", () => {
    const late = item({ openedOn: "2027-01-25" });
    expect(routeItem(late, "2027-01-29", "kavya").escalated).toBe(false);
    expect(routeItem(late, "2027-01-30", "kavya").escalated).toBe(true);
  });

  it("is urgent at 21 days and after the deadline passes", () => {
    expect(routeItem(item(), "2027-02-07", "kavya").urgent).toBe(false);
    expect(routeItem(item(), "2027-02-08", "kavya").urgent).toBe(true);
    expect(routeItem(item(), "2027-03-05", "kavya")).toMatchObject({ urgent: true, daysLeft: -4 });
  });

  it("sends an item with no owner straight to the procurement lead", () => {
    expect(routeItem(item({ ownerId: null }), "2026-12-01", "kavya")).toMatchObject({
      unowned: true,
      escalated: false,
      recipients: ["kavya"],
    });
  });

  it("stops escalating once someone acts", () => {
    const done = item({ status: "done", action: { kind: "renew", on: "2026-12-10", by: "neha" } });
    expect(routeItem(done, "2027-02-25", "kavya")).toMatchObject({ escalated: false, urgent: false, recipients: ["neha"] });
  });
});

describe("urgencyGroup", () => {
  it("groups by how close the due date is", () => {
    expect(urgencyGroup(routeItem(item(), "2027-02-08", "kavya"))).toBe("urgent");
    expect(urgencyGroup(routeItem(item(), "2027-02-07", "kavya"))).toBe("month");
    expect(urgencyGroup(routeItem(item(), "2027-01-30", "kavya"))).toBe("month");
    expect(urgencyGroup(routeItem(item(), "2027-01-29", "kavya"))).toBe("later");
  });
});
