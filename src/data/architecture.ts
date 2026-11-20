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
  { what: "Escalation", when: "No action by the 30 day alert, and again at 7 days", goesTo: "The procurement lead, who sees it as urgent from 21 days out", says: "The same item, marked untouched" },
];

/* ------------------------------------------------------------------
 * The full architecture on /solution: the sections after the intake diagram.
 * Plain words, no long dashes. Numbers marked as estimates or illustrative are not measured.
 * ------------------------------------------------------------------ */

/** The sticky anchor nav on /solution, in page order. */
export const solutionSections = [
  { id: "overview", label: "Overview" },
  { id: "after-intake", label: "After intake" },
  { id: "agents", label: "Agents and where not" },
  { id: "backend", label: "Backend" },
  { id: "data-controls", label: "Data controls" },
  { id: "access-controls", label: "Access controls" },
  { id: "evals", label: "Evals" },
] as const;

export type DoerKind = "code" | "rules" | "model" | "agent";

/** Who does each of the eight steps. Some steps use two kinds, in the order they run. */
export const stepDoers: Record<number, DoerKind[]> = {
  1: ["code"],
  2: ["rules"],
  3: ["model", "agent"],
  4: ["rules", "model"],
  5: ["model", "agent"],
  6: ["code"],
  7: ["rules"],
  8: ["agent"],
};

/* After intake, Sirion: the pitch, not built */

export const afterIntake = {
  title: "After intake, Sirion",
  badge: "Where Sirion picks up",
  pitch: "This is the pitch. The import into Sirion is not built.",
  handoffTitle: "Handoff pack",
  handoff: ["The confirmed ledger", "The contracts as managed copies", "The version history", "The owners"],
  handoffRule: "A contract goes once its owner has confirmed every fact and pressed Send to Sirion. One that is half checked stays in Sonar.",
  capabilities: [
    { name: "AskSirion", line: "Ask the confirmed ledger in plain language." },
    { name: "Redlining", line: "Clause edits in Word, tracked against the contract." },
    { name: "Approvals and workflow", line: "Routes renewals and changes to the right approver." },
    { name: "Supplier portal", line: "Suppliers send notices and invoices straight in." },
    { name: "E-signature", line: "Signing without leaving the platform." },
    { name: "Obligations and SLAs", line: "Tracks service levels and terms at scale." },
  ],
  askTitle: "AskSirion, on this ledger",
  askNote: "Illustrative, answered from the confirmed ledger.",
  questions: [
    { id: "april", text: "Which contracts renew in April?" },
    { id: "above-rate", text: "Which suppliers were paid above the agreed rate this year?" },
    { id: "no-owner", text: "Which suppliers have no owner?" },
  ],
  closing: "Sonar keeps pushing. Sirion takes the lifecycle once a company is ready for a full platform.",
  soWhat: "Everything Sonar collects is the clean data a full platform needs on day one.",
};

/* Agents and where not */

export const decisionLadder = [
  { tool: "Code", when: "when the answer is a rule." },
  { tool: "A small model", when: "when it is a judgment over short text." },
  { tool: "An LLM", when: "when it must read and quote a long document." },
  { tool: "An agent", when: "only when the path is not known in advance and it has to try things." },
];

export const redLine = "Dates, amounts and anything that sends or pays are never left to a model or an agent.";

export interface StepReason {
  number: number;
  name: string;
  doneBy: string;
  whyNotHeavier: string;
  failure: string;
  guardrail: string;
  /** Rough share of the step's work done by code or rules, 0 to 100. An estimate. */
  deterministic: number;
}

export const stepReasons: StepReason[] = [
  { number: 1, name: "Connect", doneBy: "Code", whyNotHeavier: "A standard read-only sign-in. Nothing to decide.", failure: "A token expires.", guardrail: "Refresh it, and alert IT if that fails.", deterministic: 100 },
  { number: 2, name: "Vendor list", doneBy: "Rules and name matching", whyNotHeavier: "Merging spellings is string matching.", failure: "Two suppliers merged by mistake.", guardrail: "Unsure pairs go to a person.", deterministic: 95 },
  { number: 3, name: "Find", doneBy: "Search and a small embedding model, then the Finder agent only when search finds nothing clear", whyNotHeavier: "Most files are found by search. The agent is the fallback.", failure: "The wrong contract is linked.", guardrail: "The agent may only search by vendor names and domains, and every link is shown with its reason.", deterministic: 60 },
  { number: 4, name: "Sort files", doneBy: "Rules first, then a small model for what rules cannot place", whyNotHeavier: "File names and first pages settle most files.", failure: "An invoice is read as a contract.", guardrail: "A type is only accepted above a confidence level. Otherwise the file is skipped and logged.", deterministic: 75 },
  { number: 5, name: "Read", doneBy: "OCR, then the Reader and checker in two passes, and the Reconciler for amendments", whyNotHeavier: "Reading and quoting a long contract needs a language model.", failure: "A made up term.", guardrail: "Every field must carry a quoted sentence that exists in the text, or it is dropped.", deterministic: 30 },
  { number: 6, name: "Record", doneBy: "Code", whyNotHeavier: "Writes the fact, its source and its label.", failure: "None beyond bad input.", guardrail: "Schema checks.", deterministic: 100 },
  { number: 7, name: "Watch", doneBy: "Rules, run nightly", whyNotHeavier: "The same facts always give the same items.", failure: "No AI here, on purpose.", guardrail: "Rules have tests, like the rest of the code.", deterministic: 100 },
  { number: 8, name: "Tell and draft", doneBy: "The Email agent and the Drafter", whyNotHeavier: "Explaining a difference and writing a reply is language work.", failure: "A wrong explanation.", guardrail: "The Drafter only sees the item's facts, and the owner reads and sends.", deterministic: 40 },
];

