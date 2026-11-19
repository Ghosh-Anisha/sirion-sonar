import type { Contract, Fact, FactField, Label } from "../data/types";
import { formatDate, formatMoney, formatMonthName, formatPercent } from "./format";
import { fieldLabel, formatFactValue } from "./factFormat";
import { findFact } from "./facts";
import type { Item } from "./items";
import { deadlineFacts } from "./labels";

/** One line of "why this is here": a value, how far to trust it, and the sentence it came from when it came from a contract. */
export interface Evidence {
  label: string;
  value: string;
  confidence?: Label;
  /** The contract fact behind the value, with its source sentence. */
  fact?: Fact;
  contractId?: string;
  /** Where a value came from when it is not a contract, such as an invoice. */
  note?: string;
}

function fromFact(contract: Contract, field: FactField): Evidence[] {
  const fact = findFact(contract.facts, field);
  return fact
    ? [{ label: fieldLabel(fact.field), value: formatFactValue(fact), confidence: fact.label, fact, contractId: contract.id }]
    : [];
}

/** The facts behind an item, computed values first, then the contract facts they rest on. */
export function itemEvidence(item: Item, contract: Contract | undefined): Evidence[] {
  const d = item.detail;
  switch (d.kind) {
    case "renewal": {
      const { endDate, earliestDeadline, latestDeadline, label } = d.dates;
      const deadline =
        earliestDeadline === latestDeadline
          ? formatDate(earliestDeadline!)
          : `Between ${formatDate(earliestDeadline!)} and ${formatDate(latestDeadline!)}`;
      const computed: Evidence[] = [
        { label: "Current term ends", value: endDate ? formatDate(endDate) : "Not known exactly", confidence: label, note: "Worked out from the facts below" },
        { label: "Last day to give notice", value: deadline, confidence: label, note: "End date minus the notice period" },
      ];
      const used = contract ? (deadlineFacts(contract.facts) ?? []) : [];
      return [...computed, ...used.map((fact) => ({ label: fieldLabel(fact.field), value: formatFactValue(fact), confidence: fact.label, fact, contractId: contract!.id }))];
    }
    case "invoice":
      return [
        { label: "Invoice amount", value: formatMoney(d.invoiced), note: `Invoice ${d.invoiceNumber}` },
        { label: "Agreed amount", value: formatMoney(d.agreed), note: "The same work at the agreed rate" },
        { label: "Difference", value: formatMoney(d.difference) },
        { label: fieldLabel(d.term.fact.field), value: formatFactValue(d.term.fact), confidence: d.term.fact.label, fact: d.term.fact, contractId: d.contractId },
      ];
    case "price-rise":
      return [
        ...(contract ? fromFact(contract, "monthlyFee") : []),
        { label: "Proposed fee", value: `${formatMoney(d.proposed)} a month`, note: `From ${formatDate(d.effectiveFrom)}, in the supplier's email` },
        { label: "Increase", value: formatPercent(d.increasePercent) },
        ...(contract ? fromFact(contract, "priceCapPercent") : []),
      ];
    case "amendment":
      return [
        { label: "End date now", value: formatDate(d.before.endDate!), confidence: d.before.label },
        { label: "End date if accepted", value: formatDate(d.after.endDate!), confidence: d.after.label },
        { label: "Notice deadline now", value: formatDate(d.before.noticeDeadline!), confidence: d.before.label },
        { label: "Notice deadline if accepted", value: formatDate(d.after.noticeDeadline!), confidence: d.after.label },
      ];
    case "service":
      return [
        { label: `On time in ${formatMonthName(d.month)}`, value: `${d.onTime} of ${d.trips} trips, ${formatPercent(d.onTimePercent)}`, note: "From the trip log sent with the invoice" },
        ...(contract ? fromFact(contract, "slaOnTimePercent") : []),
        ...(contract ? fromFact(contract, "slaCreditPercent") : []),
        ...(d.credit === null ? [] : [{ label: "Credit owed", value: formatMoney(d.credit), note: "The credit share of the invoice" }]),
      ];
    case "no-contract":
      return [
        { label: "Paid so far", value: formatMoney(d.total), note: `${d.paymentIds.length} ${d.paymentIds.length === 1 ? "payment" : "payments"} in the payables export` },
        { label: "Last paid", value: formatDate(d.lastPaid) },
        { label: "Contract", value: "Not found in the drive or the mail", confidence: "unknown" },
      ];
  }
}
