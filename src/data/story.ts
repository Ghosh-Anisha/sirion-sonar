import type { PlaysOut } from "./caseStudy";
import type { DoerKind } from "./architecture";
import type { ThinkingKey } from "./thinking";

/*
 * Every word on the story pages: /story, /solution, the four case pages and Measures.
 * Kept here so the story can be edited without touching the components.
 * Copy rules from CLAUDE.md apply: plain words, one idea per line, no long dashes.
 */

export interface NextLink {
  to: string;
  label: string;
}

/** The top level steps of the site, in order. */
export const siteSteps = [
  { id: "problem", number: 1, label: "The problem", to: "/story" },
  { id: "solution", number: 2, label: "The solution", to: "/solution" },
  { id: "try", number: 3, label: "Try it", to: "/login" },
  { id: "measure", number: 4, label: "How we know", to: "/measures" },
] as const;

export type SiteStepId = (typeof siteSteps)[number]["id"];

/* Page 1: the story */

export const hook = {
  headline: "A contract is a file in a folder, and it does nothing on its own.",
  subline: "Here is what that costs a growing company.",
  start: "Start the story",
};

export const brief = {
  kicker: "The case behind the comic",
  headline: "Halden stands in for the company in the brief.",
  tab: "Case file",
  stamp: "Assignment",
  stats: [
    { number: "3,000", label: "employees" },
    { number: "2,500", label: "suppliers, from software to staffing to trucks" },
    { number: "4", label: "places contracts hide", tags: ["Email", "Word", "Drives", "Excel"] },
  ],
  notesTitle: "What keeps going wrong",
  notes: ["Requests get lost", "Approvals stall", "Autorenewals go unreviewed", "Service levels are missed", "Invoices miss agreed prices"],
  askTitle: "The ask",
  ask: "Pick one stage of the contract lifecycle. Build a working, AI powered prototype that fixes it.",
  source: { label: "Law Insider", href: "https://www.lawinsider.com/contracts/categories" },
  sourceLine: "Our sample contracts are adapted from the library at",
  sourceTail: ", with fictional parties.",
  original: "Open the original brief",
};

export const stagePick = {
  kicker: "The stage we picked",
  headline: "Three stages to choose from. We picked the front door.",
  lead: "Press a dimmed card for why not. Then turn the four cards below for why intake passes.",
  pickedBadge: "Picked",
  notPickedBadge: "Not picked",
  showWhy: "Why not",
  hideWhy: "Hide",
  picked: {
    id: "intake",
    name: "Contract intake",
    means: "One front door for everything that needs attention on a supplier contract, including the things the clock and the payments raise.",
  },
  others: [
    {
      id: "negotiation",
      name: "Negotiation",
      short: "Improves the deal, but the costs come later.",
      why: "Negotiation improves how a deal gets made, but the costs in the brief happen after signing.",
    },
    {
      id: "repository",
      name: "Intelligent repository",
      short: "Needs contracts loaded first.",
      why: "A repository needs contracts loaded first, and the company has no loading process.",
    },
  ],
};

/** The cost cards. Figures are passed in already formatted, so every number comes from the data. */
export const costs = {
  kicker: "What it costs",
  headline: "What this costs a company like Halden",
  lead: "These are from the sample data in this prototype, not from a real company.",
  cards: {
    renewal: {
      title: "An autorenewal nobody reviewed",
      line: (f: { amount: string; due: string }) => `Cloudmetric commits ${f.amount} for another year if the notice date of ${f.due} passes.`,
      link: "Open the Cloudmetric contract",
    },
    "price-rise": {
      title: "A price rise above the contract cap",
      line: (f: { increase: string; cap: string; monthly: string; amount: string }) =>
        `Ledgerline asks for ${f.increase}, the cap is ${f.cap}, which is ${f.monthly} a month and ${f.amount} a year more than the contract allows.`,
      late: (f: { received: string; days: number; noticeBy: string }) =>
        `The notice came on ${f.received}, after the ${f.days} day window closed on ${f.noticeBy}.`,
      onTime: (f: { received: string; days: number; noticeBy: string }) =>
        `The notice came on ${f.received}, inside the ${f.days} day window that closes on ${f.noticeBy}.`,
      link: "See the price rise",
    },
    invoice: {
      title: "An invoice above the agreed rate",
      line: (f: { amount: string }) => `Brightline billed ${f.amount} more than the rate card.`,
      link: "See the invoice check",
    },
    lapse: {
      title: "A service that lapses by silence",
      line: (f: { due: string; amount: string }) => `Greenleaf ends unless someone confirms by ${f.due}, and the grounds service worth ${f.amount} a year stops.`,
      link: "See the Greenleaf decision",
    },
    retainer: {
      title: "A retainer that renews on a short window",
      line: (f: { monthly: string; months: number; amount: string; due: string }) =>
        `Quillstone's ${f.monthly} a month runs for ${f.months} more months, ${f.amount} in all, if nobody acts by ${f.due}.`,
      link: "See the Quillstone decision",
    },
  },
  dueLabel: "Act by",
  barLabel: (amount: string) => `${amount} at stake`,
  totalLabel: "Exposure in the first 30 days of the demo",
  totalNote: (f: { from: string; to: string; count: number }) => `The sum of the ${f.count} cards whose date to act falls from ${f.from} to ${f.to}.`,
  leftOut: (names: string) => `${names} is left out because its date to act is later.`,
  closing: "Nobody is careless here. The dates just sit in files that no one is told about.",
};

