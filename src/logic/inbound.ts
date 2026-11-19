import type { Contract, Email, Payment, Person, Vendor } from "../data/types";
import { applyAmendment } from "./amend";
import { amendmentItemId } from "./arrivals";
import { checkInvoice, invoiceTotal, onTimePercent, percentIncrease, type RateTerm } from "./checks";
import { contractDates } from "./dates";
import { clauseRef, formatFactValue } from "./factFormat";
import { findFact, numberValue } from "./facts";
import { formatDate, formatMoney, formatMonthName, formatPercent } from "./format";
import type { Item } from "./items";
import { vendorForEmail } from "./match";
import { compareClauses } from "./redline";
import { itemSentence } from "./sentences";

/*
 * What happens when an email arrives, per "What happens when an email arrives" in docs/spec.md:
 * read, recognise the supplier, look up the contract and payments, compare, explain, route.
 * In the product the email agent does the reading. Here the reading is the sample data,
 * and every comparison and amount below is worked out in code.
 */

export type StageId = "read" | "recognise" | "look-up" | "compare" | "explain" | "route";

export interface Stage {
  id: StageId;
  title: string;
  result: string;
}

export type Route =
  | { kind: "versions"; contractId: string; to: string }
  | { kind: "item"; itemIds: string[]; to: string }
  | { kind: "filed"; contractId: string }
  | { kind: "unknown" };

export interface Trace {
  stages: Stage[];
  route: Route;
}

export interface InboundContext {
  vendors: Vendor[];
  contracts: Contract[];
  /** The contracts before any amendment, to compare an amendment with what it replaces. */
  originals: Contract[];
  paid: Map<string, Payment[]>;
  items: Item[];
  people: Person[];
  procurementLeadId: string;
  today: string;
}

const TITLES: Record<StageId, string> = {
  read: "Read the email",
  recognise: "Recognise the supplier",
  "look-up": "Look up the contract and payments",
  compare: "Compare with the contract",
  explain: "Explain the difference",
  route: "Route it",
};

function stage(id: StageId, result: string): Stage {
  return { id, title: TITLES[id], result };
}

function readResult(email: Email): string {
  const files = email.attachments.length === 0 ? "no attachments" : email.attachments.length === 1 ? "1 attachment" : `${email.attachments.length} attachments`;
  const found = email.amendment
    ? `${email.amendment.title}, signed ${formatDate(email.amendment.signedOn)}, changing ${email.amendment.clauses.length} clauses`
    : email.priceChange
      ? `a new monthly fee of ${formatMoney(email.priceChange.newMonthlyFee)} from ${formatDate(email.priceChange.effectiveFrom)}`
      : email.invoice
        ? `invoice ${email.invoice.number} for ${formatMoney(invoiceTotal(email.invoice))}${email.deliveries ? ", with a trip log" : ""}`
        : "nothing that needs a person";
  return `Read the message and ${files}. Found ${found}.`;
}

function lookUp(vendor: Vendor, own: Contract[], lines: Payment[]): string {
  const total = lines.reduce((sum, p) => sum + p.amount, 0);
  const last = lines.reduce((latest, p) => (p.date > latest ? p.date : latest), lines[0]?.date ?? "");
  const pay = lines.length === 0 ? "No payments yet." : `${lines.length} ${lines.length === 1 ? "payment" : "payments"} totalling ${formatMoney(total)}, the last on ${formatDate(last)}.`;
  const deal = own.length === 0 ? `No contract on file for ${vendor.name}.` : `Contract on file: ${own.map((c) => c.title).join(" and ")}.`;
  return `${deal} ${pay}`;
}

