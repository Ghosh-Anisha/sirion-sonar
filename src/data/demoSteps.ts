import type { MomentId } from "./journey";

/*
 * The clickable demo: the nine moments of the user journey as one click at a time.
 * Each step points at the one thing to press and says why. The viewer presses it and the
 * story moves on. A step with nothing to press shows something, and waits for Next.
 * Captions follow the copy rules: one idea, plain words.
 */

export type Action =
  /** The viewer presses the first showing element that matches this CSS selector. `fallback` is where to go if it is not on screen, such as a nav link on a phone. */
  | { click: string; label: string; fallback?: string }
  /** The viewer presses the first showing button, link or label whose text is exactly this. */
  | { press: string; label: string }
  /** Moves the clock, from the clock's date box. */
  | { clock: string; label: string }
  /** Changes who the demo is viewed as, from the View as box. */
  | { viewer: string; label: string }
  /** Goes straight to a screen, with no click. */
  | { go: string };

export interface DemoStep {
  moment: MomentId | null;
  caption: string;
  action?: Action;
  /** A CSS selector for the thing to look at, when the step only shows something. */
  focus?: string;
}

const cloudmetricItem = "decide:cloudmetric-subscription:2027-03-01";
const nav = (path: string, label: string): Action => ({ click: `a.sidenav__link[href="#${path}"]`, label, fallback: path });

