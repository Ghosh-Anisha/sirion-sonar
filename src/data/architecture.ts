import type { AgentName, TableName } from "./thinking";

/*
 * The How it works page, from "Solution architecture" in docs/spec.md:
 * the eight steps, the five agents, where AI is used, where data lives, and how it pushes.
 */

export interface PipelineStep {
  number: number;
  name: string;
  job: string;
  doneBy: string;
  /** Why it is done that way, from "Where AI is used and where it is not". */
  why: string;
  usesAi: boolean;
  input: string;
  output: string;
  reads: TableName[];
  writes: TableName[];
  access: string;
  never: string;
}

export const pipelineSteps: PipelineStep[] = [
  {
    number: 1,
    name: "Connect",
    job: "Signs in once, read-only, to the payables system, the drive and the shared inboxes, after IT approves.",
    doneBy: "Code",
    why: "A standard read-only sign-in.",
    usesAi: false,
    input: "The IT admin's approval and the scopes picked.",
    output: "Three read-only connections.",
    reads: [],
    writes: ["access_log"],
    access: "Read-only on the payables export, the chosen folders, and the shared inboxes or supplier domains.",
    never: "Hold bank credentials, move money, or write to any source.",
  },
  {
    number: 2,
    name: "Vendor list",
    job: "Sorts payment lines into supplier, not a supplier and not sure, and merges spellings of one name.",
    doneBy: "Code and name matching",
    why: 'Merging "ACME PVT LTD" and "Acme Private Limited" is string matching. The unsure ones go to a person.',
    usesAi: false,
    input: "The payments export.",
    output: "The vendor list, with merged spellings and payment rhythm.",
    reads: ["payments"],
    writes: ["vendors", "payments"],
    access: "The payables export only.",
    never: "Settle an unsure name on its own. A person does.",
  },
  {
    number: 3,
    name: "Find",
    job: "Looks for each supplier's files across the drive and mail, highest spend first.",
    doneBy: "Search, a small open model that ranks files, and the Finder agent",
    why: "Ranking candidate files is search work. The agent runs when search finds nothing clear.",
    usesAi: true,
    input: "Each vendor's names, spellings and email domains.",
    output: "Candidate files for each vendor, or a note that nothing was found.",
    reads: ["vendors"],
    writes: ["documents", "access_log"],
    access: "Read-only search of the drive and mail.",
    never: "Open anything unrelated to the vendor's names and domains.",
  },
  {
    number: 4,
    name: "Sort files",
    job: "Tells contracts, amendments and invoices apart from everything else.",
    doneBy: "Rules first, then a small model for files the rules cannot place",
    why: "File names and first-page words settle most files. Scans, odd names and mixed documents need a model to read the page.",
    usesAi: true,
    input: "File names and the first page of each candidate file.",
    output: "Each file's type, and which vendor it belongs to.",
    reads: ["documents"],
    writes: ["documents"],
    access: "The first page of each candidate file.",
    never: "Keep anything from files that are not contracts, amendments or invoices.",
  },
  {
    number: 5,
    name: "Read",
    job: "Reads the terms of each contract, with the exact sentence for each, and checks them in a second pass.",
    doneBy: "OCR, then the Reader and checker, then the Reconciler",
    why: "Terms come back with the exact sentence quoted and a second pass checks them. Dates and notice deadlines are computed in code.",
    usesAi: true,
    input: "The masked text of one contract at a time.",
    output: "Terms with their sentences, checked, and the current terms across amendments.",
    reads: ["documents", "token_vault"],
    writes: ["token_vault"],
    access: "Full text of contracts, amendments and invoices only.",
    never: "Work out a date, see a real name, or decide which version wins.",
  },
  {
    number: 6,
    name: "Record",
    job: "Writes each fact with its sentence, page and label, and builds the current view per contract.",
    doneBy: "Code",
    why: "Writing the fact, its source sentence and its label is bookkeeping.",
    usesAi: false,
    input: "The checked terms.",
    output: "Facts, the current contract view, and a saved version.",
    reads: ["facts"],
    writes: ["facts", "contracts", "contract_versions"],
    access: "The ledger only.",
    never: "Mark a fact Confirmed without a person.",
  },
  {
    number: 7,
    name: "Watch",
    job: "Checks the ledger every night for time, arrival, absence and change.",
    doneBy: "Code",
    why: "With no AI here, the same facts always give the same items.",
    usesAi: false,
    input: "The ledger, the payments, matched emails and today's date.",
    output: "Items on the Needs you list, with owner and due date.",
    reads: ["contracts", "facts", "payments", "vendors"],
    writes: ["items"],
    access: "The ledger only.",
    never: "Use a model.",
  },
  {
    number: 8,
    name: "Tell and draft",
    job: "Tells each owner what needs them, explains what changed and drafts the reply.",
    doneBy: "The Email agent and the Drafter",
    why: "They explain what changed and write the reply. The owner reads and sends.",
    usesAi: true,
    input: "The items, their facts, and incoming supplier email.",
    output: "The list, the weekly email, alerts and drafts waiting for the owner.",
    reads: ["items", "facts"],
    writes: ["items"],
    access: "Sends only from the product's own address, on the owner's click.",
    never: "Send anything on its own, or from a person's own mailbox.",
  },
];

