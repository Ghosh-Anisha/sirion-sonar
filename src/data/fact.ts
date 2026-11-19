import type { Clause, Fact, FactField, FactValue, Label } from "./types";

interface FactOptions {
  label?: Label;
  confirmedBy?: string;
  unit?: string;
}

/** Builds a fact from a clause, taking the page from the clause it cites. */
export function fact(
  clauses: Clause[],
  clauseId: string,
  field: FactField,
  value: FactValue,
  sentence: string,
  { label = "derived", confirmedBy, unit }: FactOptions = {},
): Fact {
  const clause = clauses.find((c) => c.id === clauseId);
  if (!clause) throw new Error(`No clause ${clauseId} for fact ${field}`);
  return {
    field,
    value,
    sentence,
    clauseId,
    page: clause.page,
    label,
    confirmedBy: confirmedBy ?? null,
    ...(unit ? { unit } : {}),
  };
}