function compare(email: Email, own: Contract[], ctx: InboundContext): string {
  if (own.length === 0) return "There is no contract to compare against.";
  const parts: string[] = [];
  if (email.amendment) {
    const original = ctx.originals.find((c) => c.id === email.amendment!.contractId)!;
    const amended = applyAmendment(original, email.amendment);
    const changed = compareClauses(original.clauses, amended.clauses).filter((c) => c.status !== "same").map((c) => c.id);
    const before = contractDates(original.facts, ctx.today);
    const after = contractDates(amended.facts, ctx.today);
    parts.push(
      `Changes clauses ${changed.join(", ")}. The end date would move from ${formatDate(before.endDate!)} to ${formatDate(after.endDate!)}, and the notice deadline from ${formatDate(before.noticeDeadline!)} to ${formatDate(after.noticeDeadline!)}.`,
    );
  }
  if (email.priceChange) {
    const contract = own.find((c) => findFact(c.facts, "priceCapPercent"));
    const cap = contract ? findFact(contract.facts, "priceCapPercent")! : null;
    const rise = percentIncrease(email.priceChange.currentMonthlyFee, email.priceChange.newMonthlyFee);
    parts.push(
      cap
        ? `A ${formatPercent(rise)} rise against a cap of ${formatFactValue(cap)} in ${clauseRef(cap).split(",")[0].toLowerCase()}. It is over the cap by ${formatPercent(rise - (cap.value as number))}.`
        : `A ${formatPercent(rise)} rise, and the contract sets no cap.`,
    );
  }
  if (email.invoice) {
    const terms: RateTerm[] = own.flatMap((c) =>
      c.facts.filter((f) => f.field === "unitRate" || f.field === "monthlyFee").map((fact) => ({ contractId: c.id, fact })),
    );
    const check = checkInvoice(email.invoice, terms);
    if (check) {
      const where = clauseRef(check.term.fact).split(",")[0].toLowerCase();
      parts.push(
        check.difference > 0
          ? `Billed ${formatMoney(check.invoiced)}. At ${formatFactValue(check.term.fact)} in ${where}, the same work comes to ${formatMoney(check.agreed)}, so it is ${formatMoney(check.difference)} over.`
          : `Billed ${formatMoney(check.invoiced)}, which matches ${formatFactValue(check.term.fact)} in ${where}.`,
      );
    }
  }
  if (email.deliveries) {
    const contract = own.find((c) => findFact(c.facts, "slaOnTimePercent"));
    const target = contract ? numberValue(contract.facts, "slaOnTimePercent") : null;
    const actual = onTimePercent(email.deliveries);
    if (target !== null) {
      parts.push(
        `${email.deliveries.onTime} of ${email.deliveries.trips} trips on time in ${formatMonthName(email.deliveries.month)}, ${formatPercent(actual)}, ${actual < target ? "below" : "at or above"} the ${formatPercent(target)} in the contract.`,
      );
    }
  }
  return parts.join(" ");
}

function ownerPhrase(item: Item, ctx: InboundContext): string {
  const name = (id: string) => ctx.people.find((p) => p.id === id)?.name ?? id;
  return item.ownerId ? name(item.ownerId) : `${name(ctx.procurementLeadId)}, because nobody owns this supplier`;
}

/** Steps one email through the six stages and says where it ends up. */
export function traceEmail(email: Email, ctx: InboundContext): Trace {
  const vendor = vendorForEmail(email.from.address, ctx.vendors);
  const domain = email.from.address.split("@")[1];
  if (!vendor) {
    return {
      stages: [
        stage("read", readResult(email)),
        stage("recognise", `${domain} is not on the vendor list, so Sonar stops here and reads nothing more.`),
      ],
      route: { kind: "unknown" },
    };
  }

  const own = ctx.contracts.filter((c) => c.vendorId === vendor.id);
  const raised = ctx.items.filter((i) => "emailId" in i.detail && i.detail.emailId === email.id);
  const find = ctx.items.find((i) => i.id === `find:${vendor.id}`);
  const explained = raised.length > 0 ? raised : find && own.length === 0 ? [find] : [];

  const explain =
    explained.length > 0
      ? explained.map((i) => itemSentence(i, vendor.name, ctx.today)).join(" ")
      : "It matches the contract, so nothing needs a person.";

  let route: Route;
  let routeText: string;
  const amendmentItem = ctx.items.find((i) => i.id === amendmentItemId(email.id));
  if (email.amendment) {
    route = { kind: "versions", contractId: email.amendment.contractId, to: `/versions/${email.amendment.contractId}` };
    routeText = `Saved as a new version of the contract, with a redline, for ${amendmentItem ? ownerPhrase(amendmentItem, ctx) : "the owner"} to accept or reject. It does not change any dates until then.`;
  } else if (explained.length > 0) {
    route = { kind: "item", itemIds: explained.map((i) => i.id), to: `/item/${encodeURIComponent(explained[0].id)}` };
    const what = explained.length === 1 ? "an item" : `${explained.length} items`;
    routeText = raised.length > 0
      ? `Added ${what} to Needs you for ${ownerPhrase(explained[0], ctx)}.`
      : `Added to the Find item already on Needs you for ${ownerPhrase(explained[0], ctx)}.`;
  } else {
    route = { kind: "filed", contractId: own[0].id };
    routeText = "Filed with the contract. No item, because nothing differs.";
  }

  return {
    stages: [
      stage("read", readResult(email)),
      stage("recognise", `${domain} belongs to ${vendor.name}, on the vendor list.`),
      stage("look-up", lookUp(vendor, own, ctx.paid.get(vendor.id) ?? [])),
      stage("compare", compare(email, own, ctx)),
      stage("explain", explain),
      stage("route", routeText),
    ],
    route,
  };
}
