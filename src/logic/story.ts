import type { Beat } from "../data/autoplay";

/** How long the autoplay story runs if nobody pauses it, rounded to the nearest 5 seconds. */
export function storySeconds(beats: Beat[]): number {
  const ms = beats.reduce((sum, b) => sum + b.hold + b.acts.reduce((n, a) => n + ("wait" in a ? a.wait : 0), 0), 0);
  return Math.round(ms / 5000) * 5;
}
