import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { emails } from "../data/emails";
import { applyAmendment } from "./amend";
import { compareClauses, diffWords, type Part } from "./redline";

const rebuild = (parts: Part[], keep: "before" | "after") =>
  parts.filter((p) => p.kind === "same" || p.kind === (keep === "before" ? "removed" : "added")).map((p) => p.text).join("");

describe("diffWords", () => {
  it("marks the words that changed and keeps the rest", () => {
    expect(diffWords("notice at least 30 days before", "notice at least 60 days before")).toEqual([
      { kind: "same", text: "notice at least " },
      { kind: "removed", text: "30 " },
      { kind: "added", text: "60 " },
      { kind: "same", text: "days before" },
    ]);
  });

  it("keeps a rewritten phrase as one removed run and one added run", () => {
    expect(diffWords("It runs for 12 months from the start date.", "It runs until 30 June 2027.")).toEqual([
      { kind: "same", text: "It runs " },
      { kind: "removed", text: "for 12 months from the start date." },
      { kind: "added", text: "until 30 June 2027." },
    ]);
  });

  it("can always rebuild both texts exactly", () => {
    const before = "The Customer will pay a monthly fee of Rs 3,20,000.";
    const after = "The Customer will pay a monthly fee of Rs 3,45,000 from 1 December 2026.";
    const parts = diffWords(before, after);
    expect(rebuild(parts, "before")).toBe(before);
    expect(rebuild(parts, "after")).toBe(after);
  });
});

describe("compareClauses on the Orbis amendment", () => {
  const orbis = contracts.find((c) => c.id === "orbis-facilities")!;
  const amendment = emails.find((e) => e.id === "orbis-amendment")!.amendment!;
  const changes = compareClauses(orbis.clauses, applyAmendment(orbis, amendment).clauses);

  it("marks clauses 2, 3 and 5 as changed and the rest as the same", () => {
    expect(changes.map((c) => [c.id, c.status])).toEqual([
      ["1", "same"],
      ["2", "changed"],
      ["3", "changed"],
      ["4", "same"],
      ["5", "changed"],
    ]);
  });

  it("shows the notice period change as 30 removed and 60 added", () => {
    const notice = changes.find((c) => c.id === "3")!;
    expect(notice.parts).toContainEqual({ kind: "removed", text: "30 " });
    expect(notice.parts).toContainEqual({ kind: "added", text: "60 " });
  });

  it("handles clauses that only one version has", () => {
    const added = compareClauses([], [{ id: "6", heading: "New", page: 1, text: "Added." }]);
    expect(added[0]).toMatchObject({ status: "added", before: null, parts: [{ kind: "added", text: "Added." }] });
  });
});
