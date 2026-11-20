import { describe, expect, it } from "vitest";
import * as architecture from "./architecture";
import { agents, evals, pipelineSteps, pushDesign, releaseScores, solutionSections, stepDoers, stepReasons } from "./architecture";

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

describe("the architecture sections on /solution", () => {
  it("lists the seven sections in page order", () => {
    expect(solutionSections.map((s) => s.label)).toEqual(["Overview", "After intake", "Agents and where not", "Backend", "Data controls", "Access controls", "Evals"]);
  });

  it("says who does each step, with two kinds where two run", () => {
    expect(stepDoers).toEqual({ 1: ["code"], 2: ["code"], 3: ["agent"], 4: ["code", "model-call"], 5: ["model-call", "agent"], 6: ["code"], 7: ["code"], 8: ["agent"] });
  });

  it("keeps watching free of AI, and every step has a guardrail", () => {
    expect(stepReasons).toHaveLength(8);
    expect(stepReasons.find((r) => r.number === 7)!.deterministic).toBe(100);
    for (const r of stepReasons) expect(r.guardrail.length, r.name).toBeGreaterThan(5);
  });

  it("scores every release on the same evals, and marks the chart illustrative in its data", () => {
    expect(evals).toHaveLength(7);
    for (const row of releaseScores.rows) expect(row.scores).toHaveLength(releaseScores.releases.length);
  });

  it("follows the copy rules", () => {
    expect(JSON.stringify(architecture)).not.toMatch(/[—–!]|\b(leverage|seamless|robust|powerful|unlock|empower)\b/i);
  });
});
