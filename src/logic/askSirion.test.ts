import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { people } from "../data/people";
import { vendors } from "../data/vendors";
import { askSirion } from "./askSirion";
import { buildItems } from "./items";
import { ledgerRows } from "./ledger";
import { paidByVendor } from "./match";

const ledger = ledgerRows(contracts, vendors, people, paidByVendor(payments, vendors, DEMO_START), DEMO_START);
const items = buildItems({ today: DEMO_START, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });
const ask = (id: Parameters<typeof askSirion>[0]) => askSirion(id, ledger, items, vendors, DEMO_START);

describe("askSirion", () => {
  it("lists the contracts whose term ends in April: Cloudmetric and Orbis", () => {
    const answer = ask("april");
    expect(answer.rows.map((r) => r.slice(0, 2)).sort()).toEqual([
      ["Cloudmetric", "30 Apr 2027"],
      ["Orbis Facility Services", "1 Apr 2027"],
    ]);
  });

  it("finds the supplier billed above the agreed rate this year", () => {
    expect(ask("above-rate").rows).toEqual([["Brightline Logistics", "BL/26-27/0871", "Rs 54,600"]]);
  });

  it("lists the suppliers with no owner", () => {
    expect(ask("no-owner").rows.map((r) => r[0])).toEqual(vendors.filter((v) => v.ownerId === null).map((v) => v.name));
  });
});
