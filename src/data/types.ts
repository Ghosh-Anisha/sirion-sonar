/** Shapes of the sample data. Facts hold what a document says; dates and amounts derived from them are computed in src/logic. */

export type Role = "procurement-lead" | "finance-lead" | "contract-owner" | "it-admin";

export interface Person {
  id: string;
  name: string;
  role: Role;
  title: string;
  email: string;
}

/** How much of a supplier's contract was found: all of it, part of it, or nothing. */
export type ContractStatus = "full" | "partial" | "none";

export interface Vendor {
  id: string;
  name: string;
  /** Other spellings seen in payments and mail, for name matching. */
  aliases: string[];
  emailDomains: string[];
  category: string;
  ownerId: string | null;
  contractStatus: ContractStatus;
}

/** How far to trust a fact. See "How the record knows its dates" in docs/spec.md. */
export type Label = "confirmed" | "derived" | "bounded" | "unknown";

export type FactField =
  | "startDate"
  | "endDate"
  | "termMonths"
  | "renewalTermMonths"
  | "noticeDays"
  | "annualFee"
  | "monthlyFee"
  | "unitRate"
  | "priceCapPercent"
  | "slaOnTimePercent"
  | "slaCreditPercent";

/** ISO date string for date fields, a number for the rest, null when the document does not give it. */
export type FactValue = string | number | null;

export interface Fact {
  field: FactField;
  value: FactValue;
  /** The exact sentence the value comes from. Always a substring of the clause text. */
  sentence: string;
  clauseId: string;
  page: number;
  label: Label;
  /** Person id of whoever checked it against the contract, or null if nobody has. */
  confirmedBy: string | null;
  /** For rates, what one unit is, such as "per trip". */
  unit?: string;
}

export interface Clause {
  id: string;
  heading: string;
  page: number;
  text: string;
}

export type DocumentType = "agreement" | "master-agreement" | "scan";

export interface Contract {
  id: string;
  vendorId: string;
  title: string;
  documentType: DocumentType;
  /** Where the file lives in the customer's drive. A link, not a copy. */
  fileName: string;
  clauses: Clause[];
  facts: Fact[];
  /** What is missing or unreadable, for partial contracts. */
  gap: string | null;
}

/** A change to a contract. Each clause replaces the clause with the same id. */
export interface Amendment {
  contractId: string;
  title: string;
  signedOn: string;
  clauses: Clause[];
  facts: Fact[];
}

/** One line from the payables export, exactly as it appears there. */
export interface Payment {
  id: string;
  date: string;
  payee: string;
  amount: number;
  reference: string;
}

export interface InvoiceLine {
  description: string;
  quantity: number;
  unitRate: number;
}

export interface Invoice {
  number: string;
  date: string;
  lines: InvoiceLine[];
}

export interface DeliveryReport {
  month: string;
  trips: number;
  onTime: number;
}

export interface PriceChange {
  currentMonthlyFee: number;
  newMonthlyFee: number;
  effectiveFrom: string;
}

export interface Email {
  id: string;
  receivedOn: string;
  from: { name: string; address: string };
  to: string;
  subject: string;
  body: string;
  attachments: string[];
  /** What the email agent read out of the message. Amounts are totalled in code. */
  invoice?: Invoice;
  deliveries?: DeliveryReport;
  priceChange?: PriceChange;
  amendment?: Amendment;
}
