import type { Doer } from "../data/thinking";
import { andList } from "./accessText";

/** "Step 7", "Steps 7 and 8", or "Steps 1 to 8" for a run. */
export function stepsLabel(steps: number[]): string {
  const sorted = [...new Set(steps)].sort((a, b) => a - b);
  if (sorted.length === 1) return `Step ${sorted[0]}`;
  const run = sorted.every((n, i) => i === 0 || n === sorted[i - 1] + 1);
  if (run && sorted.length > 2) return `Steps ${sorted[0]} to ${sorted[sorted.length - 1]}`;
  return `Steps ${andList(sorted.map(String))}`;
}

export function doerLabel(doer: Doer): string {
  switch (doer.kind) {
    case "code":
      return "Code";
    case "model-call":
      return `A model call that ${doer.what}`;
    case "agent":
      return `The ${doer.agent} agent`.replace("The Email agent agent", "The Email agent");
  }
}
