/*
 * The case reasoning, from docs/spec.md, for the Case pages: Why intake, The problem,
 * Stakeholders and Assumptions. Each part links to the screen where it plays out.
 *
 * Two pictures in the spec are images with no text behind them: the latent versus blatant
 * matrix and the stakeholder map. The placements below are read from the text around them,
 * and the pages say so.
 */

export interface PlaysOut {
  text: string;
  to: string;
}

const item = (id: string) => `/item/${encodeURIComponent(id)}`;

/* Why intake */

export interface IntakeTest {
  name: string;
  why: string;
  playsOut: PlaysOut;
}

export const intakeTests: IntakeTest[] = [
  {
    name: "Unworkable",
    why: "A supplier request today is an email. Nobody can see it, nothing tracks it, and it waits on a reply nobody knows is owed. The contract that comes out of it has no owner, no dates and no link back.",
    playsOut: { text: "See an email traced to its contract", to: "/email?tab=incoming" },
  },
  {
    name: "Unavoidable",
    why: "Every one of the 2,500 suppliers starts, changes and renews through a request. A repository without intake goes stale, because new contracts and changes keep arriving by email.",
    playsOut: { text: "See the amendment that arrived by email", to: "/versions/orbis-facilities" },
  },
  {
    name: "Urgent",
    why: "The company is growing, so each new supplier adds a contract nobody tracks. A notice date passes once per term, and missing it commits the company to another full term.",
    playsOut: { text: "See the renewal due first", to: item("decide:ledgerline-payroll:2026-12-01") },
  },
  {
    name: "Underserved",
    why: "Sirion, Zip and Coupa all assume a setup or a migration first. Their triggers need a repository that is already loaded. This rests on vendor claims, not on a configured Sirion we have tested.",
    playsOut: { text: "See where Sirion picks up", to: "/sirion" },
  },
];

export const otherStagesLose =
  "The other two stages lose on these tests. Negotiation improves how a deal gets made, but the costs happen after signing. A repository needs contracts loaded first, and the company has no loading process. Intake can start from a forwarded email.";

export interface MatrixProblem {
  text: string;
  playsOut: PlaysOut;
}

export interface Quadrant {
  id: string;
  /** Top row is costly, left column is latent. */
  row: "costly" | "cheap";
  column: "latent" | "blatant";
  title: string;
  note: string;
  problems: MatrixProblem[];
}

export const matrix: Quadrant[] = [
  {
    id: "costly-latent",
    row: "costly",
    column: "latent",
    title: "Where the money is",
    note: "Nobody complains, because nobody sees it happen. The prototype leads here.",
    problems: [
      { text: "Contracts renew without anyone deciding to renew them", playsOut: { text: "Decide items", to: "/home" } },
      { text: "Invoices get paid above the price in the contract", playsOut: { text: "The Brightline invoice", to: item("check:brightline-invoice") } },
      { text: "Supplier failures are not on record when the renewal comes up", playsOut: { text: "The missed service level", to: item("fix:brightline-invoice") } },
    ],
  },
  {
    id: "costly-blatant",
    row: "costly",
    column: "blatant",
    title: "Costly and seen",
    note: "None of the problems in the brief sit here.",
    problems: [],
  },
  {
    id: "cheap-latent",
    row: "cheap",
    column: "latent",
    title: "Cheap and unseen",
    note: "None of the problems in the brief sit here.",
    problems: [],
  },
  {
    id: "cheap-blatant",
    row: "cheap",
    column: "blatant",
    title: "How people come in",
    note: "What people complain about. They come in to chase a request, and the same record later warns them about a renewal.",
    problems: [
      { text: "Supplier requests get lost", playsOut: { text: "Incoming mail", to: "/email?tab=incoming" } },
      { text: "Requests stall on a reply nobody knows is owed", playsOut: { text: "The weekly email", to: "/email" } },
    ],
  },
];

/* The problem */

