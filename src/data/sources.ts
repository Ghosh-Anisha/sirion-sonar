/*
 * The three read-only sources Sonar asks for, per "What it connects to and what it can see" in docs/spec.md,
 * and the roles a viewer can pick in onboarding. Mock only: nothing here connects to anything.
 */

export type SourceId = "payables" | "drive" | "mail";

export interface Source {
  id: SourceId;
  name: string;
  purpose: string;
  products: string[];
  /** What Sonar will read once allowed. */
  reads: string[];
  /** Folders the company can pick from, for sources that have them. */
  folders?: string[];
  /** What stops working if access is revoked. */
  stops: string[];
}

/** What Sonar never does, on any source. */
export const NEVER = ["Hold bank credentials.", "Move money.", "Change or delete files.", "Send anything on its own."];

export const sources: Source[] = [
  {
    id: "payables",
    name: "Payables",
    purpose: "Who the company pays, when and how much.",
    products: ["Zoho Books", "Tally", "QuickBooks", "SAP"],
    reads: ["The vendor list.", "Payment dates and amounts.", "The payee name as written on each line."],
    stops: [
      "New payments stop coming in, so a supplier paid with no contract is no longer found.",
      "Amounts paid to each supplier stop updating.",
    ],
  },
  {
    id: "drive",
    name: "Drive",
    purpose: "Where the contracts, amendments and invoices are saved.",
    products: ["Google Drive", "OneDrive", "SharePoint", "Zoho WorkDrive"],
    reads: ["The first page of each file, to tell what it is.", "The full text of contracts, amendments and invoices, and nothing else."],
    folders: ["Contracts", "Ops", "Admin", "Finance", "Legal", "Marketing", "HR"],
    stops: [
      "New contracts and amendments saved to the drive are not found.",
      "Facts already on the ledger stay, but nobody checks them against newer files.",
    ],
  },
  {
    id: "mail",
    name: "Mail",
    purpose: "Where suppliers send invoices, notices and amendments.",
    products: ["Gmail", "Outlook", "Zoho Mail"],
    reads: ["Messages to and from the supplier domains on the vendor list.", "Invoices and notices attached to those messages."],
    stops: [
      "Supplier emails stop arriving, so invoices are no longer checked against the agreed rate.",
      "Price rises and amendments sent by mail are not picked up.",
    ],
  },
];

/** The shared inboxes Sonar reads when mail is limited to them. */
export const SHARED_INBOXES = ["ap@", "procurement@"];

/** How many suppliers, by spend, a pilot starts with. */
export const PILOT_SIZE = 10;

export type RoleId = "procurement-lead" | "finance-lead" | "it-admin";

export interface Role {
  id: RoleId;
  title: string;
  personId: string;
  line: string;
}

export const roles: Role[] = [
  { id: "procurement-lead", title: "Procurement lead", personId: "kavya", line: "Sees every item, and gets the ones nobody owns." },
  { id: "finance-lead", title: "Finance lead", personId: "arjun", line: "Sees invoice checks, price rises and payments for every supplier." },
  { id: "it-admin", title: "IT admin", personId: "vikram", line: "Approves access and reads the access log. Sees no contract contents." },
];

export const IT_ADMIN_ID = "vikram";

/**
 * Owners the wizard suggests for suppliers the payables data gives no owner, from the team that approved
 * their bills. Copperleaf and Banyan are left without one on purpose, so the demo shows where those items go.
 */
export const suggestedOwners: Record<string, string> = { riverstone: "rohan", zephyr: "farah" };