export interface ComicPanel {
  id: string;
  when: string;
  caption: string;
  /** One more line, shown when the panel is opened larger. */
  aside: string;
  /** What the drawing shows, for screen readers. */
  alt: string;
}

export const comicIntro = {
  kicker: "The problem, as it happens",
  headline: "Meera buys a tool. A year later, nobody remembers.",
  lead: "Halden Foods is a made up company. Meera owns a marketing tool, Raj works in Finance and Imran runs Procurement.",
};

export const panels: ComicPanel[] = [
  {
    id: "signed",
    when: "Monday",
    caption: "It is signed in one email. Nobody else sees it.",
    aside: "This is how most supplier contracts start at a company this size: one person, one inbox.",
    alt: "Meera at her laptop emails a supplier and signs a one year order form for a design tool.",
  },
  {
    id: "scattered",
    when: "That week",
    caption: "Three places, no owner, no dates anywhere.",
    aside: "The file is in downloads, on a shared drive and in a spreadsheet row, and none of them says when it ends.",
    alt: "The signed file moves from a downloads folder to a shared drive to a row in a spreadsheet.",
  },
  {
    id: "buried",
    when: "Eleven months later",
    caption: "The notice window closes on a Friday. Nobody is watching.",
    aside: "The renewal notice is in the inbox, under forty other emails.",
    alt: "A renewal notice from the supplier sits buried in a full inbox while a calendar shows Friday circled.",
  },
  {
    id: "renewed",
    when: "The next month",
    caption: "Neither Meera nor Raj finds out.",
    aside: "The contract renewed for a full year, and the invoice is above the agreed price.",
    alt: "Raj in Finance pays an invoice stamped paid, with a price higher than the agreed one.",
  },
  {
    id: "no-facts",
    when: "At the review",
    caption: "The renewal talk starts with no facts.",
    aside: "The supplier missed its service level four times, and nobody wrote it down.",
    alt: "Imran from Procurement sits across from the supplier with a chart showing four missed service levels he has no record of.",
  },
  {
    id: "with-sonar",
    when: "With Sirion Sonar",
    caption: "Nobody searched. The list came to her.",
    aside: "Ninety days before the deadline, one sentence reaches the owner, and Procurement sees it too if she does nothing.",
    alt: "Ninety days before the deadline Meera gets a message saying Cloudmetric renews on 30 Apr unless you tell them by 1 Mar. Imran sees it if she does nothing.",
  },
];

/** The speech in the panels, drawn inside the pictures. */
export const bubbles = {
  signed: ["I need a design tool", "by Friday."],
  scattered: ["Saved it somewhere."],
  buried: ["Renewal notice", "inside, 1 of 43"],
  renewed: ["Looks routine."],
  noFacts: ["Did they miss", "anything?"],
  sonar: ["Cloudmetric renews on 30 Apr", "unless you tell them by 1 Mar."],
};

export const whyStart = {
  evidence: {
    Unworkable: "A supplier request today is an email. Nothing tracks it, so it waits on a reply nobody knows is owed.",
    Unavoidable: "All 2,500 suppliers start, change and renew through a request, so a repository without intake goes stale.",
    Urgent: "A notice date passes once a term. Missing it commits the company to another full term.",
    Underserved: "Sirion, Zip and Coupa all start with a setup or a migration. This rests on vendor claims we have not tested.",
  } as Record<string, string>,
  matrixLine: "We lead with the top left because that is where the money is. We reach people through the bottom right.",
};

