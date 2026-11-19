import type { Contract, Label, Payment, Person, Vendor } from "../data/types";
import { contractDates } from "./dates";

/** One row of the ledger handed over to a contract management platform. Dates are ISO, so any system reads them. */
export interface LedgerRow {
  contractId: string;
  supplier: string;
  contract: string;
  owner: string;
  endDate: string | null;
  noticeDeadline: string | null;
  label: Label;
  /** Why a date is missing or only known as a window. */
  note: string;
}

const LABEL_ORDER: Record<Label, number> = { confirmed: 0, derived: 1, bounded: 2, unknown: 3 };

/** The ledger as it stands today, confirmed contracts first, then by supplier. */
export function ledgerRows(contracts: Contract[], vendors: Vendor[], people: Person[], paid: Map<string, Payment[]>, today: string): LedgerRow[] {
  return contracts
    .map((c) => {
      const vendor = vendors.find((v) => v.id === c.vendorId)!;
      const owner = people.find((p) => p.id === vendor.ownerId);
      const d = contractDates(c.facts, today, (paid.get(c.vendorId) ?? []).map((p) => p.date));
      const note =
        d.label === "bounded" && d.earliestDeadline
          ? `Notice deadline falls between ${d.earliestDeadline} and ${d.latestDeadline}`
          : d.label === "bounded" || d.label === "unknown"
            ? c.gap ?? "Not enough on file to work out the dates"
            : "";
      return {
        contractId: c.id,
        supplier: vendor.name,
        contract: c.title,
        owner: owner?.name ?? "No owner",
        endDate: d.endDate,
        noticeDeadline: d.noticeDeadline,
        label: d.label,
        note,
      };
    })
    .sort((a, b) => LABEL_ORDER[a.label] - LABEL_ORDER[b.label] || a.supplier.localeCompare(b.supplier) || a.contract.localeCompare(b.contract));
}

function cell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** The ledger as CSV, one header row, with quotes only where a value needs them. */
export function ledgerCsv(rows: LedgerRow[]): string {
  const header = ["supplier", "contract", "owner", "end_date", "notice_deadline", "label", "note"];
  const lines = rows.map((r) => [r.supplier, r.contract, r.owner, r.endDate ?? "", r.noticeDeadline ?? "", r.label, r.note].map(cell).join(","));
  return [header.join(","), ...lines].join("\r\n") + "\r\n";
}
