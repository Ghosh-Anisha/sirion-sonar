import { formatMoney } from "./format";
import type { Item } from "./items";

/*
 * One invoice followed through the solution diagram: each step lights up the parts it touches
 * and says what happens in one line. The amounts come from the item, which code worked out.
 */

export interface PlayStep {
  /** The data-part ids to light up. */
  lit: string[];
  caption: string;
}

export function invoicePlay(item: Item | undefined, vendorName: string, ownerName: string, financeName: string): PlayStep[] {
  if (!item || item.detail.kind !== "invoice") return [];
  const d = item.detail;
  const rate = formatMoney(Number(d.term.fact.value));
  const unit = d.term.fact.unit ? ` ${d.term.fact.unit}` : "";
  return [
    { lit: ["event-invoice"], caption: `${vendorName} sends invoice ${d.invoiceNumber} for ${formatMoney(d.invoiced)}.` },
    { lit: ["source-mail", "agent-email", "privacy"], caption: "The Email agent reads it in the shared inbox, with names masked before the model sees it." },
    { lit: ["step-5", "step-6", `ledger-${d.contractId}`], caption: `The contract and its agreed rate of ${rate}${unit} are looked up.` },
    { lit: ["step-7"], caption: `Code finds the difference: ${formatMoney(d.difference)} above the agreed rate.` },
    { lit: [`cockpit-${item.id}`], caption: "A Check item appears on the list, with the invoice and the clause." },
    { lit: ["person-finance", "person-owner", "step-8"], caption: `${financeName} in Finance and ${ownerName}, the owner, are told. Sonar never holds the payment.` },
  ];
}
