import type { Contract, FactField, FactValue } from "../data/types";

/** A person checking a fact against the contract, or typing the right value in. */
export interface FactEdit {
  kind: "confirmed" | "corrected";
  value: FactValue;
  by: string;
  on: string;
}

export type FactEdits = Partial<Record<FactField, FactEdit>>;

/**
 * The contract with a person's checks applied. A confirmed or corrected fact is
 * labelled Confirmed, because someone has now checked it against the contract.
 * The source sentence never changes: a correction changes the value it supports.
 */
export function applyFactEdits(contract: Contract, edits: FactEdits): Contract {
  if (Object.keys(edits).length === 0) return contract;
  return {
    ...contract,
    facts: contract.facts.map((fact) => {
      const edit = edits[fact.field];
      return edit ? { ...fact, value: edit.value, label: "confirmed", confirmedBy: edit.by } : fact;
    }),
  };
}

const DATE_FIELDS: FactField[] = ["startDate", "endDate"];
const WHOLE_FIELDS: FactField[] = ["termMonths", "renewalTermMonths", "noticeDays"];

export type ParsedInput = { ok: true; value: string | number } | { ok: false; error: string };

/** Checks what a person typed into a Correct box. Dates must be real dates, counts whole numbers, amounts above zero. */
export function parseFactInput(field: FactField, raw: string): ParsedInput {
  const text = raw.trim();
  if (DATE_FIELDS.includes(field)) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    const date = match ? new Date(Date.UTC(+match[1], +match[2] - 1, +match[3])) : null;
    const real = date !== null && date.toISOString().slice(0, 10) === text;
    return real ? { ok: true, value: text } : { ok: false, error: "Enter a date." };
  }
  const value = Number(text.replace(/,/g, ""));
  if (text === "" || !Number.isFinite(value) || value <= 0) return { ok: false, error: "Enter a number above zero." };
  if (WHOLE_FIELDS.includes(field) && !Number.isInteger(value)) return { ok: false, error: "Enter a whole number." };
  return { ok: true, value };
}
