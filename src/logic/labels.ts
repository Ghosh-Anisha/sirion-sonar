import type { Fact, Label } from "../data/types";
import { findFact } from "./facts";

/*
 * How far to trust a date, per "How the record knows its dates" in docs/spec.md:
 *   Confirmed  a person checked it against the contract
 *   Derived    worked out from the file, nobody has checked it
 *   Bounded    the term is known but the date is not, so it falls in a window
 *   Unknown    the file or the part holding the term is missing or unreadable
 * A date is only as strong as the weakest fact it is computed from.
 */

const STRENGTH: Record<Label, number> = { unknown: 0, bounded: 1, derived: 2, confirmed: 3 };

export function weakestLabel(labels: Label[]): Label {
  if (labels.length === 0) return "unknown";
  return labels.reduce((weakest, label) => (STRENGTH[label] < STRENGTH[weakest] ? label : weakest));
}

/**
 * The facts a notice deadline is computed from: the end date, or the start date and
 * term when there is no end date, plus the renewal term and notice days when present.
 * Returns null when the document does not give enough to work out a term at all.
 */
export function deadlineFacts(facts: Fact[]): Fact[] | null {
  const optional = (["renewalTermMonths", "renewalOptionMonths", "noticeDays", "noticeMonths"] as const).map((field) => findFact(facts, field));
  const end = findFact(facts, "endDate");
  const start = findFact(facts, "startDate");
  const term = findFact(facts, "termMonths");
  const base = end ? [end] : start && term ? [start, term] : null;
  if (!base) return null;
  return [...base, ...optional].filter((f): f is Fact => f !== undefined);
}

/** The label for a contract's notice deadline. */
export function deadlineLabel(facts: Fact[]): Label {
  const used = deadlineFacts(facts);
  return used ? weakestLabel(used.map((f) => f.label)) : "unknown";
}
