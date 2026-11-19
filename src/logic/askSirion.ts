import type { Vendor } from "../data/types";
import { formatDate, formatMoney } from "./format";
import type { Item } from "./items";
import type { LedgerRow } from "./ledger";

/*
 * The three AskSirion example questions on /solution, answered by code from the sample ledger.
 * This shows the kind of answer a platform gives from a confirmed ledger. It is not a model.
 */

export type QuestionId = "march" | "above-rate" | "no-owner";

export interface Answer {
  columns: string[];
  rows: string[][];
}

export function askSirion(id: QuestionId, ledger: LedgerRow[], items: Item[], vendors: Vendor[], today: string): Answer {
  switch (id) {
    case "march":
      return {
        columns: ["Supplier", "Term ends", "Label"],
        rows: ledger.filter((r) => r.endDate?.slice(5, 7) === "03").map((r) => [r.supplier, formatDate(r.endDate!), r.label[0].toUpperCase() + r.label.slice(1)]),
      };
    case "above-rate": {
      const year = today.slice(0, 4);
      const name = new Map(vendors.map((v) => [v.id, v.name]));
      return {
        columns: ["Supplier", "Invoice", "Above the agreed rate"],
        rows: items
          .filter((i) => i.detail.kind === "invoice" && i.openedOn.slice(0, 4) === year)
          .map((i) => (i.detail.kind === "invoice" ? [name.get(i.vendorId) ?? i.vendorId, i.detail.invoiceNumber, formatMoney(i.detail.difference)] : [])),
      };
    }
    case "no-owner":
      return {
        columns: ["Supplier", "What for"],
        rows: vendors.filter((v) => v.ownerId === null).map((v) => [v.name, v.category]),
      };
  }
}