export const problem = {
  summary:
    "A signed contract is a file in a folder, and it does nothing on its own. Nobody is told when a notice window opens, when a supplier misses a service level, or when an invoice arrives above the agreed price.",
  who: [
    "Contract owners: the person in the business who bought the service.",
    "Finance leads at companies this size that run on email, Word, shared drives and Excel.",
    "Requesters raise the request, but they are not the ones who pay for it.",
  ],
  costs: [
    { text: "A renewal nobody decided commits the company to another full term.", playsOut: { text: "Renewals on the list", to: "/home" } },
    { text: "An invoice above the agreed rate gets paid in full.", playsOut: { text: "The invoice check", to: item("check:brightline-invoice") } },
    { text: "A price rise above the contract cap goes through.", playsOut: { text: "The price rise", to: item("check:ledgerline-price-rise") } },
    { text: "A missed service level is not on record when the renewal conversation happens.", playsOut: { text: "The service credit", to: item("fix:brightline-invoice") } },
  ] as { text: string; playsOut: PlaysOut }[],
  assumption: {
    text: "Nobody clearly owns a renewal. The business owner, Procurement, Finance and Legal each think one of the others does.",
    playsOut: { text: "See where items with no owner go", to: item("decide:ledgerline-payroll:2026-12-01") },
  },
  evidenceHave: [
    "The brief: how the company works today, and the costs it names.",
    "Vendor material from Sirion, Zip and Coupa on how their products start.",
  ],
  evidenceNot: [
    "Any data from a real company. Every number in this prototype comes from sample data, and none of it is proof.",
    "A baseline. Nobody tracked missed renewals, so no saving is claimed.",
    "Hands-on use of a configured Sirion.",
  ],
};

/* Stakeholders */

export type GroupId = "owner" | "procurement" | "finance" | "legal" | "it" | "sponsor" | "supplier" | "requester";

export interface Group {
  id: GroupId;
  name: string;
  /** 0 to 100, left to right and bottom to top. */
  interest: number;
  power: number;
  wants: string;
  playsOut: PlaysOut;
}

export const groups: Group[] = [
  {
    id: "procurement",
    name: "Procurement lead",
    power: 80,
    interest: 85,
    wants: "To renegotiate before renewing, and to see every supplier and every item nobody owns.",
    playsOut: { text: "Home as the procurement lead", to: "/home" },
  },
  {
    id: "finance",
    name: "Finance lead",
    power: 85,
    interest: 70,
    wants: "To stop paying above the agreed rate, and to hold an invoice when it is wrong.",
    playsOut: { text: "The invoice check", to: item("check:brightline-invoice") },
  },
  {
    id: "sponsor",
    name: "Executive sponsor",
    power: 90,
    interest: 35,
    wants: "A savings number that proves the tool is worth it.",
    playsOut: { text: "Measures", to: "/measures" },
  },
  {
    id: "it",
    name: "IT admin",
    power: 70,
    interest: 25,
    wants: "The least access that still works, a log of what is opened, and a way to stop it.",
    playsOut: { text: "The access log", to: "/access" },
  },
  {
    id: "legal",
    name: "Legal",
    power: 60,
    interest: 55,
    wants: "To see every change to terms before it is accepted.",
    playsOut: { text: "The amendment in Versions", to: "/versions/orbis-facilities" },
  },
  {
    id: "owner",
    name: "Contract owner",
    power: 40,
    interest: 90,
    wants: "To keep a supplier that works, without the service stopping. The product is built around them, because they are the one who has to act.",
    playsOut: { text: "A renewal to decide", to: item("decide:orbis-facilities:2027-01-01") },
  },
  {
    id: "supplier",
    name: "Supplier",
    power: 25,
    interest: 80,
    wants: "To renew as it is, and to raise the price, sometimes above what the contract allows.",
    playsOut: { text: "The price rise", to: item("check:ledgerline-price-rise") },
  },
  {
    id: "requester",
    name: "Requester",
    power: 20,
    interest: 45,
    wants: "To get the supplier they asked for, quickly, and to know where the request stands.",
    playsOut: { text: "Incoming mail", to: "/email?tab=incoming" },
  },
];

export interface Conflict {
  id: string;
  title: string;
  between: [GroupId, GroupId];
  /** Set when one side is not a group on the map, such as "the business". */
  betweenText: string;
  why: string;
  sonar: string;
  playsOut: PlaysOut;
}

