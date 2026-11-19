import type { ActionKind, Item, ItemDetail } from "./items";

export interface ActionOption {
  kind: ActionKind;
  label: string;
  /** What the click does, said plainly next to the button. */
  note?: string;
}

/*
 * What a person can do on each kind of item. None of these pays, holds, signs
 * or sends anything. Sending is a separate button on the draft, with a confirmation.
 */
const OPTIONS: Record<ItemDetail["kind"], ActionOption[]> = {
  renewal: [
    { kind: "renew", label: "Renew" },
    { kind: "renegotiate", label: "Renegotiate" },
    { kind: "end", label: "End it" },
  ],
  invoice: [
    { kind: "accepted", label: "Accept the invoice", note: "Finance pays it as usual. Sonar never pays or holds a payment." },
    { kind: "flagged", label: "Flag for finance", note: "Finance sees it on their list. The payment is not held." },
  ],
  "price-rise": [
    { kind: "accepted", label: "Accept the new price" },
    { kind: "flagged", label: "Flag for finance", note: "Finance sees it on their list." },
  ],
  service: [{ kind: "resolved", label: "Mark as settled" }],
  "no-contract": [{ kind: "resolved", label: "Mark as found", note: "Use this once the contract is in the drive." }],
  amendment: [],
};

export function actionOptions(item: Item): ActionOption[] {
  return OPTIONS[item.detail.kind];
}

const PAST: Record<ActionKind, string> = {
  renew: "chose to renew",
  renegotiate: "chose to renegotiate",
  end: "chose to end it",
  sent: "sent the reply",
  accepted: "accepted it",
  rejected: "rejected it",
  flagged: "flagged it for finance",
  resolved: "marked it as done",
};

/** "chose to renegotiate", for "Kavya Raman chose to renegotiate on 3 Dec 2026." */
export function actionPastTense(kind: ActionKind): string {
  return PAST[kind];
}

const TITLES: Record<ItemDetail["kind"], string> = {
  renewal: "Renewal",
  invoice: "Invoice above the agreed rate",
  "price-rise": "Price rise above the cap",
  amendment: "Amendment",
  service: "Missed service level",
  "no-contract": "Paid with no contract",
};

export function itemTitle(item: Item): string {
  return TITLES[item.detail.kind];
}
