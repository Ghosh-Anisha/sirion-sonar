import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { planFirstRead } from "./firstRead";
import { buildItems } from "./items";
import { estimateMinutes, pipelineStages, scopeSteps, spendShare, stageEntries } from "./pipeline";

const plan = planFirstRead(vendors, contracts, payments, emails);
const items = buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });
const stagesFor = (pilot: boolean) =>
  pipelineStages({ plan, steps: scopeSteps(plan, pilot, 10), products: ["Zoho Books", "Google Drive", "Gmail"], contracts, items, procurementLeadId: "kavya" });

describe("pipelineStages", () => {
  it("walks the eight steps, four of them using a model", () => {
    const stages = stagesFor(false);
    expect(stages.map((s) => s.id)).toEqual(["connect", "vendors", "find", "sort", "read", "record", "watch", "tell"]);
    expect(stages.filter((s) => s.doer !== "code").map((s) => s.id)).toEqual(["find", "sort", "read", "tell"]);
  });

  it("counts the whole read from the sample data", () => {
    const totals = Object.fromEntries(stagesFor(false).map((s) => [s.id, s.total]));
    expect(totals).toEqual({ connect: 3, vendors: 62, find: 24, sort: 12, read: 12, record: 66, watch: 20, tell: 4 });
    expect(stagesFor(false).find((s) => s.id === "find")!.result).toBe("24 suppliers, 10 found, 2 partial, 12 not found.");
  });

  it("covers only the top 10 by spend in a pilot", () => {
    const totals = Object.fromEntries(stagesFor(true).map((s) => [s.id, s.total]));
    expect(totals).toMatchObject({ vendors: 62, find: 10, read: 10, watch: 6 });
  });
});

describe("stageEntries", () => {
  it("logs the export, the searches, the files and the mail at their own steps", () => {
    const all = scopeSteps(plan, false, 10);
    expect(stageEntries("vendors", plan, all)).toHaveLength(1);
    expect(stageEntries("find", plan, all)).toHaveLength(12);
    expect(stageEntries("read", plan, all)).toHaveLength(12);
    expect(stageEntries("watch", plan, all)).toHaveLength(emails.length);
    expect(stageEntries("record", plan, all)).toHaveLength(0);
  });

  it("logs nothing for suppliers outside the pilot", () => {
    expect(stageEntries("read", plan, scopeSteps(plan, true, 10))).toHaveLength(10);
  });
});

describe("estimateMinutes", () => {
  it("is shorter for a pilot", () => {
    expect(estimateMinutes(plan, scopeSteps(plan, false, 10))).toBe(44);
    expect(estimateMinutes(plan, scopeSteps(plan, true, 10))).toBe(29);
  });
});

describe("spendShare", () => {
  it("gives the share of spend a pilot covers", () => {
    expect(spendShare(plan, scopeSteps(plan, false, 10))).toBe(100);
    const pilot = spendShare(plan, scopeSteps(plan, true, 10));
    expect(pilot).toBeGreaterThan(50);
    expect(pilot).toBeLessThan(100);
  });
});
