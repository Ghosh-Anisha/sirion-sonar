import type { Fact, FactField } from "../data/types";
import { formatDate, formatMoney, formatPercent } from "./format";

const FIELD_LABELS: Record<FactField, string> = {
  startDate: "Start date",
  endDate: "End date",
  termMonths: "Term",
  renewalTermMonths: "Renews for",
  noticeDays: "Notice period",
  annualFee: "Yearly fee",
  monthlyFee: "Monthly fee",
  unitRate: "Agreed rate",
  priceCapPercent: "Price rise cap",
  slaOnTimePercent: "On time target",
  slaCreditPercent: "Service credit",
};

export function fieldLabel(field: FactField): string {
  return FIELD_LABELS[field];
}

/** What kind of input a Correct box needs for a field. */
export function fieldInputType(field: FactField): "date" | "number" {
  return field === "startDate" || field === "endDate" ? "date" : "number";
}

/** A fact's value in plain words, or what is missing about it. */
export function formatFactValue(fact: Fact): string {
  const v = fact.value;
  if (v === null) return fact.label === "bounded" ? "Unreadable in the file" : "Not on file";
  if (typeof v === "string") return formatDate(v);
  switch (fact.field) {
    case "termMonths":
    case "renewalTermMonths":
      return `${v} months`;
    case "noticeDays":
      return `${v} days`;
    case "annualFee":
      return `${formatMoney(v)} a year`;
    case "monthlyFee":
      return `${formatMoney(v)} a month`;
    case "unitRate":
      return fact.unit ? `${formatMoney(v)} ${fact.unit}` : formatMoney(v);
    case "priceCapPercent":
      return `${formatPercent(v)} at most`;
    case "slaOnTimePercent":
      return `${formatPercent(v)} on time`;
    case "slaCreditPercent":
      return `${formatPercent(v)} of the month's invoice`;
    default:
      return String(v);
  }
}

/** Where a fact comes from, such as "Clause 3, page 2". */
export function clauseRef(fact: Fact): string {
  return `Clause ${fact.clauseId}, page ${fact.page}`;
}
