import type { Contract } from "../data/types";
import { fieldLabel } from "./factFormat";

/*
 * When a contract moves to Sirion. Sonar reads it, the owner confirms every fact against its
 * sentence, and then the owner sends it. Nothing goes to Sirion on its own, and nothing half checked goes.
 */

/** Who sent a contract to Sirion, and when. */
export interface SirionSend {
  by: string;
  on: string;
}

export type HandoffStatus =
  | { kind: "in-sirion"; by: string; on: string; changedSince: boolean }
  | { kind: "ready" }
  | { kind: "not-ready"; reason: string };

/** Where a contract stands on its way to Sirion, and in plain words what it still needs. */
export function handoffStatus(contract: Contract, sent: SirionSend | undefined): HandoffStatus {
  const unchecked = contract.facts.filter((f) => f.label !== "confirmed");
  if (sent) return { kind: "in-sirion", by: sent.by, on: sent.on, changedSince: unchecked.length > 0 };
  const missing = contract.facts.find((f) => f.value === null);
  if (missing) {
    const what = fieldLabel(missing.field).toLowerCase();
    return { kind: "not-ready", reason: contract.gap ? `The ${what} is not in the file. ${contract.gap}` : `The ${what} is not in the file.` };
  }
  if (unchecked.length > 0) {
    const n = unchecked.length;
    return { kind: "not-ready", reason: `${n} of ${contract.facts.length} facts ${n === 1 ? "is" : "are"} still to confirm.` };
  }
  return { kind: "ready" };
}

/** Plain words for the status, for a badge or a column. */
export function handoffLabel(status: HandoffStatus): string {
  if (status.kind === "in-sirion") return status.changedSince ? "In Sirion, changed since" : "In Sirion";
  return status.kind === "ready" ? "Ready to send" : "Not ready";
}
