import { useMemo } from "react";
import { people } from "../data/people";
import { vendors } from "../data/vendors";
import { routeItem, urgencyGroup, type Routing, type UrgencyGroup } from "../logic/alerts";
import type { Item } from "../logic/items";
import { orderItems } from "../logic/order";
import { itemSentence } from "../logic/sentences";
import { canSee } from "../logic/visibility";
import { useLedger } from "./useLedger";
import { PROCUREMENT_LEAD, useViewer } from "./ViewerContext";

export interface NeedsYouRow {
  item: Item;
  routing: Routing;
  group: UrgencyGroup;
  sentence: string;
  ownerName: string | null;
}

export const vendorName = new Map(vendors.map((v) => [v.id, v.name]));
export const personName = new Map(people.map((p) => [p.id, p.name]));

/** Everything an item row needs, for one item on one day. */
export function toRow(item: Item, today: string): NeedsYouRow {
  const routing = routeItem(item, today, PROCUREMENT_LEAD.id);
  return {
    item,
    routing,
    group: urgencyGroup(routing),
    sentence: itemSentence(item, vendorName.get(item.vendorId) ?? item.vendorId, today),
    ownerName: item.ownerId ? (personName.get(item.ownerId) ?? null) : null,
  };
}

/** The open items the current viewer should see today, in list order. */
export function useNeedsYou(): NeedsYouRow[] {
  const { items, today } = useLedger();
  const { viewer } = useViewer();
  return useMemo(
    () =>
      orderItems(items)
        .filter((item) => item.status === "open" && canSee(item, viewer))
        .map((item) => toRow(item, today)),
    [items, today, viewer],
  );
}
