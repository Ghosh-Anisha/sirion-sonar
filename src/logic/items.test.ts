import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START, ORBIS_AMENDMENT_ARRIVES } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { buildItems, type ItemAction, type ItemInput } from "./items";

const input = (today: string, actions: Record<string, ItemAction> = {}): ItemInput => ({
  today,
  firstReadOn: DEMO_START,
  vendors,
  contracts,
  payments,
  emails,
  actions,
});

const atStart = buildItems(input(DEMO_START));
const byId = (id: string) => atStart.find((i) => i.id === id);

describe("buildItems on the first day", () => {
  it("opens Decide items for deadlines within 90 days", () => {
    expect(atStart.filter((i) => i.type === "decide").map((i) => [i.vendorId, i.dueDate])).toEqual([
      ["swiftlane", "2027-01-01"],
      ["orbis", "2027-01-01"],
      ["greenleaf", "2026-12-01"],
      ["ledgerline", "2026-12-01"],
      ["quillstone", "2026-12-10"],
      ["kestrel", "2027-01-29"],
    ]);
  });

  it("gives every item a type, a reason, an owner or none, a due date and a status", () => {
    for (const item of atStart) {
      expect(["decide", "check", "fix", "find"]).toContain(item.type);
      expect(["time", "arrival", "absence", "change"]).toContain(item.reason);
      expect(item.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(item.status).toBe("open");
      expect(item.ownerId === null || typeof item.ownerId === "string").toBe(true);
    }
  });

  it("uses the earliest possible deadline for a Bounded contract", () => {
    const kestrel = atStart.find((i) => i.vendorId === "kestrel")!;
    expect(kestrel.detail).toMatchObject({ kind: "renewal", dates: { label: "bounded", latestDeadline: "2027-02-28" } });
  });

  it("raises a Check for a price rise above the contract cap, due by the notice deadline", () => {
    expect(byId("check:ledgerline-price-rise")).toMatchObject({
      type: "check",
      reason: "arrival",
      dueDate: "2026-12-01",
      ownerId: null,
      detail: { kind: "price-rise", current: 65000, proposed: 74750, increasePercent: 15, capPercent: 5 },
    });
  });

  it("raises a Fix when Brightline misses its on time level, with the credit owed", () => {
    // The sample shipment log meets the level (37 of 38), so this checks the rule with a log that misses it.
    expect(byId("fix:brightline-invoice")).toBeUndefined();
    const late = emails.map((e) => (e.id === "brightline-invoice" ? { ...e, deliveries: { month: "2026-10", trips: 38, onTime: 34 } } : e));
    expect(buildItems({ ...input(DEMO_START), emails: late }).find((i) => i.id === "fix:brightline-invoice")).toMatchObject({
      type: "fix",
      reason: "arrival",
      dueDate: "2026-12-15",
      detail: { kind: "service", onTimePercent: 89.47, targetPercent: 95, credit: 12558 },
    });
  });

  it("raises a Check with reason change for the Orbis amendment", () => {
    expect(buildItems(input(ORBIS_AMENDMENT_ARRIVES)).find((i) => i.id === "change:orbis-amendment")).toMatchObject({
      type: "check",
      reason: "change",
      detail: {
        kind: "amendment",
        before: { endDate: "2027-04-01", noticeDeadline: "2027-01-01" },
        after: { endDate: "2028-03-31", noticeDeadline: "2027-12-02" },
      },
    });
  });

  it("raises nothing for an invoice that matches the contract", () => {
    expect(atStart.some((i) => i.id.includes("datavane-invoice"))).toBe(false);
  });

  it("raises a Find for each of the 12 suppliers paid with no contract", () => {
    const finds = atStart.filter((i) => i.type === "find");
    expect(finds).toHaveLength(12);
    expect(finds.every((i) => i.reason === "absence" && i.dueDate === "2027-01-18")).toBe(true);
    expect(byId("find:bluepeak")?.detail).toMatchObject({ kind: "no-contract", total: 56000, lastPaid: "2026-10-10" });
  });

  it("never raises a Find for a supplier with a partial contract", () => {
    expect(atStart.some((i) => i.id === "find:kestrel" || i.id === "find:pinecrest")).toBe(false);
  });
});

describe("buildItems as things happen", () => {
  it("leaves out emails that have not arrived yet", () => {
    const before = buildItems(input(DEMO_START));
    expect(before.some((i) => i.id === "change:orbis-amendment")).toBe(false);
    expect(before.some((i) => i.id === "check:ledgerline-price-rise")).toBe(true);
  });

  it("marks an item done with the action taken, and keeps it in the list", () => {
    const action: ItemAction = { kind: "renegotiate", on: DEMO_START, by: "kavya" };
    const items = buildItems(input(DEMO_START, { "decide:ledgerline-payroll:2026-12-01": action }));
    expect(items.find((i) => i.id === "decide:ledgerline-payroll:2026-12-01")).toMatchObject({ status: "done", action });
  });

  it("drops a renewal once its term has rolled over", () => {
    const later = buildItems(input("2027-01-01"));
    expect(later.some((i) => i.id.startsWith("decide:ledgerline-payroll"))).toBe(false);
  });
});
