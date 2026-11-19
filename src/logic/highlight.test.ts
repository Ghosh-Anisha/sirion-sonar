import { describe, expect, it } from "vitest";
import { highlightSegments } from "./highlight";

describe("highlightSegments", () => {
  const text = "This Agreement starts on 1 May 2024. It renews each year. Notice is 60 days.";

  it("splits text around each quoted sentence", () => {
    expect(highlightSegments(text, ["It renews each year."])).toEqual([
      { text: "This Agreement starts on 1 May 2024. ", sentence: null },
      { text: "It renews each year.", sentence: "It renews each year." },
      { text: " Notice is 60 days.", sentence: null },
    ]);
  });

  it("marks a sentence quoted by two facts once, and keeps the text whole", () => {
    const segments = highlightSegments(text, ["Notice is 60 days.", "Notice is 60 days.", "This Agreement starts on 1 May 2024."]);
    expect(segments.filter((s) => s.sentence)).toHaveLength(2);
    expect(segments.map((s) => s.text).join("")).toBe(text);
  });

  it("ignores a sentence that is not in the text", () => {
    expect(highlightSegments(text, ["Not here."])).toEqual([{ text, sentence: null }]);
  });
});
