import type { FactEdits } from "../logic/edits";
import type { ItemAction } from "../logic/items";
import type { Onboarding } from "../logic/onboarding";
import type { MomentId } from "./journey";

/** What the app looks like right now, so each step can say whether it has happened. */
export interface DemoSnapshot {
  path: string;
  onboarding: Onboarding;
  actions: Record<string, ItemAction>;
  sent: Record<string, unknown>;
  factEdits: Record<string, FactEdits>;
  viewerId: string;
  today: string;
}

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
  /** Whether the app shows this step has happened, however the viewer got there. */
  done?: (s: DemoSnapshot) => boolean;
}

const at = (s: DemoSnapshot, prefix: string) => s.path.startsWith(prefix);
const step = (s: DemoSnapshot, n: number) => s.onboarding.step >= n;
const connected = (s: DemoSnapshot, id: "payables" | "drive" | "mail") => s.onboarding.sources[id].status === "connected";
const picked = (s: DemoSnapshot, id: "payables" | "drive" | "mail", product: string) => s.onboarding.sources[id].products.includes(product) || connected(s, id);
const approved = (s: DemoSnapshot) => s.onboarding.approval.status === "approved";
const read = (s: DemoSnapshot) => s.onboarding.firstReadDone;
/** Past onboarding and into the product. */
const inProduct = (s: DemoSnapshot) => read(s) && !at(s, "/welcome") && !at(s, "/login");

const cloudmetricItem = "decide:cloudmetric-subscription:2027-03-01";
const cloudDecided = (s: DemoSnapshot) => s.actions[cloudmetricItem] !== undefined;
const orbisAnswered = (s: DemoSnapshot) => s.actions["change:orbis-amendment"] !== undefined;
const nav = (path: string, label: string): Action => ({ click: `a.sidenav__link[href="#${path}"]`, label, fallback: path });

