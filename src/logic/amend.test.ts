import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { emails } from "../data/emails";
import { applyAmendment } from "./amend";

const orbis = contracts.find((c) => c.id === "orbis-facilities")!;
const amendment = emails.find((e) => e.id === "orbis-amendment")!.amendment!;

describe("applyAmendment", () => {
  const amended = applyAmendment(orbis, amendment);

  it("replaces the amended clauses and keeps the rest, in clause order", () => {
    expect(amended.clauses.map((c) => c.id)).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    expect(amended.clauses.find((c) => c.id === "2")!.text).toBe("The term runs until 31 March 2028.");
    expect(amended.clauses.find((c) => c.id === "5")).toEqual(orbis.clauses.find((c) => c.id === "5"));
  });

  it("drops facts read from replaced clauses and adds the amendment's facts", () => {
    const fields = amended.facts.map((f) => f.field).sort();
    expect(fields).toEqual(["endDate", "monthlyFee", "noticeDays", "priceCapPercent", "renewalTermMonths", "startDate"]);
    expect(amended.facts.find((f) => f.field === "monthlyFee")!.value).toBe(441000);
    expect(amended.facts.find((f) => f.field === "noticeDays")!.value).toBe(120);
  });

  it("leaves the original contract untouched", () => {
    expect(orbis.facts.find((f) => f.field === "endDate")!.value).toBe("2027-04-01");
  });

  it("refuses an amendment for another contract", () => {
    expect(() => applyAmendment(contracts[0], amendment)).toThrow();
  });
});
