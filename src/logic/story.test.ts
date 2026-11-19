import { describe, expect, it } from "vitest";
import { beats } from "../data/autoplay";
import { moments } from "../data/journey";
import { storySeconds } from "./story";

describe("the autoplay story", () => {
  it("covers all nine moments, in the order of the user journey", () => {
    const order = beats.flatMap((b) => (b.moment ? [b.moment] : [])).filter((m, i, all) => all.indexOf(m) === i);
    expect(order).toEqual(moments.map((m) => m.id));
  });

  it("runs for a little over a minute", () => {
    expect(storySeconds(beats)).toBe(80);
  });

  it("follows the copy rules", () => {
    expect(JSON.stringify(beats.map((b) => b.caption))).not.toMatch(/[—–!]|\b(leverage|seamless|robust|powerful|unlock|empower)\b/i);
  });
});