export const agentsSoWhat = "AI does the reading and the writing. Everything that decides, counts or sends stays in code and with people.";

/* Backend */

export const backend = {
  title: "How it runs",
  boxLabel: "One isolated environment per customer",
  flow: [
    { id: "connectors", name: "Connectors", items: ["Payables", "Drive", "Mail"] },
    { id: "queue", name: "Queue", items: ["One job per vendor"] },
    { id: "orchestrator", name: "Orchestrator", items: ["A workflow engine, code"] },
    { id: "workers", name: "Workers and Model gateway", items: ["Workers run the code steps", "The gateway is the only way to a model"] },
    { id: "models", name: "Models", items: ["OCR", "Embeddings", "Language model, through a private endpoint"] },
    { id: "stores", name: "Stores", items: ["Relational database with a similarity index", "Encrypted object storage", "Token vault with its own key"] },
    { id: "api", name: "API", items: ["Web app", "Email service"] },
  ],
  crossCutting: ["Identity and roles", "Observability: a trace for every step and its cost", "Evals", "Audit log"],
  states: ["discovered", "found", "sorted", "read", "checked", "reconciled", "recorded", "watching"],
  explainers: [
    {
      title: "The orchestrator is code, not an AI",
      lines: [
        "The sequence is fixed, so a workflow engine runs one workflow per vendor through these states.",
        "Every step can be retried safely, has a timeout, and goes to a review queue if it fails twice.",
        "Agents run only inside a step, with a limit on tool calls and tokens.",
        "People approve at fixed gates: confirm a fact, accept an amendment, send a message.",
        "A kill switch stops a customer's workflows.",
      ],
    },
    {
      title: "The model gateway is the only way to a model",
      lines: [
        "It masks names and runs a leak check before anything is sent.",
        "It uses versioned prompts and requires structured output, checked against a schema.",
        "It logs masked inputs and outputs, caps cost, and routes to the small model or the large one.",
      ],
    },
    {
      title: "Scale",
      lines: [
        "The nightly watch is cheap, because it is rules over a database.",
        "The costly part is reading. It happens once per document, and again only when the document changes.",
      ],
    },
  ],
  soWhat: "A fixed workflow in code runs the show. Models are called through one gate, so every call is masked, logged and capped.",
};

/* Data controls */

export const dataControls = [
  { control: "Classification", what: "Contract text is confidential. Bank lines are restricted, and bank account numbers are dropped on arrival, keeping the last four only.", why: "Each kind of data gets the handling it needs." },
  { control: "Masking", what: "Names, people, contacts and bank details are replaced before any model, with a leak check.", why: "A model never sees who the parties are." },
  { control: "Token vault", what: "A separate store with a separate key, which never leaves our cloud.", why: "The real names can only be put back inside our cloud." },
  { control: "Encryption", what: "In transit and at rest, with a key per customer.", why: "Data is unreadable without the customer's key." },
  { control: "Isolation", what: "Each customer has its own database, storage and key.", why: "One customer's data never sits beside another's." },
  { control: "Originals", what: "Stay in the customer's drive. We keep links and the extracted text.", why: "The file of record never moves or changes." },
  { control: "Retention", what: "Extracted text is kept 12 months by default, set by the customer, then deleted.", why: "We keep only what the list needs." },
  { control: "Training", what: "No customer data is used to train any model. This is written into the agreement.", why: "A customer's contracts help only that customer." },
  { control: "Residency", what: "The environment runs in the customer's region.", why: "Data stays where the customer's rules say it must." },
  { control: "Deletion", what: "Deleting a customer deletes the database, the storage and the key, which makes the data unrecoverable.", why: "Leaving is clean and final." },
] as const;

export const dataControlsSoWhat = "Every document is classified on arrival, masked before any model, and gone for good when the customer leaves.";

