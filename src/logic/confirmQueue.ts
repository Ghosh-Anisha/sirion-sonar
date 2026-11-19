import type { Contract, Fact, Label, Payment } from "../data/types";
import { contractDates } from "./dates";
import type { FactEdits } from "./edits";
import { deadlineFacts } from "./labels";

/*
 * The confirm step of onboarding: a short queue of the riskiest dates, earliest notice deadline first.
 * A date is in the queue when it is still to come, nobody has checked it, and every fact it comes from
 * has a value a person can say yes to. Bounded and unknown dates need the file, not a yes, so they wait.
 */

export interface DateToConfirm {
  contract: Contract;
  deadline: string;
  label: Label;
  /** The facts the deadline comes from that nobody has checked yet. */
  facts: Fact[];
}

export const CONFIRM_QUEUE_SIZE = 5;

export function datesToConfirm(contracts: Contract[], today: string, paid: Map<string, Payment[]>, limit = CONFIRM_QUEUE_SIZE): DateToConfirm[] {
  return contracts
    .flatMap((contract): DateToConfirm[] => {
      const facts = (deadlineFacts(contract.facts) ?? []).filter((f) => f.label !== "confirmed");
      if (facts.length === 0 || facts.some((f) => f.value === null)) return [];
      const dates = contractDates(contract.facts, today, (paid.get(contract.vendorId) ?? []).map((p) => p.date));
      if (!dates.noticeDeadline || dates.noticeDeadline < today) return [];
      return [{ contract, deadline: dates.noticeDeadline, label: dates.label, facts }];
    })
    .sort((a, b) => a.deadline.localeCompare(b.deadline) || a.contract.id.localeCompare(b.contract.id))
    .slice(0, limit);
}

/** A yes to the queue: every unchecked fact behind the date, confirmed as it reads. */
export function confirmEdits(facts: Fact[], by: string, on: string): FactEdits {
  return Object.fromEntries(facts.map((f) => [f.field, { kind: "confirmed", value: f.value, by, on }]));
}