export const demoSteps: DemoStep[] = [
  // Setup, as Kavya, the procurement lead
  { moment: "setup", caption: "You are Kavya, the procurement lead. She sets Sonar up, so she signs in first.", action: { go: "/login" } , done: (s) => s.onboarding.signedIn !== null },
  { moment: "setup", caption: "Sign in with her work account. Nothing is checked, it is a mock.", action: { click: "[data-nudge=login-continue]", label: "Click Continue" } , done: (s) => s.onboarding.signedIn !== null },
  { moment: "setup", caption: "Sonar finds the contracts, reads them, and tells the right person when one needs them.", focus: ".features" , done: (s) => step(s, 1) || read(s) },
  { moment: "setup", caption: "Start the setup.", action: { click: "[data-nudge=wizard-next]", label: "Click Get started" } , done: (s) => step(s, 1) || read(s) },
  { moment: "setup", caption: "Pick her role. It decides what she sees for the rest of the demo.", action: { click: "input[name=role][value=procurement-lead]", label: "Pick Procurement lead" } , done: (s) => s.onboarding.role !== null || read(s) },
  { moment: "setup", caption: "On to the sources.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } , done: (s) => step(s, 2) || read(s) },
  { moment: "setup", caption: "Payables first. The company pays its suppliers from Zoho Books.", action: { click: 'input[value="Zoho Books"]', label: "Tick Zoho Books" } , done: (s) => picked(s, "payables", "Zoho Books") || read(s) },
  { moment: "setup", caption: "Ask to connect it.", action: { press: "Connect Zoho Books", label: "Click Connect" } , done: (s) => connected(s, "payables") },
  { moment: "setup", caption: "The consent screen says what Sonar reads and what it never does. Allow it.", action: { press: "Allow", label: "Click Allow" } , done: (s) => connected(s, "payables") },
  { moment: "setup", caption: "The company keeps files in two places. Tick Google Drive.", action: { click: 'input[value="Google Drive"]', label: "Tick Google Drive" } , done: (s) => picked(s, "drive", "Google Drive") || read(s) },
  { moment: "setup", caption: "And SharePoint too. One consent screen will cover both.", action: { click: 'input[value="SharePoint"]', label: "Tick SharePoint" } , done: (s) => picked(s, "drive", "SharePoint") || read(s) },
  { moment: "setup", caption: "Ask to connect both.", action: { press: "Connect Google Drive and SharePoint", label: "Click Connect" } , done: (s) => connected(s, "drive") },
  { moment: "setup", caption: "Keep Sonar to the folders she chooses, not the whole drive.", action: { press: "Only the folders I choose", label: "Pick this" } , done: (s) => connected(s, "drive") },
  { moment: "setup", caption: "Contracts and Finance are picked. Allow it.", action: { press: "Allow", label: "Click Allow" } , done: (s) => connected(s, "drive") },
  { moment: "setup", caption: "One source is enough to go on, but supplier invoices arrive by email. Tick Gmail too.", action: { click: 'input[value="Gmail"]', label: "Tick Gmail" } , done: (s) => picked(s, "mail", "Gmail") || read(s) },
  { moment: "setup", caption: "Ask to connect it.", action: { press: "Connect Gmail", label: "Click Connect" } , done: (s) => connected(s, "mail") },
  { moment: "setup", caption: "Mail stays on the shared inboxes. Allow it.", action: { press: "Allow", label: "Click Allow" } , done: (s) => connected(s, "mail") },
  { moment: "setup", caption: "Every connect went into the access log. On to IT.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } , done: (s) => step(s, 3) || read(s) },
  { moment: "setup", caption: "Reading across the company needs IT. Send the request.", action: { press: "Send the request to Vikram Nair", label: "Click Send the request" } , done: (s) => s.onboarding.approval.status !== "none" },
  { moment: "setup", caption: "Now play Vikram, the IT admin. He approves access and never sees contract contents.", action: { press: "Switch to the IT admin view", label: "Click to become Vikram" } , done: (s) => approved(s) || s.viewerId === "vikram" },
  { moment: "setup", caption: "As IT, approve read-only access as asked. He could narrow it to a pilot instead.", action: { press: "Approve as asked", label: "Click Approve as asked" } , done: (s) => approved(s) },
  { moment: "setup", caption: "Hand the demo back to Kavya.", action: { press: "Switch back to Kavya Raman", label: "Click to become Kavya" } , done: (s) => approved(s) && s.viewerId !== "vikram" },
  { moment: "setup", caption: "On to where to start.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } , done: (s) => step(s, 4) || read(s) },
  { moment: "setup", caption: "Read all 24 suppliers, not just a pilot.", action: { click: "input[name=start][value=all]", label: "Pick All 24 suppliers" } , done: (s) => s.onboarding.start === "all" || read(s) },
  { moment: "setup", caption: "On to the first read.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } , done: (s) => step(s, 5) || read(s) },
  // First read
  { moment: "first-read", caption: "Run the first read. Code sorts the payments, agents find and read each contract.", action: { click: "[data-nudge=run-first-read]", label: "Click Run the first read" } , done: (s) => s.onboarding.readStage > 0 || read(s) },
  { moment: "first-read", caption: "Watch the eight steps. Each says whether code, a model or an agent does it.", focus: ".pipeline" , done: (s) => read(s) },
  { moment: "first-read", caption: "Skip to the end of the read.", action: { press: "Skip to the end", label: "Click Skip to the end" } , done: (s) => read(s) },
  { moment: "first-read", caption: "24 suppliers: 10 found, 2 partial, 12 not found. On to the finding.", action: { click: "[data-nudge=wizard-next]", label: "Click Next" } , done: (s) => step(s, 6) || inProduct(s) },
  { moment: "first-read", caption: "12 suppliers are paid with no contract on file. That is what Sonar found.", focus: ".wizard__step .table-wrap" , done: (s) => step(s, 7) || inProduct(s) },
  { moment: "first-read", caption: "Give them owners.", action: { click: "[data-nudge=wizard-next]", label: "Click Assign owners" } , done: (s) => step(s, 7) || inProduct(s) },
  { moment: "first-read", caption: "Owners are filled in. Two are left empty on purpose, so their items come to Kavya.", focus: ".wizard__step .table-wrap" , done: (s) => inProduct(s) },
  { moment: "first-read", caption: "Open the list.", action: { click: "[data-nudge=wizard-next]", label: "Click Go to Needs you" } , done: (s) => inProduct(s) },
  { moment: "first-read", caption: "As procurement lead, Kavya sees every item, including the ones nobody owns.", focus: ".hero" , done: (s) => inProduct(s) && s.viewerId === "neha" },
  // Confirm, as Neha, a contract owner
  { moment: "confirm", caption: "Now be Neha. She owns Cloudmetric, so she sees only her own suppliers.", action: { viewer: "neha", label: "Switch to Neha" } , done: (s) => inProduct(s) && s.viewerId === "neha" },
  { moment: "confirm", caption: "Her list is shorter now, only her own suppliers. Open Contracts to check a date.", action: nav("/contracts", "Click Contracts") , done: (s) => at(s, "/contracts") || at(s, "/contract/cloudmetric") || "cloudmetric-subscription" in s.factEdits },
  { moment: "confirm", caption: "Open the Cloudmetric contract.", action: { press: "Cloudmetric analytics subscription", label: "Click Cloudmetric" } , done: (s) => at(s, "/contract/cloudmetric") || "cloudmetric-subscription" in s.factEdits },
  { moment: "confirm", caption: "Each fact shows the sentence it came from. Confirm the start date against it.", action: { click: "[data-nudge=confirm-fact]", label: "Click Confirm" } , done: (s) => Object.keys(s.factEdits["cloudmetric-subscription"] ?? {}).length > 0 },
  { moment: "confirm", caption: "Derived became Confirmed, with her name on it.", focus: "[data-tour=fact-table]" , done: (s) => s.today >= "2026-12-01" },
  // A deadline gets close
  { moment: "deadline", caption: "Move the clock to 1 Dec, 90 days before the Cloudmetric notice deadline.", action: { clock: "2026-12-01", label: "Move to 1 Dec" } , done: (s) => s.today >= "2026-12-01" },
  { moment: "deadline", caption: "Back to her list.", action: nav("/home", "Click Home") , done: (s) => s.today >= "2026-12-01" && (at(s, "/home") || at(s, "/item/decide:cloudmetric") || cloudDecided(s)) },
  { moment: "deadline", caption: "A Decide item has arrived for Cloudmetric. Open it.", action: { click: `[data-nudge="item:${cloudmetricItem}"]`, label: "Click Decide" } , done: (s) => at(s, "/item/decide:cloudmetric") || cloudDecided(s) },
  // Decide
  { moment: "decide", caption: "The dates come with the clauses they were read from.", focus: "[data-tour=item-why]" , done: (s) => cloudDecided(s) },
  { moment: "decide", caption: "She wants a better price. Renegotiate.", action: { press: "Renegotiate", label: "Click Renegotiate" } , done: (s) => cloudDecided(s) },
  { moment: "decide", caption: "Sonar drafted the reply from the contract's own terms. Send it.", action: { press: "Send", label: "Click Send" } , done: (s) => cloudmetricItem in s.sent },
  { moment: "decide", caption: "Nothing goes to the supplier until the owner says yes.", action: { press: "Yes, send it", label: "Click Yes, send it" } , done: (s) => cloudmetricItem in s.sent },
  // An invoice differs, as Arjun, the finance lead
  { moment: "invoice", caption: "Now be Arjun, the finance lead. He sees invoices and prices for every supplier.", action: { viewer: "arjun", label: "Switch to Arjun" } , done: (s) => s.viewerId === "arjun" || ["farah"].includes(s.viewerId) && orbisAnswered(s) },
  { moment: "invoice", caption: "His list.", action: nav("/home", "Click Home") , done: (s) => (s.viewerId === "arjun" && (at(s, "/home") || at(s, "/item/check:brightline"))) || at(s, "/item/check:brightline") },
  { moment: "invoice", caption: "Brightline billed above the agreed rate. Open it.", action: { click: '[data-nudge="item:check:brightline-invoice"]', label: "Click Check invoice" } , done: (s) => at(s, "/item/check:brightline") || s.viewerId === "farah" },
  { moment: "invoice", caption: "Rs 54,600 over, with the clause beside it. Sonar never holds the payment.", focus: "[data-tour=item-why]" , done: (s) => s.viewerId === "farah" || orbisAnswered(s) },
  // An amendment arrives, as Farah, a contract owner
  { moment: "amendment", caption: "Now be Farah. She owns Orbis, the facilities supplier.", action: { viewer: "farah", label: "Switch to Farah" } , done: (s) => s.viewerId === "farah" || orbisAnswered(s) },
  { moment: "amendment", caption: "Her list.", action: nav("/home", "Click Home") , done: (s) => (s.viewerId === "farah" && at(s, "/home")) || at(s, "/item/change:orbis") || at(s, "/versions/orbis") || orbisAnswered(s) },
  { moment: "amendment", caption: "Orbis emailed its First Amendment on 25 Nov. Open it.", action: { click: '[data-nudge="item:change:orbis-amendment"]', label: "Click Review change" } , done: (s) => at(s, "/item/change:orbis") || at(s, "/versions/orbis") || orbisAnswered(s) },
  { moment: "amendment", caption: "Open the versions to compare it with the original.", action: { press: "Open versions", label: "Click Open versions" } , done: (s) => at(s, "/versions/orbis") || orbisAnswered(s) },
  { moment: "amendment", caption: "The changes are tracked clause by clause.", focus: "[data-tour=versions-redline]" , done: (s) => orbisAnswered(s) },
  { moment: "amendment", caption: "Accept it. The end date moves to 31 Mar 2028 and the notice deadline to 2 Dec 2027.", action: { click: "[data-nudge=accept-amendment]", label: "Click Accept" } , done: (s) => orbisAnswered(s) },
  // Nobody acts, as Kavya again
  { moment: "nobody-acts", caption: "Back to Kavya, who gets whatever nobody acts on.", action: { viewer: "kavya", label: "Switch to Kavya" } , done: (s) => orbisAnswered(s) && s.viewerId === "kavya" },
  { moment: "nobody-acts", caption: "Move the clock to 19 Dec, 30 days on.", action: { clock: "2026-12-19", label: "Move to 19 Dec" } , done: (s) => s.today >= "2026-12-19" },
  { moment: "nobody-acts", caption: "Her list.", action: nav("/home", "Click Home") , done: (s) => s.today >= "2026-12-19" && (at(s, "/home") || at(s, "/sirion") || at(s, "/summary")) },
  { moment: "nobody-acts", caption: "Items nobody touched have gone up to her, marked in red.", focus: ".escalated-pill" , done: (s) => at(s, "/sirion") || at(s, "/summary") },
  // Handoff
  { moment: "handoff", caption: "Open the Sirion handoff.", action: nav("/sirion", "Click Sirion") , done: (s) => at(s, "/sirion") || at(s, "/summary") },
  { moment: "handoff", caption: "The checked ledger is clean data for Sirion, where redlining and workflow pick up.", focus: "[data-tour=sirion-ledger]" , done: (s) => at(s, "/summary") },
  { moment: null, caption: "That is the whole story. Take over and try any screen, or read the case behind it.", action: { go: "/summary" } },
];