export const whoIsIn = {
  kicker: "Who is in this",
  headline: "Everyone thinks someone else owns the renewal.",
  lead: "Pick a group to see what it wants. Pick a conflict to see who it is between and what Sonar does.",
};

export interface StoryAssumption {
  text: string;
  /** Where the assumption shows up in the prototype. */
  link?: PlaysOut;
  /** How settled it is, 0 to 100. */
  settled: number;
  leastSettled?: boolean;
}

export const assumptionsIntro = {
  kicker: "What we assumed",
  headline: "Five things we took as true, and how sure we are.",
  lead: "The bar shows how settled each one is. Access is the one we are least sure of.",
};

export const storyAssumptions: StoryAssumption[] = [
  { text: "A vendor list exists somewhere, because invoices get paid.", settled: 85 },
  { text: "There is no contract tracker, so Excel is one more place contracts sit.", settled: 70 },
  { text: "Nobody clearly owns a renewal.", settled: 55 },
  { text: "The alert points at 90, 30 and 7 days are our numbers and can change.", settled: 60 },
  { text: "The company will approve read-only access to a drive, shared inboxes and the ledger.", settled: 25, leastSettled: true },
];

export const storyClose = {
  soWhat: "Contracts fail quietly after signing, so the fix has to come to people before the date, not wait to be searched.",
  next: { to: "/solution", label: "See the solution" } as NextLink,
};

/* Page 2: the solution */

export const doerNames: Record<DoerKind, string> = { code: "Code", "model-call": "Model call", agent: "Agent" };

export const pipelineFrame = {
  orchestrator: "Orchestrator: code that chains the steps in order, keeps state, retries, logs, and owns every date, amount and send.",
  gateway: "Model gateway: the only route to any model. Masks names, checks each answer against a schema, logs, caps cost.",
  legend: "Code: fixed steps, no model. Model call: asked one question, once. Agent: a model that picks its own next step, within set limits.",
};

/** The eight pipeline steps as chips, each opening its Under the hood note. Who does each one is in architecture.ts. */
export const solutionSteps: { number: number; name: string; thinking: ThinkingKey }[] = [
  { number: 1, name: "Connect", thinking: "welcome.sources" },
  { number: 2, name: "Vendor list", thinking: "home.find" },
  { number: 3, name: "Find", thinking: "welcome.found" },
  { number: 4, name: "Sort files", thinking: "contract.text" },
  { number: 5, name: "Read", thinking: "contract.facts" },
  { number: 6, name: "Record", thinking: "contract.dates" },
  { number: 7, name: "Watch", thinking: "home.decide" },
  { number: 8, name: "Tell and draft", thinking: "item.draft" },
];

export const solutionAgents: { id: string; name: string; job: string; thinking: ThinkingKey }[] = [
  { id: "finder", name: "Finder", job: "Searches until it finds a supplier's contract, trying other spellings and domains.", thinking: "home.find" },
  { id: "reader", name: "Reader and checker", job: "Checks each term against its sentence, and looks again where one does not match.", thinking: "contract.facts" },
  { id: "reconciler", name: "Reconciler", job: "Works out the terms across amendments.", thinking: "versions.amendment" },
  { id: "email", name: "Email agent", job: "Reads supplier mail and explains the difference.", thinking: "email.read" },
  { id: "drafter", name: "Drafter", job: "Writes the reply for the owner to send.", thinking: "item.draft" },
];

