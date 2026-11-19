import { COMPANY_NAME, draftTemplates, type DraftKey } from "../data/drafts";
import type { Contract, Email, Fact, FactField, Vendor } from "../data/types";
import { addDays } from "./calendar";
import { round2 } from "./checks";
import { formatFactValue } from "./factFormat";
import { findFact, numberValue } from "./facts";
import { formatDate, formatMoney, formatMonthName, formatPercent } from "./format";
import type { ActionKind, Item } from "./items";

export interface Draft {
  to: string;
  subject: string;
  body: string;
}

/** Replaces every {word} in a template. Throws if a word has no value, so a half-filled draft can never be sent. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    if (value === undefined) throw new Error(`No value for {${key}}`);
    return value;
  });
}

interface DraftContext {
  vendor: Vendor;
  contract: Contract | undefined;
  /** The email the item came from, when it came from one. Replies go back to its sender. */
  email: Email | undefined;
  sender: string;
}

/** "clause 3", for use inside a sentence. */
function clauseName(fact: Fact): string {
  return `clause ${fact.clauseId}`;
}

function clauseOf(contract: Contract | undefined, field: FactField): string {
  const fact = contract && findFact(contract.facts, field);
  return fact ? clauseName(fact) : "the relevant clause";
}

/**
 * The reply for an item. A renewal has a draft only once the owner has chosen
 * renew, renegotiate or end. An amendment has none: it is answered on Versions.
 */
export function draftFor(item: Item, decision: ActionKind | null, ctx: DraftContext): Draft | null {
  const d = item.detail;
  const { contract } = ctx;
  const base: Record<string, string> = {
    sender: ctx.sender,
    company: COMPANY_NAME,
    title: contract ? `${contract.title} agreement` : "agreement",
  };
  const to = ctx.email?.from.address ?? `accounts@${ctx.vendor.emailDomains[0]}`;
  const make = (key: DraftKey, values: Record<string, string>): Draft => {
    const all = { ...base, ...values };
    const template = draftTemplates[key];
    return { to, subject: fillTemplate(template.subject, all), body: fillTemplate(template.body, all) };
  };

  switch (d.kind) {
    case "renewal": {
      if (decision !== "renew" && decision !== "renegotiate" && decision !== "end") return null;
      const endDate = d.dates.endDate ? formatDate(d.dates.endDate) : `the end of the term, no later than ${formatDate(addDays(d.dates.latestDeadline!, numberValue(contract?.facts ?? [], "noticeDays") ?? 0))}`;
      return make(decision, { endDate, deadline: formatDate(item.dueDate), clause: clauseOf(contract, "noticeDays") });
    }
    case "invoice":
      return make("invoice", {
        invoiceNumber: d.invoiceNumber,
        invoiced: formatMoney(d.invoiced),
        agreed: formatMoney(d.agreed),
        difference: formatMoney(d.difference),
        agreedRate: formatFactValue(d.term.fact),
        clause: clauseName(d.term.fact),
      });
    case "price-rise": {
      const cap = d.capPercent ?? 0;
      return make("price-rise", {
        proposed: formatMoney(d.proposed),
        effectiveFrom: formatDate(d.effectiveFrom),
        cap: formatPercent(cap),
        increase: formatPercent(d.increasePercent),
        capped: formatMoney(round2(d.current * (1 + cap / 100))),
        clause: clauseOf(contract, "priceCapPercent"),
      });
    }
    case "service":
      if (d.credit === null) return null;
      return make("service", {
        month: formatMonthName(d.month),
        onTime: String(d.onTime),
        trips: String(d.trips),
        onTimePercent: formatPercent(d.onTimePercent),
        target: formatPercent(d.targetPercent),
        creditPercent: formatPercent(numberValue(contract?.facts ?? [], "slaCreditPercent") ?? 0),
        credit: formatMoney(d.credit),
        clause: clauseOf(contract, "slaOnTimePercent"),
      });
    case "no-contract":
      return make("no-contract", {});
    case "amendment":
      return null;
  }
}
