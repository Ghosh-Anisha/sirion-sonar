/** The three read-only connections Sonar asks for, per "What it connects to and what it can see" in docs/spec.md. Mock only. */

export interface Connection {
  id: "payables" | "drive" | "mail";
  name: string;
  system: string;
  access: string;
  reads: string;
  never: string;
}

export const connections: Connection[] = [
  {
    id: "payables",
    name: "Payables",
    system: "Zoho Books export",
    access: "Read-only export",
    reads: "The vendor list, payment dates and amounts.",
    never: "Hold bank credentials or move money.",
  },
  {
    id: "drive",
    name: "Drive",
    system: "Google Drive, the Contracts, Ops, Admin, Finance, Legal and Marketing folders",
    access: "Read-only, on the folders the company picked",
    reads: "The first page of each file, to tell what it is. Full text only for contracts, amendments and invoices.",
    never: "Keep anything from other files. Write, move or delete any file.",
  },
  {
    id: "mail",
    name: "Mail",
    system: "Shared inboxes ap@ and procurement@",
    access: "Read-only, on shared inboxes",
    reads: "Messages to and from the supplier domains on the vendor list.",
    never: "Read messages outside those domains. Send from anyone's own mailbox.",
  },
];

/** Who approved the connections in the demo story. */
export const APPROVED_BY = "vikram";
