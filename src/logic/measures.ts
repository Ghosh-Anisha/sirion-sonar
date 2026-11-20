import type { Contract, FactField, Payment, Vendor } from "../data/types";
import { routeItem } from "./alerts";
import { addDays, daysBetween, laterOf } from "./calendar";
import { coverage } from "./coverage";
import { contractDates } from "./dates";
import type { FactEdits } from "./edits";
import { DECIDE_WINDOW_DAYS, type ActionKind, type Item, type ItemAction } from "./items";
import { deadlineLabel } from "./labels";

/*
 * The numbers on the Measures screen, per "Success metrics" in docs/spec.md.
 * Everything is worked out from the sample data and what people have done in the demo.
 * There is no baseline, so nothing here claims a saving.
 */

const DECISIONS: ActionKind[] = ["renew", "renegotiate", "end"];
const DATE_FIELDS: FactField[] = ["startDate", "endDate", "termMonths", "renewalTermMonths", "noticeDays"];

export interface MeasureInput {
  today: string;
  firstReadOn: string;
  /** Every item for today, open and done. */
  items: Item[];
  /** Contracts as they now read. */
  contracts: Contract[];
  vendors: Vendor[];
  payments: Payment[];
  paid: Map<string, Payment[]>;
  actions: Record<string, ItemAction>;
  factEdits: Record<string, FactEdits>;
  /** When each item was first opened. */
  opened: Record<string, string>;
  procurementLeadId: string;
  connectionsApproved: boolean;
}

export interface Deadline {
  itemId: string;
  contractId: string;
  dueDate: string;
  openedOn: string;
}

/**
 * Every renewal deadline that has come into view since the first read: the current one
 * for each contract, plus any earlier ones that came and went as terms rolled over.
 */
export function deadlinesSoFar(contracts: Contract[], paid: Map<string, Payment[]>, firstReadOn: string, today: string): Deadline[] {
  const found: Deadline[] = [];
  for (const contract of contracts) {
    const paymentDates = (paid.get(contract.vendorId) ?? []).map((p) => p.date);
    let day = firstReadOn;
    for (let guard = 0; guard < 50; guard++) {
      const dates = contractDates(contract.facts, day, paymentDates);
      const due = dates.earliestDeadline;
      if (!due || addDays(due, -DECIDE_WINDOW_DAYS) > today) break;
      if (dates.endDate && dates.endDate < firstReadOn) break;
      found.push({
        itemId: `decide:${contract.id}:${due}`,
        contractId: contract.id,
        dueDate: due,
        openedOn: laterOf(addDays(due, -DECIDE_WINDOW_DAYS), firstReadOn),
      });
      if (!dates.endDate || !dates.autoRenews || dates.endDate >= today) break;
      day = addDays(dates.endDate, 1);
    }
  }
  return found;
}

export interface NorthStar {
  /** Decided as renew, renegotiate or end on or before the deadline. */
  decidedInTime: number;
  /** Passed with no decision, or decided too late. */
  missed: number;
  /** Still ahead and not decided yet. Not counted either way. */
  pending: number;
  /** Share of settled deadlines decided in time, 0 to 100. Null until one is settled. */
  share: number | null;
}

