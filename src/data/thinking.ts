/*
 * What sits under each part of the screen, for the Show the thinking toggle.
 * Keyed by screen, then part. Follows "Solution architecture" in docs/spec.md:
 * the eight pipeline steps, the five agents and the stored tables.
 */

export type TableName =
  | "vendors"
  | "payments"
  | "documents"
  | "facts"
  | "contracts"
  | "contract_versions"
  | "items"
  | "access_log"
  | "token_vault";

export type AgentName = "Finder" | "Reader and checker" | "Reconciler" | "Email agent" | "Drafter";

export type Doer = { kind: "code" } | { kind: "rules" } | { kind: "small-model"; what: string } | { kind: "agent"; agent: AgentName };

export interface ThinkingNote {
  title: string;
  /** Pipeline steps, 1 to 8, that this part belongs to. */
  steps: number[];
  doers: Doer[];
  why: string;
  input: string;
  output: string;
  reads: TableName[];
  writes: TableName[];
  /** What a model sees, or null when no model takes part. */
  modelSees: string | null;
  neverSees: string;
  /** The confidence label involved and how it was set, or null when no label applies. */
  label: { which: string; how: string } | null;
}

const NO_MODEL = "No model takes part here, so nothing goes to one.";
const DEADLINE_LABEL = {
  which: "The deadline's label: Confirmed, Derived, Bounded or Unknown.",
  how: "It is the weakest label among the facts the deadline is worked out from. It stays Derived until the owner confirms each of those facts.",
};

const code: Doer = { kind: "code" };
const rules: Doer = { kind: "rules" };
const agent = (name: AgentName): Doer => ({ kind: "agent", agent: name });

