import { describe, expect, it } from "vitest";
import { parseVisits, topPath, withVisit } from "./visits";

describe("visits", () => {
  it("keeps the top level page once, in the order first seen", () => {
    expect(topPath("/item/decide%3Ax")).toBe("/item");
    expect(withVisit(withVisit(["/story"], "/measures"), "/story")).toEqual(["/story", "/measures"]);
  });

  it("reads back only a list of paths", () => {
    expect(parseVisits('["/story", 3]')).toEqual(["/story"]);
    expect(parseVisits("not json")).toEqual([]);
    expect(parseVisits(null)).toEqual([]);
  });
});
