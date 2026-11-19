/*
 * One short tour per screen. Each step points at an element by its data-tour attribute
 * and says one thing. A step whose element is not on the screen is skipped.
 */

export interface TourStep {
  target: string;
  title: string;
  body: string;
}

export type TourScreen =
  | "story"
  | "solution"
  | "login"
  | "welcome"
  | "home"
  | "contracts"
  | "item"
  | "contract"
  | "versions"
  | "email"
  | "measures"
  | "privacy"
  | "sirion"
  | "access"
  | "architecture"
  | "why"
  | "problem"
  | "stakeholders"
  | "assumptions";

export const tours: Record<TourScreen, TourStep[]> = {
  story: [
    { target: "story-hook", title: "The problem in one line", body: "A contract does nothing on its own. The rest of this page shows what that costs." },
    { target: "story-comic", title: "Six panels", body: "Scroll to reveal each one. Press a panel to see it larger with one more line." },
    { target: "story-tests", title: "Why start at intake", body: "Turn each card for the line of evidence behind it." },
    { target: "story-matrix", title: "Where the money is", body: "Hover or focus a dot to read the problem it stands for." },
    { target: "story-next", title: "Then the solution", body: "Each story page ends with one line on why it matters and a button to the next." },
  ],
  solution: [
    { target: "solution-play", title: "Follow one invoice", body: "Play runs one invoice through the whole product in about 12 seconds. Step through it by hand if you like." },
    { target: "solution-diagram", title: "The whole product", body: "Left to right, from what happens in the company to the person who acts. Press any part to see under the hood." },
    { target: "solution-audit", title: "Every fact has a trail", body: "Hover a pill for a real example from the sample data." },
    { target: "solution-real", title: "What is real", body: "This prototype computes the dates and the list for real. The reading and the connections are simulated." },
  ],
  login: [
    { target: "login-sso", title: "Sign in the usual way", body: "The procurement or finance lead signs in with the company's Google or Microsoft account." },
    { target: "login-email", title: "Or a work email", body: "The sample procurement lead's email is filled in. Continue signs in as her." },
    { target: "login-note", title: "Nothing is checked", body: "This sign-in is a mock. It never asks for a password, and nothing leaves your browser." },
  ],
  welcome: [
    { target: "wizard-progress", title: "Eight short steps", body: "This bar shows where you are. A refresh keeps your place." },
    { target: "walkthrough", title: "Two ways in", body: "The clickable demo points at each thing to press, one click at a time. Walk through it yourself opens the Demo guide." },
    { target: "wizard-skip", title: "In a hurry", body: "Skip to demo connects everything with the defaults and takes you to the list with the first read done." },
    { target: "dock-tour", title: "Replay any time", body: "The demo bar at the bottom holds the demo controls. Start the clickable demo from there, or press Tour to explain the screen you are on." },
  ],
  home: [
    { target: "needs-you-list", title: "The list", body: "Everything that needs a person, one sentence each, with the nearest deadline at the top." },
    { target: "item-badges", title: "What the badge means", body: "Decide is a renewal, Check an invoice or price, Fix a missed service level, Find a supplier paid with no contract." },
    { target: "clock", title: "The clock", body: "Move the date on to see what happens if nobody acts. An untouched item goes up to the procurement lead at 30 days." },
    { target: "sample-banner", title: "Sample company, sample data", body: "Nothing here is connected. Every supplier, contract and payment is made up for the demo." },
  ],
  contracts: [
    { target: "contracts-table", title: "Every contract on file", body: "One row per contract, with its next notice deadline and its owner." },
    { target: "contracts-table", title: "How far to trust a date", body: "The label says whether a person checked the date, or Sonar worked it out and nobody has checked yet." },
    { target: "thinking-toggle", title: "See how it works", body: "Turn on Show the thinking to see what each part does under the hood." },
  ],
  item: [
    { target: "item-header", title: "One sentence", body: "What happened, what it costs, and when it is due." },
    { target: "item-why", title: "Why it is here", body: "The sentences from the contract that put this item on the list." },
    { target: "item-actions", title: "Your call", body: "Pick what to do. Sonar drafts the reply, and nothing goes out until you click send." },
    { target: "item-history", title: "A record", body: "Every action is logged with who did it and when." },
  ],
  contract: [
    { target: "contract-dates", title: "Worked out, not read", body: "These dates are computed in code from the facts below. A model never supplies them." },
    { target: "fact-table", title: "What the label tells you", body: "Derived means read from the file and not yet checked. Confirm a fact and it turns Confirmed." },
    { target: "contract-text", title: "The source", body: "Pick a clause reference and the sentence behind that fact is highlighted here." },
  ],
  versions: [
    { target: "versions-amendment", title: "A change arrived", body: "Orbis sent an amendment by email. It waits here for the owner, not on the list." },
    { target: "versions-answer", title: "Accept or reject", body: "Accepting moves the dates on the ledger. Nothing is signed or sent." },
    { target: "versions-redline", title: "Tracked changes", body: "Removed words are struck through and added words underlined, clause by clause." },
    { target: "versions-history", title: "Every version kept", body: "The file in the drive never changes. Sonar keeps each version and who accepted it." },
  ],
  email: [
    { target: "email-tabs", title: "Two kinds of mail", body: "The weekly email Sonar sends each owner, and the supplier mail it reads." },
    { target: "weekly-email", title: "Once a week", body: "Each owner gets only their own items, with one link each. Nothing here goes to a supplier." },
    { target: "view-as", title: "Someone else's week", body: "Use View as to see the email another person gets." },
  ],
  measures: [
    { target: "north-star", title: "The one number", body: "The share of contract deadlines that got a decision before they passed." },
    { target: "metrics", title: "How we know it works", body: "Each measure is counted live from the ledger and what people did here." },
    { target: "signals", title: "When to rethink", body: "Each signal has a threshold. If one trips, the plan changes, and this says how." },
  ],
  privacy: [
    { target: "privacy-original", title: "In our cloud", body: "The contract text as read, with real names, contacts and bank details." },
    { target: "privacy-masked", title: "What the model sees", body: "Names and details swapped for tokens, and a leak check before anything is sent." },
    { target: "privacy-restored", title: "Back in our cloud", body: "Real values go back in from a separate vault after the reply comes back." },
    { target: "privacy-computed", title: "Numbers stay in code", body: "Dates and amounts are worked out from the facts, never taken from the model." },
  ],
  sirion: [
    { target: "sirion-ledger", title: "The clean ledger", body: "Every contract with its owner, dates and label, ready to hand over." },
    { target: "export-csv", title: "Take it with you", body: "Export saves the ledger as a CSV in your browser. Nothing is sent." },
    { target: "sirion-map", title: "Where Sirion picks up", body: "Redlining, approvals, signing and obligations come from Sirion's platform, not from this prototype." },
  ],
  access: [
    { target: "access-sources", title: "What is connected", body: "Each source, read-only, with the scope that was allowed." },
    { target: "access-log", title: "Every file opened", body: "The log can only be added to. IT can read all of it." },
    { target: "view-as", title: "Only IT can revoke", body: "Switch View as to the IT admin to revoke a source and see what stops working." },
  ],
  architecture: [
    { target: "pipeline-map", title: "Eight steps", body: "Steps 1 to 6 build the ledger. Steps 7 and 8 make it push. Pick a step to see it." },
    { target: "step-detail", title: "One step in full", body: "What goes in and out, who does it, and what it never does." },
    { target: "agent-map", title: "Five agents", body: "Each has one job, a few read-only tools and a log." },
    { target: "data-map", title: "Where data lives", body: "Originals stay in the customer's drive. Only masked snippets reach a model." },
  ],
  why: [
    { target: "story-head", title: "The point first", body: "Each case page states its point in one sentence at the top." },
    { target: "story-tests", title: "Four tests", body: "Turn each card for the line of evidence behind it." },
    { target: "story-next", title: "So what", body: "The page ends with why it matters and a button to the next page." },
  ],
  problem: [
    { target: "story-head", title: "The point first", body: "What goes wrong, and how much evidence we have for it." },
    { target: "problem-costs", title: "What it costs", body: "Each cost links to the screen in the prototype that shows it." },
    { target: "story-next", title: "So what", body: "The page ends with why it matters and a button to the next page." },
  ],
  stakeholders: [
    { target: "story-head", title: "The point first", body: "Everyone thinks someone else owns the renewal." },
    { target: "story-stakeholders", title: "Groups and conflicts", body: "Pick a group for what it wants, or a conflict to light up its two groups." },
    { target: "story-next", title: "So what", body: "The page ends with why it matters and a button to the next page." },
  ],
  assumptions: [
    { target: "story-head", title: "The point first", body: "Read-only access is the bet we are least sure of." },
    { target: "story-assumptions", title: "How settled", body: "Each bar shows how sure we are, and each card links to where it shows up." },
    { target: "story-next", title: "So what", body: "The page ends with why it matters and a button to the next page." },
  ],
};

/** Which tour belongs to a path. */
export function tourScreenFor(pathname: string): TourScreen | null {
  const first = pathname.split("/")[1] ?? "";
  return first in tours ? (first as TourScreen) : null;
}
