import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { Amendment, FactField } from "../data/types";
import type { Draft } from "../logic/drafts";
import { dropEditsReplacedBy, type FactEdit, type FactEdits } from "../logic/edits";
import type { ItemAction } from "../logic/items";

/** A message that went out, after the owner clicked send and confirmed. */
export interface SentMessage extends Draft {
  on: string;
  by: string;
}

/** One line in the activity log: who did what, when. */
export interface LogEntry {
  id: number;
  on: string;
  by: string;
  text: string;
  itemId?: string;
  contractId?: string;
}

export interface DemoState {
  actions: Record<string, ItemAction>;
  sent: Record<string, SentMessage>;
  factEdits: Record<string, FactEdits>;
  log: LogEntry[];
  /** Whether the first read has run. Until it has, Home links to Setup. */
  firstReadDone: boolean;
  /** When each item was first opened, so Measures can tell whether alerts are read. */
  opened: Record<string, string>;
}

type Event =
  | { type: "act"; itemId: string; action: ItemAction; text: string }
  | { type: "send"; itemId: string; message: SentMessage; markDone: boolean; text: string }
  | { type: "edit-fact"; contractId: string; field: FactField; edit: FactEdit; text: string }
  | { type: "first-read-done"; on: string; by: string }
  | { type: "open-item"; itemId: string; on: string }
  | { type: "answer-amendment"; itemId: string; amendment: Amendment; action: ItemAction; text: string };

const INITIAL: DemoState = { actions: {}, sent: {}, factEdits: {}, log: [], firstReadDone: false, opened: {} };

function logged(state: DemoState, entry: Omit<LogEntry, "id">): LogEntry[] {
  return [...state.log, { ...entry, id: state.log.length + 1 }];
}

function reduce(state: DemoState, event: Event): DemoState {
  switch (event.type) {
    case "act":
      return {
        ...state,
        actions: { ...state.actions, [event.itemId]: event.action },
        log: logged(state, { on: event.action.on, by: event.action.by, text: event.text, itemId: event.itemId }),
      };
    case "send": {
      const { message, itemId } = event;
      const action: ItemAction = { kind: "sent", on: message.on, by: message.by };
      return {
        ...state,
        sent: { ...state.sent, [itemId]: message },
        actions: event.markDone ? { ...state.actions, [itemId]: action } : state.actions,
        log: logged(state, { on: message.on, by: message.by, text: event.text, itemId }),
      };
    }
    case "edit-fact": {
      const current = state.factEdits[event.contractId] ?? {};
      return {
        ...state,
        factEdits: { ...state.factEdits, [event.contractId]: { ...current, [event.field]: event.edit } },
        log: logged(state, { on: event.edit.on, by: event.edit.by, text: event.text, contractId: event.contractId }),
      };
    }
    case "answer-amendment": {
      const { amendment, action, itemId } = event;
      const edits = state.factEdits[amendment.contractId] ?? {};
      return {
        ...state,
        actions: { ...state.actions, [itemId]: action },
        factEdits:
          action.kind === "accepted"
            ? { ...state.factEdits, [amendment.contractId]: dropEditsReplacedBy(edits, amendment) }
            : state.factEdits,
        log: logged(state, { on: action.on, by: action.by, text: event.text, itemId, contractId: amendment.contractId }),
      };
    }
    case "open-item":
      return state.opened[event.itemId] ? state : { ...state, opened: { ...state.opened, [event.itemId]: event.on } };
    case "first-read-done":
      return state.firstReadDone
        ? state
        : { ...state, firstReadDone: true, log: logged(state, { on: event.on, by: event.by, text: "ran the first read." }) };
  }
}

interface DemoStateValue {
  state: DemoState;
  dispatch: (event: Event) => void;
}

const DemoStateContext = createContext<DemoStateValue | null>(null);

/** What people have done in the demo. Lives in memory only, and starts fresh on reload. */
export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState(): DemoStateValue {
  const value = useContext(DemoStateContext);
  if (!value) throw new Error("useDemoState must be used inside DemoStateProvider");
  return value;
}
