import type { Clause, Fact, FactField } from "../data/types";
import { formatDate, formatMoney, formatPercent } from "./format";

const FIELD_LABELS: Record<FactField, string> = {
  startDate: "Start date",
  endDate: "End date",
  termMonths: "Term",
  renewalTermMonths: "Renews for",
  noticeDays: "Notice period",
  noticeMonths: "Notice period",
  renewalOptionMonths: "Client may renew for",
  annualFee: "Yearly fee",
  monthlyFee: "Monthly fee",
  unitRate: "Agreed rate",
  priceCapPercent: "Price rise cap",
  priceNoticeDays: "Notice of a price rise",
  surchargeCapPercent: "Fuel surcharge cap",
  markupPercent: "Markup on pay cost",
  conversionFeePercent: "Fee to hire a worker",
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
    case "renewalOptionMonths":
    case "noticeMonths":
      return `${v} months`;
    case "noticeDays":
      return `${v} days`;
    case "priceNoticeDays":
      return `${v} days before the term ends`;
    case "surchargeCapPercent":
      return `${formatPercent(v)} of the freight charge at most`;
    case "markupPercent":
      return `${formatPercent(v)} on top of pay cost`;
    case "conversionFeePercent":
      return `${formatPercent(v)} of annual pay`;
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
      return `${formatPercent(v)} ${fact.unit ?? "of the month's invoice"}`;
    default:
      return String(v);
  }
}

/** Where a fact comes from, such as "Clause 3, page 2", or "Opening paragraph, page 1" for clause 0. */
export function clauseRef(fact: Fact): string {
  return `${fact.clauseId === "0" ? "Opening paragraph" : `Clause ${fact.clauseId}`}, page ${fact.page}`;
}

/** A clause's heading as the contract prints it: "3. Renewal", or just "Parties" for the unnumbered opening paragraph. */
export function clauseTitle(clause: Pick<Clause, "id" | "heading">): string {
  return clause.id === "0" ? clause.heading : `${clause.id}. ${clause.heading}`;
}
