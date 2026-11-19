import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { controlsFor, sampleDocs } from "./dataControls";

describe("data controls", () => {
  it("offers every sample document", () => {
    const docs = sampleDocs(contracts, emails, payments.length);
    expect(docs).toHaveLength(contracts.length + emails.length + 1);
    expect(docs.at(-1)!.name).toBe(`Payables export, ${payments.length} lines`);
  });

  it("treats contracts and mail as confidential, and masks them before a model", () => {
    for (const kind of ["contract", "email"] as const) {
      const c = controlsFor(kind);
      expect(c.classification).toBe("Confidential");
      expect(c.controls.find((x) => x.control === "Masking")!.applies).toBe(true);
    }
  });

  it("treats bank lines as restricted, keeps only the last four digits, and never sends them to a model", () => {
    const c = controlsFor("payments");
    expect(c.classification).toBe("Restricted");
    expect(c.why).toMatch(/last four/);
    expect(c.controls.find((x) => x.control === "Masking")!.applies).toBe(false);
  });
});
