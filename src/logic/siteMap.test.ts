import { describe, expect, it } from "vitest";
import { siteSteps } from "../data/story";
import { stepFor } from "./siteMap";

describe("stepFor", () => {
  it("puts each page under its top level step", () => {
    expect(["/story", "/why", "/problem", "/stakeholders", "/assumptions"].map(stepFor)).toEqual(Array(5).fill("problem"));
    expect(stepFor("/solution")).toBe("solution");
    expect(stepFor("/measures")).toBe("measure");
    expect(["/welcome", "/login", "/home", "/item/x", "/contract/y", "/access", "/architecture", "/sirion"].map(stepFor)).toEqual(Array(8).fill("try"));
  });

  it("runs the story first and the product third", () => {
    expect(siteSteps.map((s) => s.to)).toEqual(["/story", "/solution", "/login", "/measures"]);
  });
});