export const thinking = {
  home: {
    decide: {
      title: "A renewal coming up",
      steps: [7],
      doers: [code],
      why: "It is a date rule. With no model here, the same facts always give the same items.",
      input: "The contract's end date, renewal term and notice days, and today's date from the clock.",
      output: "A Decide item due on the notice deadline, sent to the owner. If nobody acts by the 30 day alert it also goes to the procurement lead.",
      reads: ["contracts", "facts", "vendors"],
      writes: ["items"],
      modelSees: null,
      neverSees: NO_MODEL,
      label: DEADLINE_LABEL,
    },
    check: {
      title: "An invoice or price that does not match the contract",
      steps: [7, 8],
      doers: [agent("Email agent"), code],
      why: "The agent reads the email and pulls out the invoice lines. Code compares them with the agreed rate, so the difference is arithmetic, not a guess.",
      input: "The supplier's email and invoice, the agreed rate or price cap on the contract, and past payments.",
      output: "A Check item with the amount above the agreed rate, or the rise above the cap, and the clause it comes from.",
      reads: ["vendors", "contracts", "facts", "payments"],
      writes: ["items", "access_log"],
      modelSees: "The email and invoice text with names, people, contacts and bank details swapped for tokens.",
      neverSees: "Real names, contact or bank details. It is never asked for the agreed rate or the difference: code works those out.",
      label: { which: "The label on the rate or cap fact.", how: "Set when the contract was read, and changed to Confirmed when an owner checked it." },
    },
    fix: {
      title: "A service level missed",
      steps: [7, 8],
      doers: [agent("Email agent"), code],
      why: "The agent finds the delivery report in the email. Code counts the on-time share and the service credit from the contract.",
      input: "The monthly delivery report, the service level and the credit in the contract.",
      output: "A Fix item with the on-time share, the target and the credit the company can claim.",
      reads: ["contracts", "facts"],
      writes: ["items", "access_log"],
      modelSees: "The masked email and report.",
      neverSees: "Real names and contact details. The percentages and the credit come from code.",
      label: { which: "The label on the service level fact.", how: "Set when the contract was read. An owner can confirm it on the contract page." },
    },
    find: {
      title: "A supplier paid with no contract",
      steps: [2, 3],
      doers: [rules, agent("Finder"), code],
      why: "Rules decide which payment lines are suppliers. The Finder only runs when a plain search finds nothing clear. Code opens the item.",
      input: "The payments export, the vendor list, and the search results for the supplier's names and email domain.",
      output: "A Find item with how much was paid and when, for the owner to find the contract or decide there should be one.",
      reads: ["payments", "vendors", "documents"],
      writes: ["items", "access_log"],
      modelSees: "File titles and first-page snippets from the search, with the supplier's name as a token.",
      neverSees: "Anything unrelated to the supplier's names and domains. It cannot open, change or send anything.",
      label: { which: "No date label: there is no contract to take a date from.", how: "The item says what is missing instead." },
    },
    coverage: {
      title: "How many suppliers have a contract",
      steps: [3],
      doers: [code],
      why: "It is a count over the vendor list and the files found for each.",
      input: "The suppliers paid, and the contract files found for each one.",
      output: "Found, partial and not found counts, and the share of spend covered.",
      reads: ["vendors", "payments", "documents"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
  },
  item: {
    routing: {
      title: "Who this item is with, and when",
      steps: [7, 8],
      doers: [code],
      why: "Alerts and escalation follow fixed rules: 90, 30 and 7 days before a deadline, and no owner means the procurement lead.",
      input: "The item's due date, its owner, whether anyone has acted, and today's date.",
      output: "Who gets it, whether it is urgent, and whether it has gone up to the procurement lead.",
      reads: ["items", "vendors"],
      writes: ["items"],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
    evidence: {
      title: "Why this is here",
      steps: [5, 6],
      doers: [agent("Reader and checker"), code],
      why: "Each fact was read with the exact sentence it came from and checked against it. Code works out the dates from those facts.",
      input: "The facts behind the item, each with its sentence, clause and page.",
      output: "The sentences that support the item, and links to the clause in the contract.",
      reads: ["facts", "documents", "contracts"],
      writes: [],
      modelSees: "When it was read: the masked text of one contract.",
      neverSees: "Real party names, people, contacts and bank details. It never works out a date.",
      label: DEADLINE_LABEL,
    },
    draft: {
      title: "The draft reply",
      steps: [8],
      doers: [agent("Drafter")],
      why: "Writing a clear reply is language work. Sending is not: the owner reads it and clicks send.",
      input: "The item, its facts and the choice the owner made.",
      output: "A draft from the product's own address, waiting for the owner. Nothing goes out without that click.",
      reads: ["items", "facts", "vendors"],
      writes: ["items"],
      modelSees: "The item and its facts with names as tokens. Real names go back in from the token vault after.",
      neverSees: "Real names, contact or bank details. Dates and amounts are filled in by code, not by the model.",
      label: { which: "The label of the deadline the reply mentions.", how: "Shown so the owner knows how far to trust the date before sending." },
    },
  },
  contract: {
    dates: {
      title: "Dates worked out from the facts",
      steps: [6],
      doers: [code],
      why: "Dates are never left to a model. The end date rolls forward after each term, and the notice deadline is the end date minus the notice days.",
      input: "Start date, end date or term, renewal term and notice days, plus payment dates when the date is unreadable.",
      output: "The current end date, the last day to give notice, and whether it renews on its own.",
      reads: ["facts", "payments"],
      writes: ["contracts"],
      modelSees: null,
      neverSees: NO_MODEL,
      label: DEADLINE_LABEL,
    },
    facts: {
      title: "Facts read from the contract",
      steps: [5, 6],
      doers: [agent("Reader and checker"), code],
      why: "Two passes, not one. The first reads the terms. The second checks each one against its quoted sentence and flags any that do not match.",
      input: "The masked text of one contract.",
      output: "One fact per field: the value, the exact sentence, the clause and page, and a label.",
      reads: ["documents"],
      writes: ["facts", "contracts"],
      modelSees: "The masked text of this contract, with parties, people, contacts and bank details as tokens.",
      neverSees: "The real names, which stay in the token vault. It never works out a date: code does.",
      label: {
        which: "Each fact's label.",
        how: "Derived when read. Confirmed when an owner clicks Confirm or corrects it, with their name recorded. Bounded or Unknown when the part a term needs is unreadable or missing. A fact with no matching sentence never reaches the ledger as Confirmed.",
      },
    },
    text: {
      title: "The contract text",
      steps: [5],
      doers: [code],
      why: "Text is pulled out once, with an open-source OCR tool for scans, so each fact can point to its sentence.",
      input: "The file in the customer's drive.",
      output: "The text by clause, kept in encrypted storage, with the sentence behind the chosen fact highlighted.",
      reads: ["documents"],
      writes: ["documents"],
      modelSees: null,
      neverSees: "No model reads the file here. The original stays in the customer's drive and is never changed.",
      label: null,
    },
  },
  versions: {
    amendment: {
      title: "The amendment and what it changes",
      steps: [5, 6],
      doers: [agent("Reconciler"), code],
      why: "Working out the current terms across an amendment is open ended. Deciding which version wins is not the agent's job: the owner accepts or rejects.",
      input: "The facts from the original and from the amendment.",
      output: "The changed dates before and after, waiting for the owner. Accepting writes a new version and moves the dates.",
      reads: ["facts", "contract_versions"],
      writes: ["contract_versions", "facts", "items"],
      modelSees: "The masked clauses of both versions.",
      neverSees: "Real names. It cannot accept or reject anything.",
      label: { which: "The new dates' label.", how: "Taken from the signed amendment's facts. Accepting replaces earlier corrections to the same fields." },
    },
    redline: {
      title: "The tracked changes",
      steps: [6],
      doers: [code],
      why: "Comparing two texts word by word is plain code. It gives the same answer every time.",
      input: "The original clauses and the clauses after the amendment.",
      output: "Each clause with removed words struck through and added words underlined.",
      reads: ["contract_versions"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
  },
  email: {
    weekly: {
      title: "The weekly email",
      steps: [8],
      doers: [code],
      why: "It is a list of the owner's own items, built from the ledger. Nothing in it needs a model.",
      input: "The open items for this person, their reasons and due dates.",
      output: "One email a week from the product's own address, each item with its reason and one link.",
      reads: ["items", "vendors"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
    read: {
      title: "Read the email",
      steps: [7],
      doers: [agent("Email agent")],
      why: "Mail is free text. The agent reads it the way a mail assistant does inside an inbox.",
      input: "A message in a shared inbox from a supplier domain on the vendor list.",
      output: "What kind of email it is, and the attachments it carries.",
      reads: ["vendors"],
      writes: ["access_log"],
      modelSees: "The masked message and attachments.",
      neverSees: "Mail outside the supplier domains, or anyone's own mailbox.",
      label: null,
    },
    recognise: {
      title: "Recognise the supplier",
      steps: [2],
      doers: [code],
      why: "Matching a sender's domain to the vendor list is string matching.",
      input: "The sender's address and name.",
      output: "The supplier it belongs to, or a note that it is unknown.",
      reads: ["vendors"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
    "look-up": {
      title: "Look up the contract and payments",
      steps: [6],
      doers: [code],
      why: "It is a lookup in the ledger, so it stays as code.",
      input: "The supplier.",
      output: "Its contracts, current facts and payment history.",
      reads: ["contracts", "facts", "payments"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
    compare: {
      title: "Compare with the contract",
      steps: [7],
      doers: [code],
      why: "The difference is arithmetic: invoice lines against the agreed rate, a new price against the cap.",
      input: "The figures the email carries and the facts on the contract.",
      output: "The difference, in rupees or percent, and the clause it breaks.",
      reads: ["facts"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: { which: "The label of the contract fact compared against.", how: "From the facts table. A Derived rate is shown as Derived." },
    },
    explain: {
      title: "Explain the difference",
      steps: [8],
      doers: [agent("Email agent")],
      why: "Saying what changed in one plain sentence is language work. The numbers in it come from code.",
      input: "The comparison from the step before.",
      output: "One sentence for the item: what happened, what it costs, what to do.",
      reads: ["items"],
      writes: [],
      modelSees: "The comparison with names as tokens.",
      neverSees: "Real names. It cannot reply on its own.",
      label: null,
    },
    route: {
      title: "Route it",
      steps: [7],
      doers: [code],
      why: "Where an email goes is a rule: amendments go to the version history, invoices and notices to the list, the rest is filed.",
      input: "The kind of email and the comparison.",
      output: "An item for the owner, a new version waiting to be accepted, or a note on the contract.",
      reads: ["vendors", "items"],
      writes: ["items", "contract_versions"],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
  },
  welcome: {
    welcome: {
      title: "What Sonar does",
      steps: [1, 2, 3, 4, 5, 6, 7, 8],
      doers: [code, rules, agent("Finder"), agent("Reader and checker")],
      why: "Most of the work is code and rules. A model is used in four of the eight steps, where the work is reading.",
      input: "Who the company pays, the drive and the shared inboxes.",
      output: "A ledger of supplier contracts, and a list that tells the right person when one needs them.",
      reads: ["vendors", "payments", "documents"],
      writes: ["facts", "contracts", "items"],
      modelSees: "Masked snippets of contract text, never more.",
      neverSees: "Bank credentials, real names in any prompt, and anything outside the chosen folders and supplier domains.",
      label: null,
    },
    role: {
      title: "Who you are",
      steps: [8],
      doers: [code],
      why: "What each person sees is a rule on the items: owners see their own, the procurement lead sees all of it.",
      input: "The role picked.",
      output: "The view the rest of the demo uses.",
      reads: ["items", "vendors"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
    sources: {
      title: "Connecting the sources",
      steps: [1],
      doers: [code],
      why: "A standard read-only sign-in. There is nothing to decide, so no model.",
      input: "The product, the folders and the mail scope picked on the consent screen.",
      output: "A read-only connection, and a line in the access log.",
      reads: [],
      writes: ["access_log"],
      modelSees: null,
      neverSees: "No model takes part. Bank credentials are never asked for or held.",
      label: null,
    },
    approval: {
      title: "IT approval",
      steps: [1],
      doers: [code],
      why: "Access is a person's decision. Sonar writes the request from what was picked and logs the answer.",
      input: "The scopes asked for, and the IT admin's answer.",
      output: "Approved as asked, or a pilot limited to the top suppliers by spend.",
      reads: ["vendors"],
      writes: ["access_log"],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
    start: {
      title: "Where to start",
      steps: [3],
      doers: [code],
      why: "The read goes highest spend first, so a pilot covers most of the money with a few suppliers.",
      input: "Spend by supplier from the payments.",
      output: "The suppliers to read, and a rough time for a real read.",
      reads: ["payments", "vendors"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
    "first-read": {
      title: "The first read",
      steps: [1, 2, 3, 4, 5, 6, 7, 8],
      doers: [code, rules, { kind: "small-model", what: "a small model that ranks and sorts files" }, agent("Finder"), agent("Reader and checker"), agent("Reconciler")],
      why: "Steps that follow a fixed sequence stay as code. Agents run where the work is open ended: finding a file, reading terms.",
      input: "Payments, the drive and the shared inboxes, read-only.",
      output: "The vendor list, the facts for each contract, and the first items.",
      reads: ["payments", "documents"],
      writes: ["vendors", "documents", "facts", "contracts", "items", "access_log", "token_vault"],
      modelSees: "Masked contract text. The real names go to the token vault, a separate store with its own key.",
      neverSees: "Files outside the chosen folders, mail outside supplier domains, bank details.",
      label: { which: "Every fact's label.", how: "Set as each contract is read: Derived, or Bounded and Unknown where text is missing." },
    },
    found: {
      title: "Suppliers with no contract",
      steps: [3],
      doers: [rules, agent("Finder")],
      why: "These are the suppliers the search and the Finder could not match to any file.",
      input: "The supplier payments and the search results.",
      output: "A Find item for each, with the amount paid.",
      reads: ["payments", "documents", "vendors"],
      writes: ["items"],
      modelSees: "Snippets of candidate files, with names as tokens.",
      neverSees: "Files unrelated to the supplier's names and domains.",
      label: null,
    },
    owners: {
      title: "Owners and the confirm queue",
      steps: [6],
      doers: [code],
      why: "Confirming is the only manual work, and it is a queue of yes or no, earliest deadline first.",
      input: "The suggested owners, and the riskiest dates nobody has checked.",
      output: "An owner on each supplier, and dates turned from Derived to Confirmed.",
      reads: ["vendors", "facts"],
      writes: ["vendors", "facts"],
      modelSees: null,
      neverSees: NO_MODEL,
      label: { which: "The deadline's label.", how: "A yes confirms every unchecked fact the date is worked out from, with the person's name." },
    },
  },
  measures: {
    northStar: {
      title: "The north star",
      steps: [7],
      doers: [code],
      why: "It counts what people did, so it must be exact.",
      input: "Deadlines that passed or were decided, and what the owner chose.",
      output: "The share decided before the deadline. Sending a reply alone does not count.",
      reads: ["items"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
    metrics: {
      title: "How we know it works",
      steps: [6, 7],
      doers: [code],
      why: "Every number is counted from the ledger and what people did. There is no baseline, so no saving is claimed.",
      input: "Items, facts, coverage and which items were opened.",
      output: "Six measures, each against a starting target.",
      reads: ["items", "facts", "vendors", "payments"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: { which: "The share of dates that are Confirmed.", how: "Counted from the facts table." },
    },
    signals: {
      title: "What would make us rethink",
      steps: [3, 7],
      doers: [code],
      why: "Each signal is a threshold, checked live.",
      input: "Coverage, access, who items go to, and how many alerts are opened.",
      output: "Clear or triggered, with what we would do.",
      reads: ["items", "vendors", "payments", "access_log"],
      writes: [],
      modelSees: null,
      neverSees: NO_MODEL,
      label: null,
    },
  },
} satisfies Record<string, Record<string, ThinkingNote>>;

type Thinking = typeof thinking;
export type ThinkingKey = { [S in keyof Thinking]: `${S}.${Extract<keyof Thinking[S], string>}` }[keyof Thinking];

export function thinkingNote(key: ThinkingKey): ThinkingNote {
  const [screen, part] = key.split(".") as [keyof Thinking, string];
  return (thinking[screen] as Record<string, ThinkingNote>)[part];
}
