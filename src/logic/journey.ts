import type { MomentId } from "../data/journey";
import type { Contract } from "../data/types";
import { addDays } from "./calendar";
import { contractDates } from "./dates";
import type { FactEdits } from "./edits";
import type { Item, ItemAction } from "./items";
import { anyConnected, type Onboarding } from "./onboarding";

/*
 * Which moments of the demo are done, worked out from what is already in app state,
 * and what Do this next does for the first one that is not.
 */

export const CLOUDMETRIC_CONTRACT = "cloudmetric-subscription";
export const BRIGHTLINE_INVOICE_ITEM = "check:brightline-invoice";
export const ORBIS_AMENDMENT_ITEM = "change:orbis-amendment";
/** The 90 day alert point for a notice deadline. */
const FIRST_ALERT_DAYS = 90;
/** How far Nobody acts moves the clock past the demo start. */
export const NOBODY_ACTS_DAYS = 30;

export interface JourneyInput {
  onboarding: Onboarding;
  factEdits: Record<string, FactEdits>;
  actions: Record<string, ItemAction>;
  opened: Record<string, string>;
  items: Item[];
  contracts: Contract[];
  visited: string[];
  today: string;
  demoStart: string;
}

const DECISIONS = new Set(["renew", "renegotiate", "end", "sent"]);

/** The Cloudmetric deadline to come, and the day its 90 day alert fires. */
export function cloudmetricAlert(contracts: Contract[], today: string): { deadline: string; alertOn: string; itemId: string } | null {
  const contract = contracts.find((c) => c.id === CLOUDMETRIC_CONTRACT);
  const deadline = contract ? contractDates(contract.facts, today).noticeDeadline : null;
  if (!deadline) return null;
  return { deadline, alertOn: addDays(deadline, -FIRST_ALERT_DAYS), itemId: `decide:${CLOUDMETRIC_CONTRACT}:${deadline}` };
}

export function momentsDone(input: JourneyInput): Record<MomentId, boolean> {
  const { onboarding, factEdits, actions, opened, items, contracts, visited, today, demoStart } = input;
  const alert = cloudmetricAlert(contracts, demoStart);
  const amendment = actions[ORBIS_AMENDMENT_ITEM];
  return {
    setup: anyConnected(onboarding) && onboarding.approval.status === "approved",
    "first-read": onboarding.firstReadDone,
    confirm: Object.values(factEdits).some((edits) => Object.keys(edits).length > 0),
    deadline: alert !== null && today >= alert.alertOn,
    decide: items.some((i) => i.type === "decide" && i.action !== null && DECISIONS.has(i.action.kind)),
    invoice: BRIGHTLINE_INVOICE_ITEM in opened || BRIGHTLINE_INVOICE_ITEM in actions,
    amendment: amendment !== undefined && (amendment.kind === "accepted" || amendment.kind === "rejected"),
    "nobody-acts": today >= addDays(demoStart, NOBODY_ACTS_DAYS),
    handoff: visited.includes("/sirion"),
  };
}

export interface NextAction {
  to: string;
  /** A date to move the clock to first, if it is behind. */
  clock: string | null;
  /** A data-nudge id for the thing to click once there. */
  nudge: string;
}

export function nextAction(moment: MomentId, input: Pick<JourneyInput, "onboarding" | "contracts" | "today" | "demoStart">): NextAction {
  const { onboarding, contracts, today, demoStart } = input;
  const alert = cloudmetricAlert(contracts, today);
  const atAlert = alert && today < alert.alertOn ? alert.alertOn : null;
  switch (moment) {
    case "setup":
      return { to: `/welcome?step=${onboarding.step < 1 ? 2 : Math.min(onboarding.step + 1, 5)}`, clock: null, nudge: "wizard-next" };
    case "first-read":
      return { to: "/welcome?step=6", clock: null, nudge: "run-first-read" };
    case "confirm":
      return { to: `/contract/${CLOUDMETRIC_CONTRACT}?fact=endDate`, clock: null, nudge: "confirm-fact" };
    case "deadline":
      return { to: "/home", clock: atAlert, nudge: alert ? `item:${alert.itemId}` : "clock-month" };
    case "decide":
      return { to: alert ? `/item/${encodeURIComponent(alert.itemId)}` : "/home", clock: atAlert, nudge: alert ? `act:${alert.itemId}` : "clock-month" };
    case "invoice":
      return { to: `/item/${encodeURIComponent(BRIGHTLINE_INVOICE_ITEM)}`, clock: null, nudge: `act:${BRIGHTLINE_INVOICE_ITEM}` };
    case "amendment":
      return { to: "/versions/orbis-facilities", clock: null, nudge: "accept-amendment" };
    case "nobody-acts": {
      const target = addDays(demoStart, NOBODY_ACTS_DAYS);
      return { to: "/home", clock: today < target ? target : null, nudge: "escalated" };
    }
    case "handoff":
      return { to: "/sirion", clock: null, nudge: "export-csv" };
  }
}
