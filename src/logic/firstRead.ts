import type { Contract, ContractStatus, Email, Payment, Vendor } from "../data/types";
import { classifyPayment, type Classification } from "./classify";
import { groupNames, paymentsByVendor, vendorForEmail } from "./match";

/*
 * The first read, worked out from the sample data so onboarding can play it back:
 * sort the payments, build the vendor list, then search and read each supplier,
 * highest spend first. Nothing here is random, so the same data always plays the same way.
 */

export interface ClassifiedLine extends Classification {
  payee: string;
  amount: number;
}

export interface ReadStep {
  vendorId: string;
  vendorName: string;
  spend: number;
  result: ContractStatus;
  files: string[];
  /** What the read found, in one plain sentence. */
  note: string;
}

export interface AccessEntry {
  source: "payables" | "drive" | "mail";
  /** Reading the export, a search that opened nothing, a file opened, or a message read. */
  kind: "export" | "search" | "open" | "message";
  /** The supplier it was for, or null for the payables export. */
  vendorId: string | null;
  text: string;
}

export interface FirstRead {
  lines: ClassifiedLine[];
  /** Spellings merged into one supplier each. */
  supplierGroups: string[][];
  /** Name pairs that might be one supplier, for a person to settle. */
  unsureNames: [string, string][];
  steps: ReadStep[];
  access: AccessEntry[];
}

function readResult(own: Contract[]): ContractStatus {
  if (own.length === 0) return "none";
  return own.some((c) => c.gap === null) ? "full" : "partial";
}

function readNote(result: ContractStatus, own: Contract[]): string {
  if (result === "none") return "Searched the drive and mail. No contract found.";
  if (result === "partial") return own.find((c) => c.gap)!.gap!;
  return own.length === 1 ? "Found the contract and read it." : `Found ${own.length} contracts and read them.`;
}

export function planFirstRead(vendors: Vendor[], contracts: Contract[], payments: Payment[], emails: Email[]): FirstRead {
  const lines = payments.map((p) => ({ ...classifyPayment(p), payee: p.payee, amount: p.amount }));
  const kept = payments.filter((p) => classifyPayment(p).result === "supplier");
  const { groups, unsure } = groupNames(kept.map((p) => p.payee));
  const paid = paymentsByVendor(kept, vendors);

  const steps: ReadStep[] = vendors
    .filter((v) => paid.has(v.id))
    .map((v) => {
      const own = contracts.filter((c) => c.vendorId === v.id);
      const result = readResult(own);
      return {
        vendorId: v.id,
        vendorName: v.name,
        spend: paid.get(v.id)!.reduce((sum, p) => sum + p.amount, 0),
        result,
        files: own.map((c) => c.fileName),
        note: readNote(result, own),
      };
    })
    .sort((a, b) => b.spend - a.spend || a.vendorName.localeCompare(b.vendorName));

  const access: AccessEntry[] = [
    { source: "payables", kind: "export", vendorId: null, text: `Read the payables export, ${payments.length} lines, to build the vendor list.` },
    ...steps.flatMap((step): AccessEntry[] =>
      step.files.length === 0
        ? [{ source: "drive", kind: "search", vendorId: step.vendorId, text: `Searched for ${step.vendorName} by name and email domain. Opened nothing.` }]
        : step.files.map((file): AccessEntry => ({ source: "drive", kind: "open", vendorId: step.vendorId, text: `Opened ${file} in full, because its first page shows a contract.` })),
    ),
    ...emails.flatMap((e): AccessEntry[] => {
      const vendor = vendorForEmail(e.from.address, vendors);
      return vendor ? [{ source: "mail", kind: "message", vendorId: vendor.id, text: `Read "${e.subject}" in ${e.to.split("@")[0]}@, from ${vendor.name}, a supplier domain.` }] : [];
    }),
  ];

  return { lines, supplierGroups: groups, unsureNames: unsure, steps, access };
}

/** How many suppliers have been found, found in part, or not found after the first `count` steps. */
export function tally(steps: ReadStep[], count: number): Record<ContractStatus, number> {
  const done = steps.slice(0, count);
  return {
    full: done.filter((s) => s.result === "full").length,
    partial: done.filter((s) => s.result === "partial").length,
    none: done.filter((s) => s.result === "none").length,
  };
}
