import { describe, expect, it } from "vitest";
import * as story from "./story";

describe("story copy", () => {
  it("tells the comic in six panels, ending with Sonar", () => {
    expect(story.panels.map((p) => p.caption)).toEqual([
      "It is signed in one email. Nobody else sees it.",
      "Three places, no owner, no dates anywhere.",
      "The notice window closes on a Friday. Nobody is watching.",
      "Neither Meera nor Raj finds out.",
      "The renewal talk starts with no facts.",
      "Nobody searched. The list came to her.",
    ]);
    for (const p of story.panels) expect(p.alt.length, p.id).toBeGreaterThan(20);
  });

  it("gives every page a so what and a next step, in the site order", () => {
    expect(story.storyClose.next.to).toBe("/solution");
    expect(story.solution.next.to).toBe("/login");
    expect(Object.values(story.casePages).every((p) => p.soWhat && p.next.to.startsWith("/") && p.lines.length <= 3)).toBe(true);
  });

  it("marks exactly one assumption least settled, and it is the least settled", () => {
    const open = story.storyAssumptions.filter((a) => a.leastSettled);
    expect(open).toHaveLength(1);
    expect(open[0].settled).toBe(Math.min(...story.storyAssumptions.map((a) => a.settled)));
    expect(story.assumptionSettled).toHaveLength(10);
  });

  it("follows the copy rules", () => {
    const text = JSON.stringify(story);
    expect(text).not.toMatch(/[—–!]|\b(leverage|seamless|robust|powerful|unlock|empower)\b/i);
  });
});
