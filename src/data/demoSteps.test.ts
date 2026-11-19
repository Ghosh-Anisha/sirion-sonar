import { describe, expect, it } from "vitest";
import { demoSteps } from "./demoSteps";
import { moments } from "./journey";
import { people } from "./people";

describe("the clickable demo", () => {
  it("walks all nine moments, in the order of the user journey", () => {
    const order = demoSteps.flatMap((s) => (s.moment ? [s.moment] : [])).filter((m, i, all) => all.indexOf(m) === i);
    expect(order).toEqual(moments.map((m) => m.id));
  });

  it("asks for one thing per step, and says what to press", () => {
    for (const s of demoSteps) {
      if (s.action && !("go" in s.action)) expect(s.action.label, s.caption).toMatch(/^(Click|Tick|Pick|Switch|Move)\b/);
      if (!s.action) expect(s.focus, s.caption).toBeTruthy();
    }
  });

  it("is seen through each role: procurement, IT, two owners and finance", () => {
    const switched = demoSteps.flatMap((s) => (s.action && "viewer" in s.action ? [s.action.viewer] : []));
    expect(new Set(switched)).toEqual(new Set(["neha", "arjun", "farah", "kavya"]));
    expect(demoSteps.some((s) => s.caption.includes("Vikram, the IT admin"))).toBe(true);
    for (const id of switched) expect(people.some((p) => p.id === id)).toBe(true);
  });

  it("follows the copy rules", () => {
    expect(JSON.stringify(demoSteps)).not.toMatch(/[—–!]|\b(leverage|seamless|robust|powerful|unlock|empower)\b/i);
  });
});
