import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { applyFactEdits, type FactEdits } from "./edits";
import { handoffLabel, handoffStatus } from "./sirionHandoff";

const byId = (id: string) => contracts.find((c) => c.id === id)!;
const confirmAll = (id: string) => {
  const c = byId(id);
  const edits: FactEdits = Object.fromEntries(c.facts.map((f) => [f.field, { kind: "confirmed", value: f.value, by: "neha", on: DEMO_START }]));
  return applyFactEdits(c, edits);
};

describe("handoffStatus", () => {
  it("is not ready while any fact is unchecked, and says how many", () => {
    expect(handoffStatus(byId("cloudmetric-subscription"), undefined)).toEqual({ kind: "not-ready", reason: "7 of 7 facts are still to confirm." });
  });

  it("is ready once the owner has confirmed every fact", () => {
    expect(handoffStatus(confirmAll("cloudmetric-subscription"), undefined)).toEqual({ kind: "ready" });
    expect(handoffStatus(byId("datavane-subscription"), undefined)).toEqual({ kind: "ready" });
  });

  it("never sends a contract with a missing or unreadable part", () => {
    expect(handoffStatus(byId("kestrel-marketing"), undefined)).toMatchObject({ kind: "not-ready", reason: expect.stringMatching(/^The start date is not in the file\./) });
    expect(handoffStatus(byId("pinecrest-msa"), undefined)).toMatchObject({ kind: "not-ready", reason: expect.stringMatching(/Order Form/) });
  });

  it("is in Sirion once sent, and says so if a fact changed since", () => {
    expect(handoffStatus(confirmAll("cloudmetric-subscription"), { by: "neha", on: DEMO_START })).toEqual({ kind: "in-sirion", by: "neha", on: DEMO_START, changedSince: false });
    const changed = handoffStatus(byId("cloudmetric-subscription"), { by: "neha", on: DEMO_START });
    expect(changed).toMatchObject({ kind: "in-sirion", changedSince: true });
    expect(handoffLabel(changed)).toBe("In Sirion, changed since");
  });
});