export function northStar(deadlines: Deadline[], actions: Record<string, ItemAction>, today: string): NorthStar {
  let decidedInTime = 0;
  let missed = 0;
  let pending = 0;
  for (const d of deadlines) {
    const action = actions[d.itemId];
    const decided = action && DECISIONS.includes(action.kind);
    if (decided && action.on <= d.dueDate) decidedInTime += 1;
    else if (decided || d.dueDate < today) missed += 1;
    else pending += 1;
  }
  const settled = decidedInTime + missed;
  return { decidedInTime, missed, pending, share: settled === 0 ? null : Math.round((decidedInTime / settled) * 100) };
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const share = (part: number, whole: number) => (whole === 0 ? null : Math.round((part / whole) * 100));

export type MetricStatus = "on-track" | "off-track" | "no-target" | "no-data";

export interface Metric {
  id: string;
  title: string;
  question: string;
  value: number | null;
  unit: "percent" | "days" | "count";
  /** A plain reading of the value, such as "24 suppliers, 10 found, 2 partial, 12 not found". */
  detail: string;
  target: number | null;
  targetText: string;
  better: "higher" | "lower" | null;
  status: MetricStatus;
}

function status(value: number | null, target: number | null, better: Metric["better"]): MetricStatus {
  if (value === null) return "no-data";
  if (target === null || better === null) return "no-target";
  return (better === "higher" ? value >= target : value < target) ? "on-track" : "off-track";
}

function metric(m: Omit<Metric, "status">): Metric {
  return { ...m, status: status(m.value, m.target, m.better) };
}

export type SignalStatus = "clear" | "triggered" | "too-early" | "no-data";

export interface Signal {
  id: string;
  title: string;
  threshold: string;
  current: string;
  status: SignalStatus;
  response: string;
}

export interface Measures {
  northStar: NorthStar;
  metrics: Metric[];
  signals: Signal[];
}

/** Days of data before a rate based on people's habits means anything. */
export const SETTLE_DAYS = 7;

export function measures(input: MeasureInput): Measures {
  const { today, items, contracts, actions } = input;
  const open = items.filter((i) => i.status === "open");
  const deadlines = deadlinesSoFar(contracts, input.paid, input.firstReadOn, today);

  const cover = coverage(input.vendors, contracts, input.payments, today);
  const confirmed = contracts.filter((c) => deadlineLabel(c.facts) === "confirmed").length;

  const decideTimes = deadlines
    .map((d) => ({ d, a: actions[d.itemId] }))
    .filter(({ a }) => a && DECISIONS.includes(a.kind))
    .map(({ d, a }) => daysBetween(d.openedOn, a!.on));
  const medianDays = median(decideTimes);

  const routed = open.map((i) => ({ item: i, routing: routeItem(i, today, input.procurementLeadId) }));
  const escalated = routed.filter((r) => r.routing.escalated).length;
  const unowned = open.filter((i) => i.ownerId === null).length;
  const toLead = routed.filter((r) => r.routing.recipients.includes(input.procurementLeadId)).length;

  const invoiceChecks = items.filter((i) => i.detail.kind === "invoice" && i.action);
  const real = invoiceChecks.filter((i) => i.action!.kind === "flagged" || i.action!.kind === "sent").length;

  const dateEdits = Object.values(input.factEdits).flatMap((edits) =>
    Object.entries(edits).filter(([field]) => DATE_FIELDS.includes(field as FactField)).map(([, e]) => e!),
  );
  const corrected = dateEdits.filter((e) => e.kind === "corrected").length;
  const openedShare = share(items.filter((i) => input.opened[i.id]).length, items.length);
  const tooEarly = daysBetween(input.firstReadOn, today) < SETTLE_DAYS;

  const metrics: Metric[] = [
    metric({
      id: "coverage",
      title: "Coverage",
      question: "Of the suppliers we pay, how many have a contract record linked",
      value: cover.spendShare,
      unit: "percent",
      detail: `${cover.paid} suppliers, ${cover.full} found, ${cover.partial} partial, ${cover.none} not found. The share is of spend.`,
      target: 70,
      targetText: "70% of spend in the first month",
      better: "higher",
    }),
    metric({
      id: "confirmed",
      title: "Confirmed share",
      question: "Of the records, how many an owner has checked",
      value: share(confirmed, contracts.length),
      unit: "percent",
      detail: `${confirmed} of ${contracts.length} contracts have every date checked`,
      target: 50,
      targetText: "Half within 30 days",
      better: "higher",
    }),
    metric({
      id: "time-to-decision",
      title: "Time from alert to decision",
      question: "Whether people act once they are told",
      value: medianDays,
      unit: "days",
      detail: decideTimes.length === 0 ? "No renewal decided yet" : `Median of ${decideTimes.length} ${decideTimes.length === 1 ? "decision" : "decisions"}`,
      target: 10,
      targetText: "Median under 10 days",
      better: "lower",
    }),
    metric({
      id: "escalated",
      title: "Items escalated",
      question: "Where owners do not respond",
      value: escalated,
      unit: "count",
      detail: `${escalated} open ${escalated === 1 ? "item has" : "items have"} gone to the procurement lead as well`,
      target: null,
      targetText: "Falling month on month",
      better: null,
    }),
    metric({
      id: "real-flags",
      title: "Flagged invoices that were real",
      question: "Whether the Check items are worth a person's time",
      value: share(real, invoiceChecks.length),
      unit: "percent",
      detail: invoiceChecks.length === 0 ? "No invoice check answered yet" : `${real} of ${invoiceChecks.length} answered checks were queried or flagged`,
      target: 60,
      targetText: "At least 6 in 10",
      better: "higher",
    }),
    metric({
      id: "unowned",
      title: "Items with no owner",
      question: "How big the ownership gap is",
      value: unowned,
      unit: "count",
      detail: `${unowned} open ${unowned === 1 ? "item goes" : "items go"} straight to the procurement lead`,
      target: null,
      targetText: "Counted from day one, no target",
      better: null,
    }),
  ];

  const leadShare = share(toLead, open.length);
  const signals: Signal[] = [
    {
      id: "corrections",
      title: "Owners correct too many dates",
      threshold: "More than 1 in 4 checked dates is changed",
      current: dateEdits.length === 0 ? "No dates checked yet" : `${corrected} of ${dateEdits.length} checked dates changed`,
      status: dateEdits.length === 0 ? "no-data" : corrected / dateEdits.length > 0.25 ? "triggered" : "clear",
      response: "Stop alerting on Derived dates. Show them as questions to confirm, and improve the reading first.",
    },
    {
      id: "unread",
      title: "Alerts go unread",
      threshold: "Fewer than 4 in 10 are opened",
      current: `${openedShare ?? 0}% of items opened`,
      status: tooEarly ? "too-early" : (openedShare ?? 0) < 40 ? "triggered" : "clear",
      response: "Cut the list to items due within 30 days and send the rest in the weekly email only.",
    },
    {
      id: "found",
      title: "Few suppliers are found",
      threshold: "Under 40% of spend linked after the first read",
      current: `${cover.spendShare}% of spend linked`,
      status: cover.spendShare < 40 ? "triggered" : "clear",
      response: "Ask the finance lead to upload the missing contracts for the top suppliers by spend.",
    },
    {
      id: "access",
      title: "IT refuses org wide access",
      threshold: "Access denied or limited to one mailbox",
      current: input.connectionsApproved ? "All three connections approved, in the mock" : "Access limited",
      status: input.connectionsApproved ? "clear" : "triggered",
      response: "Connect owner by owner, starting with the top suppliers, and accept slower coverage.",
    },
    {
      id: "procurement",
      title: "Procurement ends up with most items",
      threshold: "Over half of the open items go to the procurement lead",
      current: leadShare === null ? "No open items" : `${toLead} of ${open.length} open items, ${leadShare}%`,
      status: leadShare === null ? "no-data" : leadShare > 50 ? "triggered" : "clear",
      response: "Ownership is the real problem. Make assigning an owner the first task instead of reading more files.",
    },
  ];

  return { northStar: northStar(deadlines, actions, today), metrics, signals };
}
