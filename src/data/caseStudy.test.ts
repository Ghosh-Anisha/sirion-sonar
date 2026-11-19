import { describe, expect, it } from "vitest";
import { assumptions, conflicts, groups, intakeTests, matrix, problem } from "./caseStudy";

const links = [
  ...intakeTests.map((t) => t.playsOut),
  ...matrix.flatMap((q) => q.problems.map((p) => p.playsOut)),
  ...problem.costs.map((c) => c.playsOut),
  problem.assumption.playsOut,
  ...groups.map((g) => g.playsOut),
  ...conflicts.map((c) => c.playsOut),
  ...assumptions.map((a) => a.playsOut),
];

describe("case content", () => {
  it("has the four tests and five problems in two quadrants", () => {
    expect(intakeTests.map((t) => t.name)).toEqual(["Unworkable", "Unavoidable", "Urgent", "Underserved"]);
    expect(matrix.filter((q) => q.problems.length > 0).map((q) => q.id)).toEqual(["costly-latent", "cheap-blatant"]);
    expect(matrix.reduce((n, q) => n + q.problems.length, 0)).toBe(5);
  });

  it("places eight groups on the map, and every conflict is between two of them", () => {
    expect(groups).toHaveLength(8);
    const ids = new Set(groups.map((g) => g.id));
    for (const c of conflicts) expect(c.between.every((id) => ids.has(id)), c.title).toBe(true);
    for (const g of groups) expect(g.power >= 0 && g.power <= 100 && g.interest >= 0 && g.interest <= 100).toBe(true);
  });

  it("marks only the access assumption as least settled", () => {
    expect(assumptions.filter((a) => a.leastSettled).map((a) => a.text)).toEqual([expect.stringMatching(/read-only access/)]);
  });

  it("sends the access conflict to the IT approval step", () => {
    expect(conflicts.find((c) => c.id === "access")!.playsOut.to).toBe("/welcome?step=4");
  });

  it("links every point to a screen in the app", () => {
    const routes = /^\/(home|why|problem|stakeholders|assumptions|welcome|email|measures|sirion|access|architecture|versions\/[\w-]+|item\/[\w%-]+)(\?.*)?$/;
    for (const l of links) expect(l.to, l.text).toMatch(routes);
  });

  it("follows the copy rules", () => {
    expect(JSON.stringify({ intakeTests, matrix, problem, groups, conflicts, assumptions })).not.toMatch(/[—–!]|\b(leverage|seamless|robust|powerful|unlock|empower)\b/i);
  });
});
