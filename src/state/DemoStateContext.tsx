import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { SENT_TO_SIRION_BEFORE_DEMO } from "../data/demo";
import type { Amendment, FactField } from "../data/types";
import type { Draft } from "../logic/drafts";
import { dropEditsReplacedBy, type FactEdit, type FactEdits } from "../logic/edits";
import type { ItemAction } from "../logic/items";
import type { SirionSend } from "../logic/sirionHandoff";
import { useOnboarding } from "./OnboardingContext";

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
  /** When each item was first opened, so Measures can tell whether alerts are read. */
  opened: Record<string, string>;
  /** Contracts their owner sent to Sirion, by contract id. */
  sirion: Record<string, SirionSend>;
}

type Event =
  | { type: "act"; itemId: string; action: ItemAction; text: string }
  | { type: "send"; itemId: string; message: SentMessage; markDone: boolean; text: string }
  | { type: "edit-fact"; contractId: string; field: FactField; edit: FactEdit; text: string }
  | { type: "open-item"; itemId: string; on: string }
  | { type: "send-to-sirion"; contractId: string; send: SirionSend; text: string }
  | { type: "answer-amendment"; itemId: string; amendment: Amendment; action: ItemAction; text: string };

const INITIAL: DemoState = { actions: {}, sent: {}, factEdits: {}, log: [], opened: {}, sirion: SENT_TO_SIRION_BEFORE_DEMO };

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
    case "send-to-sirion":
      return {
        ...state,
        sirion: { ...state.sirion, [event.contractId]: event.send },
        log: logged(state, { on: event.send.on, by: event.send.by, text: event.text, contractId: event.contractId }),
      };
    case "open-item":
      return state.opened[event.itemId] ? state : { ...state, opened: { ...state.opened, [event.itemId]: event.on } };
  }
}

interface DemoStateValue {
  state: DemoState;
  dispatch: (event: Event) => void;
}

const DemoStateContext = createContext<DemoStateValue | null>(null);

/**
 * What people have done in the demo. Lives in memory only, and starts fresh on reload,
 * except for the dates confirmed during onboarding, which are kept with the wizard.
 */
export function DemoStateProvider({ children }: { children: ReactNode }) {
  const { confirmed } = useOnboarding().state;
  const [state, dispatch] = useReducer(reduce, confirmed, (factEdits) => ({ ...INITIAL, factEdits }));
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState(): DemoStateValue {
  const value = useContext(DemoStateContext);
  if (!value) throw new Error("useDemoState must be used inside DemoStateProvider");
  return value;
}
