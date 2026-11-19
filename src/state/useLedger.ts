import { useMemo } from "react";
import { contracts as sampleContracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { applyFactEdits } from "../logic/edits";
import { buildItems, currentContracts, type Item } from "../logic/items";
import { paidByVendor } from "../logic/match";
import type { Contract, Payment } from "../data/types";
import { useClock } from "./ClockContext";
import { useDemoState } from "./DemoStateContext";

export interface Ledger {
  today: string;
  /** Contracts as they now read: the sample facts with people's checks and accepted amendments applied. */
  contracts: Contract[];
  /** The same contracts before any amendment, with people's checks applied. */
  originals: Contract[];
  /** Every item for today, open and done. */
  items: Item[];
  /** Supplier payments by vendor, up to today. */
  paid: Map<string, Payment[]>;
}

/** The ledger for today, recomputed from the sample facts and what people have done. */
export function useLedger(): Ledger {
  const { today } = useClock();
  const { state } = useDemoState();

  return useMemo(() => {
    const { actions, factEdits } = state;
    return {
      today,
      contracts: currentContracts(sampleContracts, emails, actions, factEdits),
      originals: sampleContracts.map((c) => applyFactEdits(c, factEdits[c.id] ?? {})),
      items: buildItems({ today, firstReadOn: DEMO_START, vendors, contracts: sampleContracts, payments, emails, actions, factEdits }),
      paid: paidByVendor(payments, vendors, today),
    };
  }, [today, state]);
}
