import type { RoleId, SourceId } from "../data/sources";
import type { FactEdits } from "./edits";

/*
 * The onboarding wizard's state and every change to it, as one pure reducer.
 * The access log in here is append only: no event removes or rewrites an entry,
 * and an entry with a key already in the log is not added twice.
 */

export const STEP_COUNT = 8;

export interface SourceScope {
  /** Every product connected for this source. A company can use more than one, such as Google Drive and SharePoint. */
  products: string[];
  /** Drive only: every folder, or the ones picked. */
  folders: "all" | "chosen";
  chosen: string[];
  /** Mail only: the shared inboxes, or a search across the company limited to supplier domains. */
  mail: "shared" | "domains";
}

export interface SourceState {
  /** The products picked on the card, before or after connecting. */
  products: string[];
  status: "idle" | "connected" | "revoked";
  scope: SourceScope | null;
  /** When access was last revoked, and by whom. */
  revoked: { on: string; by: string } | null;
}

export type Approval =
  | { status: "none" }
  | { status: "requested"; on: string; by: string }
  | { status: "approved"; scope: "full" | "pilot"; on: string; by: string };

export interface AccessLogEntry {
  key: string;
  on: string;
  /** A person's name, or Sonar. */
  by: string;
  source: SourceId | "access";
  kind: "connect" | "request" | "approve" | "revoke" | "export" | "search" | "open" | "message";
  text: string;
}

export interface Onboarding {
  /** The work account signed in on the mock sign-in screen, or null before that. */
  signedIn: { email: string; on: string } | null;
  step: number;
  role: RoleId | null;
  sources: Record<SourceId, SourceState>;
  approval: Approval;
  start: "pilot" | "all" | null;
  /** Pipeline stages finished in the first read, 0 to 8. */
  readStage: number;
  /** Whether the read has gone past the pilot to every supplier. */
  readAll: boolean;
  firstReadDone: boolean;
  /** Owners set in the wizard, by vendor id. A vendor not listed keeps the owner in the sample data. */
  owners: Record<string, string | null>;
  /** Dates confirmed in the wizard's queue, by contract id. */
  confirmed: Record<string, FactEdits>;
  log: AccessLogEntry[];
}

const IDLE: SourceState = { products: [], status: "idle", scope: null, revoked: null };

export const INITIAL_ONBOARDING: Onboarding = {
  signedIn: null,
  step: 0,
  role: null,
  sources: { payables: IDLE, drive: IDLE, mail: IDLE },
  approval: { status: "none" },
  start: null,
  readStage: 0,
  readAll: false,
  firstReadDone: false,
  owners: {},
  confirmed: {},
  log: [],
};

export type OnboardingEvent =
  | { type: "go"; step: number }
  | { type: "role"; role: RoleId }
  | { type: "sign-in"; email: string; on: string }
  | { type: "toggle-product"; source: SourceId; product: string }
  | { type: "connect"; source: SourceId; scope: SourceScope; entry: AccessLogEntry }
  | { type: "revoke"; source: SourceId; entry: AccessLogEntry }
  | { type: "request"; entry: AccessLogEntry }
  | { type: "approve"; scope: "full" | "pilot"; entry: AccessLogEntry }
  | { type: "start"; start: "pilot" | "all" }
  | { type: "read-stage"; stage: number; entries: AccessLogEntry[] }
  | { type: "widen"; entry: AccessLogEntry | null }
  | { type: "read-done" }
  | { type: "owners"; owners: Record<string, string | null> }
  | { type: "confirm"; contractId: string; edits: FactEdits }
  | { type: "skip"; scopes: Record<SourceId, SourceScope>; entries: AccessLogEntry[]; on: string; by: string; email: string }
  | { type: "reset" };

/** Adds entries to the end of the log, skipping any whose key is already there. */
export function appendLog(log: AccessLogEntry[], entries: AccessLogEntry[]): AccessLogEntry[] {
  const seen = new Set(log.map((e) => e.key));
  const fresh = entries.filter((e) => !seen.has(e.key) && seen.add(e.key));
  return fresh.length === 0 ? log : [...log, ...fresh];
}

function setSource(state: Onboarding, id: SourceId, change: Partial<SourceState>): Onboarding["sources"] {
  return { ...state.sources, [id]: { ...state.sources[id], ...change } };
}

