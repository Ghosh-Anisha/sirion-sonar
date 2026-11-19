import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { coverage } from "./coverage";

describe("coverage", () => {
  it("counts suppliers we pay by how much of a contract we hold", () => {
    expect(coverage(vendors, contracts, payments, DEMO_START)).toMatchObject({ paid: 24, full: 9, partial: 2, none: 13 });
  });

  it("agrees with each supplier's recorded status", () => {
    const c = coverage(vendors, contracts, payments, DEMO_START);
    const byStatus = (s: string) => vendors.filter((v) => v.contractStatus === s).length;
    expect([c.full, c.partial, c.none]).toEqual([byStatus("full"), byStatus("partial"), byStatus("none")]);
  });

  it("works out the share of supplier spend that has a contract record", () => {
    const share = coverage(vendors, contracts, payments, DEMO_START).spendShare;
    expect(share).toBeGreaterThan(0);
    expect(share).toBeLessThanOrEqual(100);
  });

  it("only counts payments made by today", () => {
    expect(coverage(vendors, contracts, payments, "2025-04-01").paid).toBe(1);
  });
});