export interface AgentInfo {
  name: AgentName;
  step: number;
  job: string;
  tools: string;
  cannot: string;
}

export const agents: AgentInfo[] = [
  {
    name: "Finder",
    step: 3,
    job: "Looks for one vendor's contract when a plain search finds nothing clear. Tries other spellings, the email domain, invoice numbers and parent company names.",
    tools: "Read-only search of the drive and mail.",
    cannot: "Open anything unrelated to the vendor's names and domains. Change or send anything.",
  },
  {
    name: "Reader and checker",
    step: 5,
    job: "Two passes. The first reads the terms. The second checks each field against its quoted sentence and flags any that do not match.",
    tools: "The masked text of one contract.",
    cannot: "Compute dates. Those come from code.",
  },
  {
    name: "Reconciler",
    step: 5,
    job: "Works out the current terms when a contract has amendments or several versions, and flags clashes.",
    tools: "The facts for one vendor.",
    cannot: "Decide which version wins when they clash. A person does.",
  },
  {
    name: "Email agent",
    step: 8,
    job: "Reads an incoming email, recognises the supplier, looks up the contract, rates, payments and earlier mail, and explains the difference.",
    tools: "Read-only search of the ledger and the vendor's mail.",
    cannot: "Reply on its own.",
  },
  {
    name: "Drafter",
    step: 8,
    job: "Writes the reply, query or notice from the facts on the item.",
    tools: "The item and its facts.",
    cannot: "Send. The owner reads and sends.",
  },
];

export const agentsWhy =
  "A single pass over a long contract or a full inbox makes mistakes, and nobody can see why. Each agent has one job, a few read-only tools and a log. The checker is the main safeguard: a field with no matching sentence never reaches the ledger as Confirmed.";

export interface Place {
  name: string;
  holds: string;
}

/** Where data lives. Originals never leave the customer's own systems. */
export const dataPlaces = {
  customer: {
    name: "The customer's own systems",
    note: "Drive, mail and payables. Originals stay here, and Sonar keeps a link back, not a copy.",
  },
  account: { name: "Our cloud account", note: "One isolated environment per customer, with its own database, storage and encryption key." },
  environment: [
    { name: "Per-customer database", holds: "vendors, payments, documents, facts, contracts, contract_versions, items and access_log. A similarity index for search." },
    { name: "Encrypted storage", holds: "The text pulled out of each contract, so facts can point to their sentences." },
    { name: "Encryption key", holds: "One per customer. Deleting a customer deletes the database, the storage and the key." },
  ] as Place[],
  vault: { name: "Token vault", holds: "Masked name to real name. A separate store with a separate key, which never leaves our cloud." },
  servers: { name: "On our servers", holds: "OCR for scans, a small ranking model, and masking with a dictionary and an open-source name recogniser." },
  model: {
    name: "Private model endpoint",
    holds: "Inside our own cloud account, under a no-retention and no-training agreement. It only ever gets masked snippets of contract text.",
  },
};

export interface PushRow {
  what: string;
  when: string;
  goesTo: string;
  says: string;
}

export const pushDesign: PushRow[] = [
  { what: "The Needs you list", when: "Always current", goesTo: "Each owner. The procurement lead sees all of it", says: "Items sorted by what is due first" },
  { what: "Weekly email", when: "Once a week", goesTo: "Each owner, with their own items", says: "Each item with its reason and one link to act on it" },
  { what: "Deadline alerts", when: "90, 30 and 7 days before a notice deadline", goesTo: "The owner", says: "The renewal, the date to decide by, and what the contract allows" },
  { what: "New arrivals", when: "When a supplier email, notice or invoice is matched", goesTo: "The owner", says: "The item it creates, with the difference from the contract" },
  { what: "Escalation", when: "No action by the 30 day alert, and again at 7 days", goesTo: "The procurement lead, who sees it as urgent at 7 days", says: "The same item, marked untouched" },
];
