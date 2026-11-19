import type { Clause } from "../data/types";

export type PartKind = "same" | "added" | "removed";

export interface Part {
  kind: PartKind;
  text: string;
}

export type ClauseStatus = "same" | "changed" | "added" | "removed";

export interface ClauseChange {
  id: string;
  heading: string;
  status: ClauseStatus;
  before: string | null;
  after: string | null;
  /** The clause as a redline: unchanged, added and removed words in reading order. */
  parts: Part[];
}

/**
 * Words with the space after them, so a redline puts text back together exactly.
 * Spaces never match on their own, which keeps a rewritten phrase as one removed
 * run followed by one added run instead of interleaved fragments.
 */
function tokens(text: string): string[] {
  return text.match(/\S+\s*|\s+/g) ?? [];
}

function push(parts: Part[], kind: PartKind, text: string) {
  const last = parts[parts.length - 1];
  if (last && last.kind === kind) last.text += text;
  else parts.push({ kind, text });
}

/** A word-level redline of two texts, using the longest common run of words. */
export function diffWords(before: string, after: string): Part[] {
  const a = tokens(before);
  const b = tokens(after);
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const parts: Part[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      push(parts, "same", a[i]);
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      push(parts, "removed", a[i++]);
    } else {
      push(parts, "added", b[j++]);
    }
  }
  while (i < a.length) push(parts, "removed", a[i++]);
  while (j < b.length) push(parts, "added", b[j++]);
  return parts;
}

/** Compares two versions clause by clause, in clause order. */
export function compareClauses(original: Clause[], amended: Clause[]): ClauseChange[] {
  const ids = [...new Set([...original.map((c) => c.id), ...amended.map((c) => c.id)])].sort((x, y) =>
    x.localeCompare(y, undefined, { numeric: true }),
  );
  return ids.map((id) => {
    const before = original.find((c) => c.id === id);
    const after = amended.find((c) => c.id === id);
    const heading = (after ?? before)!.heading;
    if (!before) return { id, heading, status: "added", before: null, after: after!.text, parts: [{ kind: "added", text: after!.text }] };
    if (!after) return { id, heading, status: "removed", before: before.text, after: null, parts: [{ kind: "removed", text: before.text }] };
    const status: ClauseStatus = before.text === after.text ? "same" : "changed";
    const parts: Part[] = status === "same" ? [{ kind: "same", text: before.text }] : diffWords(before.text, after.text);
    return { id, heading, status, before: before.text, after: after.text, parts };
  });
}
