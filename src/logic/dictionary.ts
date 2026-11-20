import type { Person, Vendor } from "../data/types";
import type { DictionaryEntry } from "./mask";

/** The company's own name, masked like any other party. */
export const COMPANY_NAMES = ["Halden Foods Private Limited", "Halden Foods"];

/**
 * The masking dictionary: every supplier spelling from the vendor list, the company's
 * own name, the people on the staff list, and names the name recogniser found in the file.
 */
export function buildDictionary(vendors: Vendor[], people: Person[], recognisedNames: string[]): DictionaryEntry[] {
  return [
    ...vendors.flatMap((v) =>
      [v.name, ...v.aliases].map((text) => ({ text, kind: "SUPPLIER" as const, key: `vendor:${v.id}`, display: v.name })),
    ),
    ...COMPANY_NAMES.map((text) => ({ text, kind: "COMPANY" as const, key: "company", display: COMPANY_NAMES[0] })),
    ...people.map((p) => ({ text: p.name, kind: "PERSON" as const, key: `person:${p.id}`, display: p.name })),
    ...recognisedNames.map((text) => ({ text, kind: "PERSON" as const, key: `name:${text}`, display: text })),
  ];
}
