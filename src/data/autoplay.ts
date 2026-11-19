import type { MomentId } from "./journey";

/*
 * The autoplay story: the nine moments of the user journey, played as short beats.
 * Each beat sets the scene (screen, viewer, clock), points at one thing, and may press one
 * button the way a person would. Captions follow the copy rules: one idea, plain words.
 */

export type Act =
  | { go: string }
  | { clock: string }
  | { viewer: string }
  /** Press the first showing element that matches this CSS selector. */
  | { click: string }
  /** Press the first showing button or link whose text is exactly this. */
  | { press: string }
  | { wait: number };

export interface Beat {
  moment: MomentId | null;
  caption: string;
  acts: Act[];
  /** A CSS selector for the thing to point at while the caption shows. */
  focus?: string;
  /** How long the beat stays up while playing, in milliseconds. */
  hold: number;
}

const cloudmetricItem = "decide:cloudmetric-subscription:2027-03-01";

export const beats: Beat[] = [
  {
    moment: null,
    caption: "Sonar finds a company's supplier contracts, reads them, and tells the right person when one needs them.",
    acts: [{ go: "/welcome?step=1" }, { viewer: "kavya" }, { clock: "2026-11-19" }],
    focus: "[data-tour=wizard-progress]",
    hold: 4500,
  },
  {
    moment: "setup",
    caption: "It connects read-only to payables, the drive and mail, and logs every connect.",
    acts: [{ go: "/welcome?step=3" }],
    focus: ".source-grid",
    hold: 4500,
  },
  {
    moment: "setup",
    caption: "IT approves the access, or narrows it to a pilot on the suppliers paid most.",
    acts: [{ go: "/welcome?step=4" }],
    focus: ".conflict",
    hold: 4500,
  },
  {
    moment: "first-read",
    caption: "The first read sorts 62 payment lines into 24 suppliers, then finds and reads their contracts.",
    acts: [{ go: "/welcome?step=6" }, { click: "[data-nudge=run-first-read]" }, { wait: 3500 }, { press: "Skip to the end" }],
    focus: ".pipeline",
    hold: 3000,
  },
  {
    moment: "first-read",
    caption: "13 suppliers are paid with no contract on file. That is the finding.",
    acts: [{ go: "/welcome?step=7" }],
    focus: ".wizard__step .table-wrap",
    hold: 4500,
  },
  {
    moment: "first-read",
    caption: "That becomes one list. Each line is one sentence, with the nearest deadline first.",
    acts: [{ click: "[data-tour=wizard-skip]" }, { go: "/home" }],
    focus: ".next-up",
    hold: 5000,
  },
  {
    moment: "confirm",
    caption: "The owner checks a fact against the sentence it came from. Confirming turns it from Derived to Confirmed.",
    acts: [{ viewer: "neha" }, { go: "/contract/cloudmetric-subscription?fact=endDate" }, { wait: 1200 }, { click: "[data-nudge=confirm-fact]" }],
    focus: "[data-tour=fact-table]",
    hold: 4500,
  },
  {
    moment: "deadline",
    caption: "On 1 Dec the Cloudmetric notice deadline is 90 days away, so a Decide item arrives for Neha.",
    acts: [{ clock: "2026-12-01" }, { go: "/home" }],
    focus: `[data-item="${cloudmetricItem}"]`,
    hold: 5000,
  },
  {
    moment: "decide",
    caption: "Neha chooses to renegotiate. Sonar drafts the reply from the contract's own terms.",
    acts: [{ go: `/item/${encodeURIComponent(cloudmetricItem)}` }, { wait: 1200 }, { press: "Renegotiate" }],
    focus: "[data-tour=item-actions]",
    hold: 5000,
  },
  {
    moment: "decide",
    caption: "Nothing goes to the supplier until she reads it and says yes.",
    acts: [{ press: "Send" }, { wait: 1500 }, { press: "Yes, send it" }],
    focus: "[data-tour=item-actions]",
    hold: 4000,
  },
  {
    moment: "invoice",
    caption: "Brightline billed Rs 54,600 above the agreed rate. The clause sits next to it, and the payment is not held.",
    acts: [{ viewer: "arjun" }, { go: `/item/${encodeURIComponent("check:brightline-invoice")}` }],
    focus: "[data-tour=item-why]",
    hold: 5500,
  },
  {
    moment: "amendment",
    caption: "Orbis sent an amendment by email. Accepting it moves the end date to 30 Jun 2027.",
    acts: [{ viewer: "farah" }, { go: "/versions/orbis-facilities" }, { wait: 1500 }, { click: "[data-nudge=accept-amendment]" }],
    focus: "[data-tour=versions-amendment]",
    hold: 5000,
  },
  {
    moment: "nobody-acts",
    caption: "Thirty days on, items nobody touched go up to the procurement lead.",
    acts: [{ viewer: "kavya" }, { clock: "2026-12-19" }, { go: "/home" }],
    focus: ".escalated-pill",
    hold: 5000,
  },
  {
    moment: "handoff",
    caption: "The checked ledger is clean data to hand over to Sirion, where redlining and workflow pick up.",
    acts: [{ go: "/sirion" }],
    focus: "[data-tour=sirion-ledger]",
    hold: 5000,
  },
  {
    moment: null,
    caption: "That is the whole story. Take over and try any screen, or read the case behind it.",
    acts: [{ go: "/summary" }],
    hold: 0,
  },
];