export const demoSteps: DemoStep[] = [
  // Setup, as Kavya, the procurement lead
  { moment: "setup", caption: "You are Kavya, the procurement lead. She sets Sonar up, so she signs in first.", action: { go: "/login" } },
  { moment: "setup", caption: "Sign in with her work account. Nothing is checked, it is a mock.", action: { click: "[data-nudge=login-continue]", label: "Click Continue" } },
  { moment: "setup", caption: "Sonar finds the contracts, reads them, and tells the right person when one needs them.", focus: ".features" },
  { moment: "setup", caption: "Start the setup.", action: { click: "[data-nudge=wizard-next]", label: "Click Get started" } },
  { moment: "setup", caption: "Pick her role. It decides what she sees for the rest of the demo.", action: { click: "input[name=role][value=procurement-lead]", label: "Pick Procurement lead" } },
  { moment: "setup", caption: "On to the sources.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } },
  { moment: "setup", caption: "Payables first. The company pays its suppliers from Zoho Books.", action: { click: 'input[value="Zoho Books"]', label: "Tick Zoho Books" } },
  { moment: "setup", caption: "Ask to connect it.", action: { press: "Connect Zoho Books", label: "Click Connect" } },
  { moment: "setup", caption: "The consent screen says what Sonar reads and what it never does. Allow it.", action: { press: "Allow", label: "Click Allow" } },
  { moment: "setup", caption: "The company keeps files in two places. Tick Google Drive.", action: { click: 'input[value="Google Drive"]', label: "Tick Google Drive" } },
  { moment: "setup", caption: "And SharePoint too. One consent screen will cover both.", action: { click: 'input[value="SharePoint"]', label: "Tick SharePoint" } },
  { moment: "setup", caption: "Ask to connect both.", action: { press: "Connect Google Drive and SharePoint", label: "Click Connect" } },
  { moment: "setup", caption: "Keep Sonar to the folders she chooses, not the whole drive.", action: { press: "Only the folders I choose", label: "Pick this" } },
  { moment: "setup", caption: "Contracts and Finance are picked. Allow it.", action: { press: "Allow", label: "Click Allow" } },
  { moment: "setup", caption: "One source is enough to go on, but supplier invoices arrive by email. Tick Gmail too.", action: { click: 'input[value="Gmail"]', label: "Tick Gmail" } },
  { moment: "setup", caption: "Ask to connect it.", action: { press: "Connect Gmail", label: "Click Connect" } },
  { moment: "setup", caption: "Mail stays on the shared inboxes. Allow it.", action: { press: "Allow", label: "Click Allow" } },
  { moment: "setup", caption: "Every connect went into the access log. On to IT.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } },
  { moment: "setup", caption: "Reading across the company needs IT. Send the request.", action: { press: "Send the request to Vikram Nair", label: "Click Send the request" } },
  { moment: "setup", caption: "Now play Vikram, the IT admin. He approves access and never sees contract contents.", action: { press: "Switch to the IT admin view", label: "Click to become Vikram" } },
  { moment: "setup", caption: "As IT, approve read-only access as asked. He could narrow it to a pilot instead.", action: { press: "Approve as asked", label: "Click Approve as asked" } },
  { moment: "setup", caption: "Hand the demo back to Kavya.", action: { press: "Switch back to Kavya Raman", label: "Click to become Kavya" } },
  { moment: "setup", caption: "On to where to start.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } },
  { moment: "setup", caption: "Read all 24 suppliers, not just a pilot.", action: { click: "input[name=start][value=all]", label: "Pick All 24 suppliers" } },
  { moment: "setup", caption: "On to the first read.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } },
  // First read
  { moment: "first-read", caption: "Run the first read. Code sorts the payments, agents find and read each contract.", action: { click: "[data-nudge=run-first-read]", label: "Click Run the first read" } },
  { moment: "first-read", caption: "Watch the eight steps. Each says whether code, a model or an agent does it.", focus: ".pipeline" },
  { moment: "first-read", caption: "Skip to the end of the read.", action: { press: "Skip to the end", label: "Click Skip to the end" } },
  { moment: "first-read", caption: "24 suppliers: 9 found, 2 partial, 13 with no contract. On to the finding.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } },
  { moment: "first-read", caption: "13 suppliers are paid with no contract on file. That is what Sonar found.", focus: ".wizard__step .table-wrap" },
  { moment: "first-read", caption: "Give them owners.", action: { click: "[data-nudge=wizard-next]", label: "Click Assign owners" } },
  { moment: "first-read", caption: "Owners are filled in. Two are left empty on purpose, so their items come to Kavya.", focus: ".wizard__step .table-wrap" },
  { moment: "first-read", caption: "Open the list.", action: { click: "[data-nudge=wizard-next]", label: "Click Go to Needs you" } },
  { moment: "first-read", caption: "As procurement lead, Kavya sees every item, including the ones nobody owns.", focus: ".hero" },
  // Confirm, as Neha, a contract owner
  { moment: "confirm", caption: "Now be Neha. She owns Cloudmetric, so she sees only her own suppliers.", action: { viewer: "neha", label: "Switch to Neha" } },
  { moment: "confirm", caption: "Her list is shorter now, only her own suppliers. Open Contracts to check a date.", action: nav("/contracts", "Click Contracts") },
  { moment: "confirm", caption: "Open the Cloudmetric contract.", action: { press: "Cloudmetric analytics subscription", label: "Click Cloudmetric" } },
  { moment: "confirm", caption: "Each fact shows the sentence it came from. Confirm the start date against it.", action: { click: "[data-nudge=confirm-fact]", label: "Click Confirm" } },
  { moment: "confirm", caption: "Derived became Confirmed, with her name on it.", focus: "[data-tour=fact-table]" },
  // A deadline gets close
  { moment: "deadline", caption: "Move the clock to 1 Dec, 90 days before the Cloudmetric notice deadline.", action: { clock: "2026-12-01", label: "Move to 1 Dec" } },
  { moment: "deadline", caption: "Back to her list.", action: nav("/home", "Click Home") },
  { moment: "deadline", caption: "A Decide item has arrived for Cloudmetric. Open it.", action: { click: `[data-nudge="item:${cloudmetricItem}"]`, label: "Click Decide" } },
  // Decide
  { moment: "decide", caption: "The dates come with the clauses they were read from.", focus: "[data-tour=item-why]" },
  { moment: "decide", caption: "She wants a better price. Renegotiate.", action: { press: "Renegotiate", label: "Click Renegotiate" } },
  { moment: "decide", caption: "Sonar drafted the reply from the contract's own terms. Send it.", action: { press: "Send", label: "Click Send" } },
  { moment: "decide", caption: "Nothing goes to the supplier until the owner says yes.", action: { press: "Yes, send it", label: "Click Yes, send it" } },
  // An invoice differs, as Arjun, the finance lead
  { moment: "invoice", caption: "Now be Arjun, the finance lead. He sees invoices and prices for every supplier.", action: { viewer: "arjun", label: "Switch to Arjun" } },
  { moment: "invoice", caption: "His list.", action: nav("/home", "Click Home") },
  { moment: "invoice", caption: "Brightline billed above the agreed rate. Open it.", action: { click: '[data-nudge="item:check:brightline-invoice"]', label: "Click Check invoice" } },
  { moment: "invoice", caption: "Rs 54,600 over, with the clause beside it. Sonar never holds the payment.", focus: "[data-tour=item-why]" },
  // An amendment arrives, as Farah, a contract owner
  { moment: "amendment", caption: "Now be Farah. She owns Orbis, the facilities supplier.", action: { viewer: "farah", label: "Switch to Farah" } },
  { moment: "amendment", caption: "Her list.", action: nav("/home", "Click Home") },
  { moment: "amendment", caption: "Orbis emailed an amendment. Open it.", action: { click: '[data-nudge="item:change:orbis-amendment"]', label: "Click Review change" } },
  { moment: "amendment", caption: "Open the versions to compare it with the original.", action: { press: "Open versions", label: "Click Open versions" } },
  { moment: "amendment", caption: "The changes are tracked clause by clause.", focus: "[data-tour=versions-redline]" },
  { moment: "amendment", caption: "Accept it. The end date moves to 30 Jun 2027.", action: { click: "[data-nudge=accept-amendment]", label: "Click Accept" } },
  // Nobody acts, as Kavya again
  { moment: "nobody-acts", caption: "Back to Kavya, who gets whatever nobody acts on.", action: { viewer: "kavya", label: "Switch to Kavya" } },
  { moment: "nobody-acts", caption: "Move the clock to 19 Dec, 30 days on.", action: { clock: "2026-12-19", label: "Move to 19 Dec" } },
  { moment: "nobody-acts", caption: "Her list.", action: nav("/home", "Click Home") },
  { moment: "nobody-acts", caption: "Items nobody touched have gone up to her, marked in red.", focus: ".escalated-pill" },
  // Handoff
  { moment: "handoff", caption: "Open the Sirion handoff.", action: nav("/sirion", "Click Sirion") },
  { moment: "handoff", caption: "The checked ledger is clean data for Sirion, where redlining and workflow pick up.", focus: "[data-tour=sirion-ledger]" },
  { moment: null, caption: "That is the whole story. Take over and try any screen, or read the case behind it.", action: { go: "/summary" } },
];
