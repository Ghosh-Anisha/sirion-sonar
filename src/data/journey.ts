/*
 * The nine moments of the demo, from the User journey section of docs/spec.md.
 * Each says who it is for, what happens, and what the viewer will have seen once it is done.
 */

export type MomentId = "setup" | "first-read" | "confirm" | "deadline" | "decide" | "invoice" | "amendment" | "nobody-acts" | "handoff";

export interface Moment {
  id: MomentId;
  name: string;
  /** The person the demo is viewed as for this moment. */
  personId: string;
  /** What to do, in one line. */
  todo: string;
  /** What the viewer saw, for the summary. */
  saw: string;
}

export const moments: Moment[] = [
  {
    id: "setup",
    name: "Setup",
    personId: "kavya",
    todo: "Connect the payables system, the drive and the mailbox, read-only, and get IT to approve.",
    saw: "Three read-only connections, a consent screen for each, and IT approving or narrowing the access.",
  },
  {
    id: "first-read",
    name: "First read",
    personId: "kavya",
    todo: "Run the first read and watch Sonar build the vendor list and read each supplier.",
    saw: "24 suppliers, 10 found, 2 partial and 12 not found.",
  },
  {
    id: "confirm",
    name: "Confirm",
    personId: "neha",
    todo: "Open the Cloudmetric contract and confirm a fact against its sentence.",
    saw: "A fact checked against the sentence it came from, turning the date from Derived to Confirmed.",
  },
  {
    id: "deadline",
    name: "A deadline gets close",
    personId: "neha",
    todo: "Move to the day Cloudmetric's notice deadline is 90 days away, and see the Decide item arrive.",
    saw: "A Decide item at the top of Needs you, 90 days before the Cloudmetric notice deadline.",
  },
  {
    id: "decide",
    name: "Decide",
    personId: "neha",
    todo: "Choose renew, renegotiate or end on the Cloudmetric item. Sonar drafts the reply.",
    saw: "A decision made before the deadline, and a reply drafted for the owner to send.",
  },
  {
    id: "invoice",
    name: "An invoice differs",
    personId: "arjun",
    todo: "Open the Brightline invoice that bills above the agreed rate.",
    saw: "A Check item with the invoice, the clause and the difference. Sonar does not hold the payment.",
  },
  {
    id: "amendment",
    name: "An amendment arrives",
    personId: "farah",
    todo: "Compare the Orbis amendment with the original, then accept or reject it.",
    saw: "A new version with a redline, and the dates moving once the owner accepted.",
  },
  {
    id: "nobody-acts",
    name: "Nobody acts",
    personId: "kavya",
    todo: "Move the clock forward 30 days and see untouched items go up to the procurement lead.",
    saw: "Untouched items escalating to the procurement lead, and turning urgent 21 days out.",
  },
  {
    id: "handoff",
    name: "Handoff",
    personId: "kavya",
    todo: "See the confirmed ledger ready to hand over to Sirion.",
    saw: "The confirmed ledger as clean data for Sirion, and where its platform picks up.",
  },
];
