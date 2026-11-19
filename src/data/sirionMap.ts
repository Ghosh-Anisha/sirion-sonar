/*
 * Where Sirion's platform picks up after intake, from "Where Sirion fits" in docs/spec.md.
 * Taken from Sirion's published product material. The prototype does not rebuild any of it.
 */

export interface SirionLayer {
  name: string;
  from: string;
  does: string;
}

export const sirionLayers: SirionLayer[] = [
  {
    name: "Redlining and clause edits",
    from: "Sirion's Word add-in and contract creation",
    does: "Tracked edits and negotiation once a contract is being changed.",
  },
  {
    name: "Approvals and workflow",
    from: "Sirion's workflow",
    does: "Routes renewals and changes to the right approver.",
  },
  {
    name: "Supplier portal",
    from: "Sirion's counterparty portal",
    does: "Suppliers send notices and invoices straight onto the list.",
  },
  {
    name: "E-signature",
    from: "Sirion's DocuSign and Adobe Sign integrations",
    does: "Signing without leaving the product.",
  },
  {
    name: "Obligations and SLAs",
    from: "Sirion's contract management",
    does: "Tracks service levels and invoice terms across thousands of contracts.",
  },
  {
    name: "AskSirion",
    from: "Sirion's assistant",
    does: "Answers questions such as which contracts renew in March, from the confirmed ledger.",
  },
];
