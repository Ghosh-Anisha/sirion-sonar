import { useMemo } from "react";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { people } from "../data/people";
import { vendors } from "../data/vendors";
import { routeItem, urgencyGroup, type Routing, type UrgencyGroup } from "../logic/alerts";
import type { Item, ItemAction } from "../logic/items";
import { buildItems } from "../logic/items";
import { orderItems } from "../logic/order";
import { itemSentence } from "../logic/sentences";
import { canSee } from "../logic/visibility";
import { useClock } from "./ClockContext";
import { PROCUREMENT_LEAD, useViewer } from "./ViewerContext";

export interface NeedsYouRow {
  item: Item;
  routing: Routing;
  group: UrgencyGroup;
  sentence: string;
  ownerName: string | null;
}

/** Nothing has been decided yet. Actions arrive with the Item screen. */
const NO_ACTIONS: Record<string, ItemAction> = {};

const vendorName = new Map(vendors.map((v) => [v.id, v.name]));
const personName = new Map(people.map((p) => [p.id, p.name]));

/** The open items the current viewer should see today, in list order. */
export function useNeedsYou(): NeedsYouRow[] {
  const { today } = useClock();
  const { viewer } = useViewer();
  return useMemo(() => {
    const items = buildItems({ today, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: NO_ACTIONS });
    return orderItems(items)
      .filter((item) => item.status === "open" && canSee(item, viewer))
      .map((item) => {
        const routing = routeItem(item, today, PROCUREMENT_LEAD.id);
        return {
          item,
          routing,
          group: urgencyGroup(routing),
          sentence: itemSentence(item, vendorName.get(item.vendorId) ?? item.vendorId, today),
          ownerName: item.ownerId ? (personName.get(item.ownerId) ?? null) : null,
        };
      });
  }, [today, viewer]);
}
