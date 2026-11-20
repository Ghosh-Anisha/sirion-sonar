import type { Contract, Label } from "../data/types";
import { andList } from "./accessText";
import { tally, type AccessEntry, type FirstRead, type ReadStep } from "./firstRead";
import type { Item, ItemType } from "./items";

/*
 * The eight steps of the first read, per "Where AI is used and where it is not" in docs/spec.md,
 * worked out from the sample data for the suppliers in scope. Each step says who does the work:
 * plain code, a model, or an agent, which is a model taking several steps with read-only tools.
 */

export type Doer = "code" | "model" | "agent";
export type StageId = "connect" | "vendors" | "find" | "sort" | "read" | "record" | "watch" | "tell";

export interface Stage {
  id: StageId;
  title: string;
  doer: Doer;
  /** What does the work, in a few words. */
  by: string;
  /** What the step is doing, in one line. */
  line: string;
  total: number;
  unit: string;
  /** What the step found, once it is done. */
  result: string;
}

export interface PipelineInput {
  plan: FirstRead;
  /** The suppliers being read, highest spend first. */
  steps: ReadStep[];
  products: string[];
  contracts: Contract[];
  items: Item[];
  procurementLeadId: string;
}

/** The suppliers a read covers: the top few by spend for a pilot, or every one. */
export function scopeSteps(plan: FirstRead, pilot: boolean, size: number): ReadStep[] {
  return pilot ? plan.steps.slice(0, size) : plan.steps;
}

const LABEL_ORDER: Label[] = ["confirmed", "derived", "bounded", "unknown"];
const TYPE_ORDER: { type: ItemType; name: string }[] = [
  { type: "decide", name: "Decide" },
  { type: "check", name: "Check" },
  { type: "fix", name: "Fix" },
  { type: "find", name: "Find" },
];

function countsText<T>(rows: T[], keys: { key: string; name: string }[], keyOf: (row: T) => string): string {
  const parts = keys.flatMap(({ key, name }) => {
    const n = rows.filter((r) => keyOf(r) === key).length;
    return n === 0 ? [] : [`${n} ${name}`];
  });
  return andList(parts);
}

export function pipelineStages({ plan, steps, products, contracts, items, procurementLeadId }: PipelineInput): Stage[] {
  const ids = new Set(steps.map((s) => s.vendorId));
  const files = steps.flatMap((s) => s.files);
  const own = contracts.filter((c) => ids.has(c.vendorId));
  const facts = own.flatMap((c) => c.facts);
  const open = items.filter((i) => i.status === "open" && ids.has(i.vendorId));
  const told = new Set(open.map((i) => i.ownerId ?? procurementLeadId)).size;
  const counts = tally(steps, steps.length);
  const count = (result: keyof typeof counts) => counts[result];
  const sorted = (result: string) => plan.lines.filter((l) => l.result === result).length;

  return [
    {
      id: "connect",
      title: "Connect",
      doer: "code",
      by: "Code: a standard read-only sign-in",
      line: `Signs in read-only to ${andList(products)}.`,
      total: products.length,
      unit: "sources connected",
      result: "Every source is read-only.",
    },
    {
      id: "vendors",
      title: "Vendor list",
      doer: "code",
      by: "Code: payment rules and name matching",
      line: "Sorts each payment line, drops the ones that are not suppliers, and merges spellings of one name.",
      total: plan.lines.length,
      unit: "payment lines sorted",
      result: `${sorted("supplier")} kept, ${sorted("not-supplier")} dropped and ${sorted("not-sure")} not sure. They make ${plan.steps.length} suppliers.`,
    },
    {
      id: "find",
      title: "Find",
      doer: "agent",
      by: "Agent: the Finder, with read-only search as its tool",
      line: "Searches the drive and mail for each supplier by name and email domain, highest spend first.",
      total: steps.length,
      unit: "suppliers searched",
      result: `${steps.length} suppliers, ${count("full")} found, ${count("partial")} partial, ${count("none")} not found.`,
    },
    {
      id: "sort",
      title: "Sort files",
      doer: "model",
      by: "Code first, then a model call for files the code cannot place",
      line: "Reads the first page of each file it found, to tell a contract from everything else.",
      total: files.length,
      unit: "files sorted",
      result: `${files.length} contracts kept for a full read. Nothing else is kept.`,
    },
    {
      id: "read",
      title: "Read",
      doer: "agent",
      by: "Model call to read the terms, then the Reader and checker agent and the Reconciler agent",
      line: "Reads each contract on masked text and quotes the sentence behind every term.",
      total: own.length,
      unit: "contracts read",
      result: `${facts.length} terms read, each with the sentence it comes from.`,
    },
    {
      id: "record",
      title: "Record",
      doer: "code",
      by: "Code",
      line: "Writes each fact with its sentence, page and label. Dates are worked out here, never by a model.",
      total: facts.length,
      unit: "facts recorded",
      result: `${countsText(facts, LABEL_ORDER.map((l) => ({ key: l, name: l })), (f) => f.label)}.`,
    },
    {
      id: "watch",
      title: "Watch",
      doer: "code",
      by: "Code: nightly checks for time, arrival, absence and change",
      line: "Checks every date, payment and supplier email against the rules.",
      total: open.length,
      unit: "items opened",
      result: `${countsText(open, TYPE_ORDER.map((t) => ({ key: t.type, name: t.name })), (i) => i.type)}.`,
    },
    {
      id: "tell",
      title: "Tell and draft",
      doer: "agent",
      by: "Agent: the Email agent and the Drafter",
      line: "Tells each owner what needs them and drafts the replies. Nothing goes out until the owner clicks send.",
      total: told,
      unit: "people told",
      result: `${open.length} items waiting with a draft for their owner to read.`,
    },
  ];
}

const ENTRY_STAGE: Record<AccessEntry["kind"], StageId> = { export: "vendors", search: "find", open: "read", message: "watch" };

/** The access log entries a stage adds, for the suppliers in scope. */
export function stageEntries(stage: StageId, plan: FirstRead, steps: ReadStep[]): AccessEntry[] {
  const ids = new Set(steps.map((s) => s.vendorId));
  return plan.access.filter((e) => ENTRY_STAGE[e.kind] === stage && (e.vendorId === null || ids.has(e.vendorId)));
}

/*
 * Rough rates for a real first read: a second per payment line, 45 seconds to search
 * for one supplier, and 2 minutes to read one contract with both passes.
 */
const SECONDS_PER_LINE = 1;
const SECONDS_PER_SEARCH = 45;
const SECONDS_PER_CONTRACT = 120;

/** Roughly how long a real first read takes for these suppliers, in whole minutes. */
export function estimateMinutes(plan: FirstRead, steps: ReadStep[]): number {
  const files = steps.reduce((n, s) => n + s.files.length, 0);
  const seconds = plan.lines.length * SECONDS_PER_LINE + steps.length * SECONDS_PER_SEARCH + files * SECONDS_PER_CONTRACT;
  return Math.ceil(seconds / 60);
}

/** The share of supplier spend, 0 to 100, that goes to the suppliers in scope. */
export function spendShare(plan: FirstRead, steps: ReadStep[]): number {
  const total = plan.steps.reduce((n, s) => n + s.spend, 0);
  return total === 0 ? 0 : Math.round((steps.reduce((n, s) => n + s.spend, 0) / total) * 100);
}
