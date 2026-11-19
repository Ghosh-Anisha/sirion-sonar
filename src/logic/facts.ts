import type { Fact, FactField } from "../data/types";

export function findFact(facts: Fact[], field: FactField): Fact | undefined {
  return facts.find((f) => f.field === field);
}

export function numberValue(facts: Fact[], field: FactField): number | null {
  const value = findFact(facts, field)?.value;
  return typeof value === "number" ? value : null;
}

export function dateValue(facts: Fact[], field: FactField): string | null {
  const value = findFact(facts, field)?.value;
  return typeof value === "string" ? value : null;
}
