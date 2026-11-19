export interface Segment {
  text: string;
  /** The quoted sentence this piece of text is, or null for plain text. */
  sentence: string | null;
}

/** Splits clause text into plain pieces and quoted sentences, so the sentences can be marked. Overlaps keep the first match. */
export function highlightSegments(text: string, sentences: string[]): Segment[] {
  const ranges = [...new Set(sentences)]
    .map((sentence) => ({ sentence, start: text.indexOf(sentence) }))
    .filter((r) => r.start >= 0 && r.sentence.length > 0)
    .sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const { sentence, start } of ranges) {
    if (start < cursor) continue;
    if (start > cursor) segments.push({ text: text.slice(cursor, start), sentence: null });
    segments.push({ text: sentence, sentence });
    cursor = start + sentence.length;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), sentence: null });
  return segments;
}
