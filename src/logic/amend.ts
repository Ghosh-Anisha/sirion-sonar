import type { Amendment, Contract } from "../data/types";

/**
 * The contract as it reads once an amendment is accepted. Each amended clause
 * replaces the clause with the same id, and facts read from a replaced clause
 * give way to the facts read from the amendment.
 */
export function applyAmendment(contract: Contract, amendment: Amendment): Contract {
  if (amendment.contractId !== contract.id) {
    throw new Error(`Amendment is for ${amendment.contractId}, not ${contract.id}`);
  }
  const replaced = new Set(amendment.clauses.map((c) => c.id));
  const kept = contract.clauses.filter((c) => !replaced.has(c.id));
  const clauses = [...kept, ...amendment.clauses].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
  const facts = [...contract.facts.filter((f) => !replaced.has(f.clauseId)), ...amendment.facts];
  return { ...contract, clauses, facts };
}
