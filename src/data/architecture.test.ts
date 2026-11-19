import { describe, expect, it } from "vitest";
import { agents, pipelineSteps, pushDesign } from "./architecture";

describe("architecture content", () => {
  it("has the eight steps in order, four of them using AI", () => {
    expect(pipelineSteps.map((s) => s.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(pipelineSteps.filter((s) => s.usesAi).map((s) => s.number)).toEqual([3, 4, 5, 8]);
  });

  it("has five agents, each on a step that uses AI", () => {
    expect(agents.map((a) => a.name)).toEqual(["Finder", "Reader and checker", "Reconciler", "Email agent", "Drafter"]);
    const aiSteps = new Set(pipelineSteps.filter((s) => s.usesAi).map((s) => s.number));
    expect(agents.every((a) => aiSteps.has(a.step))).toBe(true);
  });

  it("lists the five ways it pushes", () => {
    expect(pushDesign.map((p) => p.what)).toEqual(["The Needs you list", "Weekly email", "Deadline alerts", "New arrivals", "Escalation"]);
  });
});
