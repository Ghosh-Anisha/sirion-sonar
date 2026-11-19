import type { DemoSnapshot, DemoStep } from "../data/demoSteps";

/**
 * Where the clickable demo should be, read from the app rather than from clicks: the step after the
 * last one the app shows has happened. If the viewer skips ahead or takes another path, the demo follows.
 */
export function syncedStep(steps: DemoStep[], snapshot: DemoSnapshot): number {
  let last = -1;
  steps.forEach((step, i) => {
    if (step.done?.(snapshot)) last = i;
  });
  return Math.min(last + 1, steps.length - 1);
}
