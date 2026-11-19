import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import type { FactEdits } from "./edits";
import { buildItems, currentContracts, type ItemAction } from "./items";
import { paidByVendor } from "./match";
import { deadlinesSoFar, measures, median, northStar } from "./measures";

const run = (today: string, actions: Record<string, ItemAction> = {}, opened: Record<string, string> = {}, factEdits: Record<string, FactEdits> = {}) =>
  measures({
    today,
    firstReadOn: DEMO_START,
    items: buildItems({ today, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions, factEdits }),
    contracts: currentContracts(contracts, emails, actions, factEdits),
    vendors,
    payments,
    paid: paidByVendor(payments, vendors, today),
    actions,
    factEdits,
    opened,
    procurementLeadId: "kavya",
    connectionsApproved: true,
  });

const metricOf = (m: ReturnType<typeof run>, id: string) => m.metrics.find((x) => x.id === id)!;
const signalOf = (m: ReturnType<typeof run>, id: string) => m.signals.find((x) => x.id === id)!;
const decide = (kind: ItemAction["kind"], on: string): ItemAction => ({ kind, on, by: "kavya" });

describe("deadlinesSoFar", () => {
  it("lists the four renewal deadlines in view on the first day", () => {
    const found = deadlinesSoFar(contracts, paidByVendor(payments, vendors, DEMO_START), DEMO_START, DEMO_START);
    expect(found.map((d) => d.itemId).sort()).toEqual([
      "decide:kestrel-freight:2027-01-29",
      "decide:ledgerline-payroll:2026-12-01",
      "decide:orbis-facilities:2027-01-01",
      "decide:quillstone-retainer:2026-12-10",
    ]);
  });

  it("keeps a deadline that passed after its contract rolled over", () => {
    const later = deadlinesSoFar(contracts, paidByVendor(payments, vendors, "2027-01-05"), DEMO_START, "2027-01-05");
    expect(later.some((d) => d.itemId === "decide:ledgerline-payroll:2026-12-01")).toBe(true);
  });
});

describe("northStar", () => {
  it("counts nothing until a deadline is decided or passes", () => {
    expect(run(DEMO_START).northStar).toEqual({ decidedInTime: 0, missed: 0, pending: 4, share: null });
  });

  it("goes up when a renewal is decided before its deadline", () => {
    const m = run(DEMO_START, { "decide:ledgerline-payroll:2026-12-01": decide("renegotiate", DEMO_START) });
    expect(m.northStar).toMatchObject({ decidedInTime: 1, missed: 0, share: 100 });
  });

  it("counts a deadline that passed with no decision as missed", () => {
    const m = run("2026-12-02", { "decide:quillstone-retainer:2026-12-10": decide("end", "2026-12-02") });
    expect(m.northStar).toMatchObject({ decidedInTime: 1, missed: 1, share: 50 });
  });

  it("does not count a renewal that was only sent a reply as decided", () => {
    expect(northStar([{ itemId: "x", contractId: "c", dueDate: "2026-12-01", openedOn: DEMO_START }], { x: decide("sent", DEMO_START) }, "2026-12-05")).toMatchObject({ missed: 1, share: 0 });
  });
});

describe("supporting metrics", () => {
  it("starts from the sample data", () => {
    const m = run(DEMO_START);
    expect(metricOf(m, "coverage")).toMatchObject({ value: 88, target: 70, status: "on-track" });
    expect(metricOf(m, "confirmed")).toMatchObject({ value: 8, target: 50, status: "off-track", detail: "1 of 12 contracts have every date checked" });
    expect(metricOf(m, "time-to-decision")).toMatchObject({ value: null, status: "no-data" });
    expect(metricOf(m, "real-flags")).toMatchObject({ value: null, status: "no-data" });
    expect(metricOf(m, "unowned").value).toBe(7);
  });

  it("measures time from alert to decision", () => {
    const m = run("2026-11-25", { "decide:orbis-facilities:2027-01-01": decide("renew", "2026-11-25") });
    expect(metricOf(m, "time-to-decision")).toMatchObject({ value: 6, status: "on-track" });
  });

  it("counts a queried invoice as a real flag and an accepted one as not", () => {
    const m = run(DEMO_START, { "check:brightline-invoice": decide("flagged", DEMO_START) });
    expect(metricOf(m, "real-flags")).toMatchObject({ value: 100, status: "on-track" });
    const n = run(DEMO_START, { "check:brightline-invoice": decide("accepted", DEMO_START) });
    expect(metricOf(n, "real-flags")).toMatchObject({ value: 0, status: "off-track" });
  });

  it("works out the median of an even count", () => {
    expect(median([2, 8, 4, 6])).toBe(5);
    expect(median([])).toBeNull();
  });
});

describe("rethink signals", () => {
  it("says it is too early to judge reading habits in the first week", () => {
    expect(signalOf(run(DEMO_START), "unread").status).toBe("too-early");
    expect(signalOf(run("2026-11-26"), "unread").status).toBe("triggered");
  });

  it("is clear on found suppliers and access with the sample data", () => {
    const m = run(DEMO_START);
    expect(signalOf(m, "found").status).toBe("clear");
    expect(signalOf(m, "access").status).toBe("clear");
    expect(signalOf(m, "procurement").status).toBe("clear");
  });

  it("fires when owners correct more than 1 in 4 checked dates", () => {
    const edit = (kind: "confirmed" | "corrected", value: number) => ({ kind, value, by: "neha", on: DEMO_START });
    const edits: Record<string, FactEdits> = { "cloudmetric-subscription": { noticeDays: edit("corrected", 90), renewalTermMonths: edit("confirmed", 12) } };
    expect(signalOf(run(DEMO_START, {}, {}, edits), "corrections")).toMatchObject({ status: "triggered", current: "1 of 2 checked dates changed" });
  });
});