export const conflicts: Conflict[] = [
  {
    id: "renewal",
    title: "Who decides a renewal",
    between: ["owner", "procurement"],
    betweenText: "Contract owner and Procurement lead",
    why: "The owner wants to keep the supplier as it is. Procurement wants to renegotiate. Each assumes the other decides.",
    sonar: "The item goes to the owner first. If nobody acts by the 30 day alert, it also goes to the procurement lead. An item with no owner goes straight to Procurement.",
    playsOut: { text: "An unowned renewal on the list", to: item("decide:ledgerline-payroll:2026-12-01") },
  },
  {
    id: "invoice",
    title: "Pay or hold an invoice above the agreed rate",
    between: ["finance", "owner"],
    betweenText: "Finance lead and Contract owner",
    why: "Finance wants to hold it. The owner fears the service stops.",
    sonar: "Raises a Check item with the difference and the clause. Owner and Finance decide together. Sonar never holds a payment.",
    playsOut: { text: "The Brightline invoice", to: item("check:brightline-invoice") },
  },
  {
    id: "change",
    title: "Speed or review for a change to terms",
    between: ["legal", "owner"],
    betweenText: "Legal and the business",
    why: "Legal wants to see every change. The business wants a quick yes.",
    sonar: "Amendments go to the version history for the owner to accept, marked for Legal to see. Nothing waits on Legal unless the company sets that rule.",
    playsOut: { text: "The Orbis amendment", to: "/versions/orbis-facilities" },
  },
  {
    id: "access",
    title: "How much access",
    between: ["it", "procurement"],
    betweenText: "IT admin and the product",
    why: "Finding contracts needs broad read access. IT wants the least that works.",
    sonar: "Read-only access, supplier domains only, an access log IT can read, and a pilot that starts with the highest-spend suppliers.",
    playsOut: { text: "The IT approval step in onboarding", to: "/welcome?step=4" },
  },
  {
    id: "price",
    title: "A price increase",
    between: ["supplier", "owner"],
    betweenText: "Supplier and the company",
    why: "The supplier asks for more than the contract cap allows.",
    sonar: "Flags the gap against the cap and drafts a reply. The owner sends it.",
    playsOut: { text: "The Ledgerline price rise", to: item("check:ledgerline-price-rise") },
  },
  {
    id: "value",
    title: "Proof of value",
    between: ["sponsor", "procurement"],
    betweenText: "Executive sponsor and the team",
    why: "The sponsor wants a savings number. Nobody has tracked renewals, so there is no baseline.",
    sonar: "Counts decisions made before the deadline from day one. Money is counted only where an invoice or a cap breach proves it.",
    playsOut: { text: "Measures", to: "/measures" },
  },
];

/* Assumptions */

export interface Assumption {
  text: string;
  leastSettled?: boolean;
  playsOut: PlaysOut;
}

export const assumptions: Assumption[] = [
  {
    text: "A vendor list exists in some form, because invoices get processed. A payables system comes first, and bank lines are the fallback.",
    playsOut: { text: "The vendor list step of the first read", to: "/welcome?step=6" },
  },
  {
    text: "There is no contract tracker. If there were, the problem would not look like this, so Excel is treated as one more place contracts sit.",
    playsOut: { text: "Suppliers with no contract", to: "/welcome?step=7" },
  },
  {
    text: "Nobody clearly owns a renewal. The stakeholder map has to test this.",
    playsOut: { text: "Who decides a renewal", to: "/stakeholders?conflict=renewal" },
  },
  {
    text: "The company will approve read-only access to a drive, shared inboxes and the ledger. This would take longest in a real company.",
    leastSettled: true,
    playsOut: { text: "The IT approval step in onboarding", to: "/welcome?step=4" },
  },
  {
    text: "The alert points at 90, 30 and 7 days before a notice deadline, and the metric thresholds, are our numbers and can change.",
    playsOut: { text: "Measures", to: "/measures" },
  },
  {
    text: "Models are off the shelf and reached through our own cloud account. We have not priced running them.",
    playsOut: { text: "Where data lives", to: "/architecture" },
  },
  {
    text: "Sirion's redlining, approvals, supplier portal and e-signature come from its published material. The prototype shows where they connect.",
    playsOut: { text: "The Sirion handoff", to: "/sirion" },
  },
  {
    text: "Editing a contract inside the product is described, not built, apart from the version history on one sample contract.",
    playsOut: { text: "Versions", to: "/versions/orbis-facilities" },
  },
  {
    text: "Sirion, Zip and Coupa claims come from vendor material. We have not used a configured Sirion.",
    playsOut: { text: "Why intake", to: "/why" },
  },
  {
    text: "The evidence that this problem is real comes from the brief alone. The prototype says so and does not dress up sample data as proof.",
    playsOut: { text: "What evidence we have", to: "/problem" },
  },
];
