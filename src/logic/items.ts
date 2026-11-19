import type { Contract, Email, Payment, Vendor } from "../data/types";
import { applyAmendment } from "./amend";
import { amendmentItemId, emailItems } from "./arrivals";
import { addDays, daysBetween, laterOf } from "./calendar";
import type { RateTerm } from "./checks";
import { supplierPayments } from "./classify";
import { contractDates, type ContractDates } from "./dates";
import { paymentsByVendor } from "./match";

export type ItemType = "decide" | "check" | "fix" | "find";
/** Why the item exists: a date is close, something arrived, something is missing, or a term changed. */
export type Reason = "time" | "arrival" | "absence" | "change";
export type ItemStatus = "open" | "done";
export type ActionKind = "renew" | "renegotiate" | "end" | "sent" | "accepted" | "rejected" | "resolved";

/** What a person did about an item. Kept in app state, keyed by item id. */
export interface ItemAction {
  kind: ActionKind;
  on: string;
  by: string;
}

/** Alerts start this many days before a notice deadline. */
export const DECIDE_WINDOW_DAYS = 90;
/** A supplier paid with no contract should be found within this many days of the first read. */
export const FIND_WITHIN_DAYS = 30;

export type ItemDetail =
  | { kind: "renewal"; contractId: string; dates: ContractDates }
  | { kind: "invoice"; emailId: string; contractId: string; invoiceNumber: string; invoiced: number; agreed: number; difference: number; term: RateTerm }
  | { kind: "price-rise"; emailId: string; contractId: string; current: number; proposed: number; increasePercent: number; capPercent: number | null; effectiveFrom: string }
  | { kind: "amendment"; emailId: string; contractId: string; before: ContractDates; after: ContractDates }
  | { kind: "service"; emailId: string; contractId: string; month: string; trips: number; onTime: number; onTimePercent: number; targetPercent: number; credit: number | null }
  | { kind: "no-contract"; paymentIds: string[]; total: number; lastPaid: string };

export interface Item {
  id: string;
  type: ItemType;
  reason: Reason;
  vendorId: string;
  ownerId: string | null;
  openedOn: string;
  dueDate: string;
  status: ItemStatus;
  action: ItemAction | null;
  detail: ItemDetail;
}

export interface ItemInput {
  today: string;
  /** The day the first read ran. Items found by it open on this day. */
  firstReadOn: string;
  vendors: Vendor[];
  contracts: Contract[];
  payments: Payment[];
  emails: Email[];
  actions: Record<string, ItemAction>;
}

export type Draft = Omit<Item, "status" | "action" | "ownerId">;

/** The Needs you list for a given day. Done items stay in the list with their action, so measures can count them. */
export function buildItems(input: ItemInput): Item[] {
  const { today, vendors, actions } = input;
  const contracts = withAcceptedAmendments(input.contracts, input.emails, actions);
  const paid = paymentsByVendor(
    supplierPayments(input.payments.filter((p) => p.date <= today)),
    vendors,
  );
  const datesOf = (c: Contract) => contractDates(c.facts, today, (paid.get(c.vendorId) ?? []).map((p) => p.date));
  const arrived = input.emails.filter((e) => e.receivedOn <= today);

  const drafts: Draft[] = [
    ...contracts.flatMap((c) => decideItem(c, datesOf(c), input)),
    ...arrived.flatMap((e) => emailItems(e, input, contracts, datesOf)),
    ...findItems(vendors, contracts, paid, input.firstReadOn),
  ];

  const ownerOf = new Map(vendors.map((v) => [v.id, v.ownerId]));
  return drafts.map((d) => ({
    ...d,
    ownerId: ownerOf.get(d.vendorId) ?? null,
    status: actions[d.id] ? "done" : "open",
    action: actions[d.id] ?? null,
  }));
}

function withAcceptedAmendments(contracts: Contract[], emails: Email[], actions: Record<string, ItemAction>): Contract[] {
  return contracts.map((contract) =>
    emails.reduce((current, email) => {
      const amendment = email.amendment;
      const accepted = actions[amendmentItemId(email.id)]?.kind === "accepted";
      return amendment && accepted && amendment.contractId === contract.id ? applyAmendment(current, amendment) : current;
    }, contract),
  );
}

/** A renewal decision, from 90 days before the notice deadline until the term ends. */
function decideItem(contract: Contract, dates: ContractDates, input: ItemInput): Draft[] {
  const due = dates.earliestDeadline;
  if (!due) return [];
  if (daysBetween(input.today, due) > DECIDE_WINDOW_DAYS) return [];
  if (dates.endDate && input.today > dates.endDate) return [];
  return [
    {
      id: `decide:${contract.id}:${due}`,
      type: "decide",
      reason: "time",
      vendorId: contract.vendorId,
      openedOn: laterOf(addDays(due, -DECIDE_WINDOW_DAYS), input.firstReadOn),
      dueDate: due,
      detail: { kind: "renewal", contractId: contract.id, dates },
    },
  ];
}

/** Suppliers the company pays with no contract on file. */
function findItems(vendors: Vendor[], contracts: Contract[], paid: Map<string, Payment[]>, firstReadOn: string): Draft[] {
  const withContract = new Set(contracts.map((c) => c.vendorId));
  return vendors.flatMap((vendor) => {
    const lines = paid.get(vendor.id) ?? [];
    if (withContract.has(vendor.id) || lines.length === 0) return [];
    return [
      {
        id: `find:${vendor.id}`,
        type: "find" as const,
        reason: "absence" as const,
        vendorId: vendor.id,
        openedOn: firstReadOn,
        dueDate: addDays(firstReadOn, FIND_WITHIN_DAYS),
        detail: {
          kind: "no-contract" as const,
          paymentIds: lines.map((p) => p.id),
          total: lines.reduce((sum, p) => sum + p.amount, 0),
          lastPaid: lines.reduce((last, p) => laterOf(last, p.date), lines[0].date),
        },
      },
    ];
  });
}
