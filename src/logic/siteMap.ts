import type { SiteStepId } from "../data/story";

const PROBLEM = ["story", "why", "problem", "stakeholders", "assumptions"];

/** Which top level step a path belongs to: the story pages, the solution, the product, or the measures. */
export function stepFor(pathname: string): SiteStepId {
  const first = pathname.split("/")[1] ?? "";
  if (PROBLEM.includes(first)) return "problem";
  if (first === "solution") return "solution";
  if (first === "measures") return "measure";
  return "try";
}
