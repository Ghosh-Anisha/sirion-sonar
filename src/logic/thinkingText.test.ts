import { describe, expect, it } from "vitest";
import { thinking, thinkingNote, type ThinkingNote } from "../data/thinking";
import { doerLabel, stepsLabel } from "./thinkingText";

describe("stepsLabel", () => {
  it("names one step, a pair, or a run", () => {
    expect(stepsLabel([7])).toBe("Step 7");
    expect(stepsLabel([8, 7])).toBe("Steps 7 and 8");
    expect(stepsLabel([1, 2, 3, 4, 5, 6, 7, 8])).toBe("Steps 1 to 8");
    expect(stepsLabel([2, 3, 7])).toBe("Steps 2, 3 and 7");
  });
});

describe("doerLabel", () => {
  it("says who does the work", () => {
    expect(doerLabel({ kind: "agent", agent: "Finder" })).toBe("The Finder agent");
    expect(doerLabel({ kind: "agent", agent: "Email agent" })).toBe("The Email agent");
    expect(doerLabel({ kind: "rules" })).toBe("Rules");
  });
});

describe("thinking notes", () => {
  const notes = Object.values(thinking).flatMap((screen) => Object.values(screen) as ThinkingNote[]);

  it("covers every screen asked for", () => {
    expect(Object.keys(thinking)).toEqual(["home", "item", "contract", "versions", "email", "welcome", "measures"]);
    expect(thinkingNote("email.look-up").title).toBe("Look up the contract and payments");
  });

  it("puts every part on a real pipeline step with someone doing it", () => {
    for (const n of notes) {
      expect(n.steps.length, n.title).toBeGreaterThan(0);
      expect(n.steps.every((s) => s >= 1 && s <= 8), n.title).toBe(true);
      expect(n.doers.length, n.title).toBeGreaterThan(0);
    }
  });

  it("only says a model sees something where a model or agent does the work", () => {
    for (const n of notes) {
      const usesModel = n.doers.some((d) => d.kind === "agent" || d.kind === "small-model");
      if (!usesModel) expect(n.modelSees, n.title).toBeNull();
    }
  });

  it("follows the copy rules", () => {
    const text = JSON.stringify(thinking);
    expect(text).not.toMatch(/[—–!]|\b(leverage|seamless|robust|powerful|unlock|empower)\b/i);
  });
});