export function reduceOnboarding(state: Onboarding, event: OnboardingEvent): Onboarding {
  switch (event.type) {
    case "go":
      return { ...state, step: Math.min(Math.max(event.step, 0), STEP_COUNT - 1) };
    case "role":
      return { ...state, role: event.role };
    case "sign-in":
      return { ...state, signedIn: { email: event.email, on: event.on } };
    case "toggle-product": {
      const picked = state.sources[event.source].products;
      const products = picked.includes(event.product) ? picked.filter((p) => p !== event.product) : [...picked, event.product];
      return { ...state, sources: setSource(state, event.source, { products }) };
    }
    case "connect":
      return {
        ...state,
        sources: setSource(state, event.source, { products: event.scope.products, status: "connected", scope: event.scope }),
        log: appendLog(state.log, [event.entry]),
      };
    case "revoke":
      return {
        ...state,
        sources: setSource(state, event.source, { status: "revoked", revoked: { on: event.entry.on, by: event.entry.by } }),
        log: appendLog(state.log, [event.entry]),
      };
    case "request":
      return { ...state, approval: { status: "requested", on: event.entry.on, by: event.entry.by }, log: appendLog(state.log, [event.entry]) };
    case "approve":
      return {
        ...state,
        approval: { status: "approved", scope: event.scope, on: event.entry.on, by: event.entry.by },
        start: event.scope === "pilot" ? "pilot" : state.start,
        log: appendLog(state.log, [event.entry]),
      };
    case "start":
      return event.start === state.start ? state : { ...state, start: event.start, readStage: 0, readAll: false };
    case "read-stage":
      return { ...state, readStage: Math.max(state.readStage, event.stage), log: appendLog(state.log, event.entries) };
    case "widen": {
      const approval = state.approval.status === "approved" ? { ...state.approval, scope: "full" as const } : state.approval;
      return { ...state, readAll: true, readStage: 2, approval, log: event.entry ? appendLog(state.log, [event.entry]) : state.log };
    }
    case "read-done":
      return { ...state, firstReadDone: true };
    case "owners":
      return { ...state, owners: { ...state.owners, ...event.owners } };
    case "confirm":
      return { ...state, confirmed: { ...state.confirmed, [event.contractId]: event.edits } };
    case "skip": {
      const sources = Object.fromEntries(
        Object.entries(event.scopes).map(([id, scope]) => [id, { products: scope.products, status: "connected", scope, revoked: null }]),
      ) as Onboarding["sources"];
      return {
        ...state,
        signedIn: state.signedIn ?? { email: event.email, on: event.on },
        sources,
        approval: { status: "approved", scope: "full", on: event.on, by: event.by },
        start: "all",
        readStage: 8,
        readAll: true,
        firstReadDone: true,
        log: appendLog(state.log, event.entries),
      };
    }
    case "reset":
      return INITIAL_ONBOARDING;
  }
}

/** Reads saved state back, or starts fresh when there is none or it does not look right. */
export function parseOnboarding(raw: string | null): Onboarding {
  if (!raw) return INITIAL_ONBOARDING;
  try {
    const saved = JSON.parse(raw) as Partial<Onboarding>;
    if (typeof saved !== "object" || saved === null || !Array.isArray(saved.log) || typeof saved.step !== "number") return INITIAL_ONBOARDING;
    return { ...INITIAL_ONBOARDING, ...saved, sources: { ...INITIAL_ONBOARDING.sources, ...saved.sources } };
  } catch {
    return INITIAL_ONBOARDING;
  }
}

/** Whether a source's scope reaches across the company rather than a few chosen places. */
export function isOrgWide(source: SourceId, scope: SourceScope): boolean {
  if (source === "drive") return scope.folders === "all";
  if (source === "mail") return scope.mail === "domains";
  return false;
}

/** Company access needs the IT admin to approve it, unless the IT admin is the one setting it up: then their Allow is the approval. */
export function needsApproval(state: Onboarding): boolean {
  return state.role !== "it-admin";
}

/** Onboarding can go on once any one source is connected. The others can be added later. */
export function anyConnected(state: Onboarding): boolean {
  return Object.values(state.sources).some((s) => s.status === "connected");
}

export function allConnected(state: Onboarding): boolean {
  return Object.values(state.sources).every((s) => s.status === "connected");
}