/* Access controls */

export const roleAccess = [
  { role: "Contract owner", sees: "Items and contracts for the suppliers they own", canDo: "Confirm or correct facts, decide renewals, accept amendments, send replies", doesNotSee: "Other owners' suppliers" },
  { role: "Procurement lead", sees: "Every supplier and every item, including items nobody owns", canDo: "Everything an owner can, for any supplier", doesNotSee: "Nothing is hidden from this role" },
  { role: "Finance lead", sees: "Invoice checks, prices and the payments list for every supplier", canDo: "Flag invoices and price rises, confirm amounts", doesNotSee: "Renewal and service items for suppliers they do not own" },
  { role: "IT admin", sees: "The connections and the access log", canDo: "Approve or narrow access, revoke a source", doesNotSee: "Contract contents" },
];

export const sourceAccess = [
  { source: "Payables", scope: "Read-only export of the vendor list, payment dates and amounts" },
  { source: "Drive", scope: "Read-only, on folders the company chooses or on all of them" },
  { source: "Mail", scope: "Read-only, on the shared inboxes, or a search limited to the supplier domains" },
  { source: "Pilot", scope: "IT can limit everything to the top suppliers by spend to start" },
];

export const stepPermissions = [
  { who: "Finder agent", can: "Search the drive and mail by vendor names and email domains", cannot: "Open files unrelated to those names and domains" },
  { who: "Sort files model", can: "Read the first page of a candidate file", cannot: "Keep anything from a file that is not a contract, amendment or invoice" },
  { who: "Reader and checker", can: "Read the masked text of one contract", cannot: "See real names, other contracts or any source" },
  { who: "Reconciler", can: "Read the facts for one vendor", cannot: "Decide which version wins. A person does" },
  { who: "Email agent", can: "Read supplier mail and search the ledger, read-only", cannot: "Reply or send anything" },
  { who: "Drafter", can: "Read the item's facts", cannot: "Reach any source, or send" },
  { who: "Every step and agent", can: "Do its one job, logged", cannot: "Send, pay, sign or change a file" },
];

export const accessRules = [
  "Sign in through the company's single sign-on, with multi-factor.",
  "Every file or message opened is written to the access log, which IT can read.",
  "Any outgoing message needs the owner's click.",
  "Access is reviewed every quarter, and the review is shown to IT.",
  "Revoking a source is one click, and the screen shows what stops working.",
];

export const accessSoWhat = "Each person sees only their own calls, each agent touches only its one input, and IT can see and stop all of it.";

/* Evals */

export const evalsIntro =
  "Each AI part is scored against a labelled set before it ships: the sample contracts, payments and emails, with the right answers written down.";

export const evals = [
  { name: "Field accuracy", measures: "End date, term, notice days, price and service levels against the labelled contracts", scored: "Share of fields exactly right", bar: "95% on dates", target: 95 },
  { name: "Quote match", measures: "How often the quoted sentence exists in the text", scored: "Share of quotes found word for word", bar: "100%", target: 100 },
  { name: "Checker catch rate", measures: "Errors seeded on purpose that the second pass catches", scored: "Share of seeded errors caught", bar: "90%", target: 90 },
  { name: "Supplier classifier", measures: "Precision and recall on the labelled payments", scored: "Recall first, because missing a supplier is worse than one extra", bar: "95% recall", target: 95 },
  { name: "Finder recall", measures: "Contracts that exist that it finds", scored: "Share of known contracts found", bar: "85%", target: 85 },
  { name: "Alert quality", measures: "Alerts the owner opens and acts on", scored: "Share acted on", bar: "60%", target: 60 },
  { name: "Draft quality", measures: "How much the owner edits a draft before sending", scored: "Share of words changed", bar: "Falling over time", target: null },
];

export const evalRule =
  "No model, prompt or rule change ships unless it scores at least as well as the last release on the labelled set, and no field drops by more than two points.";

export const evalLoop = "Owner corrections made in the product become new labelled examples, with the customer's consent.";

/** Sample scores for three releases, 0 to 100. Illustrative, not measured. */
export const releaseScores = {
  releases: ["Release 1", "Release 2", "Release 3"],
  rows: [
    { name: "Field accuracy", scores: [89, 93, 96] },
    { name: "Quote match", scores: [97, 99, 100] },
    { name: "Checker catch rate", scores: [81, 87, 91] },
    { name: "Supplier classifier", scores: [92, 95, 97] },
    { name: "Finder recall", scores: [74, 80, 86] },
    { name: "Alert quality", scores: [48, 55, 62] },
  ],
};

export const evalsSoWhat = "Nothing gets worse quietly: every change is scored on the same labelled set before it ships.";

export const overviewSoWhat = "Events in the company become one list, and every item on it ends with one person's decision.";