export const solution = {
  kicker: "The solution, 2 of 4",
  headline: "Sonar finds the contracts, watches the dates, and tells the right person.",
  lead: "One picture of the whole thing, left to right. Press Play to follow one invoice through it, or pick any part to see under the hood.",
  columns: {
    events: "What happens in the company",
    sources: "Where the data lives",
    sonar: "Sonar at work",
    record: "The record",
    cockpit: "The cockpit",
    people: "People",
  },
  events: [
    { id: "notice", label: "A supplier emails a notice", thinking: "email.read" },
    { id: "deadline", label: "A deadline gets close", thinking: "home.decide" },
    { id: "invoice", label: "An invoice arrives above the agreed price", thinking: "home.check" },
    { id: "no-contract", label: "A supplier is paid with no contract", thinking: "home.find" },
  ] as { id: string; label: string; thinking: ThinkingKey }[],
  privacy: "Private by design: names are masked before any model, and dates and amounts are computed in code.",
  people: [
    { id: "owner", title: "Contract owner", gets: "The weekly email and alerts at 90, 30 and 7 days", thinking: "email.weekly" },
    { id: "finance", title: "Finance lead", gets: "Check items when an invoice or price is off", thinking: "home.check" },
    { id: "procurement", title: "Procurement lead", gets: "Escalation when nobody acts, and items nobody owns", thinking: "item.routing" },
  ] as { id: string; title: string; gets: string; thinking: ThinkingKey }[],
  peopleLine: "Only the calls that are genuinely theirs.",
  today: {
    title: "Today",
    line: "Contracts sit in email, Word, drives and Excel. Nobody is told when a date comes close.",
  },
  audit: {
    title: "An audit trail for every fact",
    pills: ["Source sentence", "Fact", "Label", "Who confirmed", "Decision"],
  },
  realTitle: "What is real in the prototype, and what is simulated",
  real: [
    { part: "Date arithmetic, labels, ordering of the list, confirm and accept actions", how: "Real, computed live, with a clock you can move forward" },
    { part: "Sorting payments into supplier, not a supplier and not sure", how: "Real, code runs on the sample payments list" },
    { part: "Masking of names before the model", how: "Real on the sample text, shown as before and after" },
    { part: "Version history and amendment comparison on one contract", how: "Real on the sample: an accepted amendment shows as a tracked change and moves the date" },
    { part: "Searching a drive and mail, and reading the 12 sample contracts", how: "Precomputed, with the source sentence highlighted" },
    { part: "Connecting to a real drive or mailbox", how: "A mock consent screen that lists what would be read" },
    { part: "The 5 sample emails", how: "Precomputed matching and classification, each step shown" },
  ],
  soWhat: "Every date on the list can be traced to a sentence, and every call goes to one person.",
  next: { to: "/login", label: "Try it yourself" } as NextLink,
};

/* The case pages and Measures, in the story layer */

export interface StoryPageCopy {
  kicker: string;
  headline: string;
  lines: string[];
  soWhat: string;
  next: NextLink;
}

export const casePages: Record<"why" | "problem" | "stakeholders" | "assumptions" | "measures", StoryPageCopy> = {
  why: {
    kicker: "The case, 1 of 4",
    headline: "Intake is the one door every supplier contract passes through.",
    lines: ["Four tests say it is the place to start. Turn a card for the evidence."],
    soWhat: "So we start where every request already passes, not where contracts first need loading.",
    next: { to: "/problem", label: "Next: the problem" },
  },
  problem: {
    kicker: "The case, 2 of 4",
    headline: "Contracts renew, overcharge and slip by because nobody is told.",
    lines: [
      "Contract owners and Finance leads have it, at companies that run on email, Word, drives and Excel.",
      "Our evidence is the brief alone. The sample data in this prototype proves nothing.",
    ],
    soWhat: "So the product has to reach people before a date passes, not wait to be asked.",
    next: { to: "/stakeholders", label: "Next: who is in this" },
  },
  stakeholders: {
    kicker: "The case, 3 of 4",
    headline: "Everyone thinks someone else owns the renewal.",
    lines: ["Pick a group for what it wants, or a conflict for what Sonar does about it."],
    soWhat: "So every item has one owner, and anything nobody owns goes to Procurement.",
    next: { to: "/assumptions", label: "Next: what we assumed" },
  },
  assumptions: {
    kicker: "The case, 4 of 4",
    headline: "Read-only access is the bet we are least sure of.",
    lines: ["Each card says how settled the assumption is, and where it shows up in the prototype."],
    soWhat: "So the onboarding starts with a pilot IT can approve, and logs every file opened.",
    next: { to: "/solution", label: "Next: the solution" },
  },
  measures: {
    kicker: "How we know, 4 of 4",
    headline: "We count decisions made before the deadline, and claim no saving we cannot prove.",
    lines: ["Every number is worked out live from the sample data and what you did in the demo."],
    soWhat: "So the first month sets the baseline, and money is counted only where an invoice or a cap proves it.",
    next: { to: "/story", label: "Back to the start" },
  },
};

/** How settled each of the ten case assumptions is, 0 to 100, in the order of the Assumptions list. */
export const assumptionSettled = [85, 70, 55, 25, 60, 50, 75, 80, 45, 40];
