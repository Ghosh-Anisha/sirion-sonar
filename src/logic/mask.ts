/*
 * Masking before any text goes to a language model, per the Privacy section of docs/spec.md.
 * Supplier names, people, contact details and bank details become tokens such as [PERSON_1].
 * The same thing always gets the same token, a leak check looks for any known name left,
 * and the real values go back in afterwards. Dates and amounts are left alone, because they
 * are never taken from the model: code works them out.
 */

export type TokenKind = "SUPPLIER" | "COMPANY" | "PERSON" | "EMAIL" | "PHONE" | "ACCOUNT" | "IFSC";

/** A known name and what it stands for. Spellings of one supplier share a key, so they share a token. Matching ignores case. */
export interface DictionaryEntry {
  text: string;
  kind: TokenKind;
  key: string;
  /** What to put back when restoring. */
  display: string;
}

export interface TokenInfo {
  token: string;
  kind: TokenKind;
  display: string;
}

export interface Masked {
  text: string;
  tokens: TokenInfo[];
}

interface Span {
  start: number;
  end: number;
  kind: TokenKind;
  key: string;
  display: string;
}

const PATTERNS: { kind: TokenKind; pattern: RegExp }[] = [
  { kind: "EMAIL", pattern: /[\w.+-]+@[\w-]+(\.[\w-]+)+/g },
  { kind: "PHONE", pattern: /\+\d{1,3}[ -]?\d{4,5}[ -]?\d{4,6}/g },
  { kind: "IFSC", pattern: /\b[A-Z]{4}0[A-Z0-9]{6}\b/g },
  { kind: "ACCOUNT", pattern: /\b\d{9,18}\b/g },
];

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findSpans(text: string, dictionary: DictionaryEntry[]): Span[] {
  const spans: Span[] = [];
  for (const { kind, pattern } of PATTERNS) {
    for (const m of text.matchAll(pattern)) {
      spans.push({ start: m.index!, end: m.index! + m[0].length, kind, key: `${kind}:${m[0]}`, display: m[0] });
    }
  }
  for (const entry of dictionary) {
    for (const m of text.matchAll(new RegExp(`\\b${escape(entry.text)}\\b`, "gi"))) {
      spans.push({ start: m.index!, end: m.index! + m[0].length, kind: entry.kind, key: entry.key, display: entry.display });
    }
  }
  // Earliest first, longest first at the same place; anything overlapping a kept span is dropped.
  spans.sort((a, b) => a.start - b.start || b.end - a.end);
  const kept: Span[] = [];
  for (const span of spans) {
    if (kept.length === 0 || span.start >= kept[kept.length - 1].end) kept.push(span);
  }
  return kept;
}

/** Replaces every known name, contact and bank detail with a token, numbered in reading order per kind. */
export function mask(text: string, dictionary: DictionaryEntry[]): Masked {
  const spans = findSpans(text, dictionary);
  const byKey = new Map<string, TokenInfo>();
  const counts: Partial<Record<TokenKind, number>> = {};
  let out = "";
  let cursor = 0;
  for (const span of spans) {
    let info = byKey.get(span.key);
    if (!info) {
      counts[span.kind] = (counts[span.kind] ?? 0) + 1;
      info = { token: `[${span.kind}_${counts[span.kind]}]`, kind: span.kind, display: span.display };
      byKey.set(span.key, info);
    }
    out += text.slice(cursor, span.start) + info.token;
    cursor = span.end;
  }
  return { text: out + text.slice(cursor), tokens: [...byKey.values()] };
}

/** Puts the real values back in place of the tokens. Throws on a token it does not know, so nothing half-restored is shown. */
export function restore(text: string, tokens: TokenInfo[]): string {
  return text.replace(/\[[A-Z]+_\d+\]/g, (token) => {
    const info = tokens.find((t) => t.token === token);
    if (!info) throw new Error(`Unknown token ${token}`);
    return info.display;
  });
}

/** Any known name, email, phone or account number still in masked text. An empty list means the check passed. */
export function leakCheck(masked: string, dictionary: DictionaryEntry[]): string[] {
  const names = dictionary.filter((e) => masked.toLowerCase().includes(e.text.toLowerCase())).map((e) => e.text);
  const patterns = PATTERNS.flatMap(({ pattern }) => [...masked.matchAll(pattern)].map((m) => m[0]));
  return [...names, ...patterns];
}
