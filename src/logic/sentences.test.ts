import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { buildItems } from "./items";
import { actionLabel, daysAway, itemSentence } from "./sentences";

const itemsOn = (today: string) =>
  buildItems({ today, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} });
const nameOf = (id: string) => vendors.find((v) => v.id === id)!.name;
const sentenceFor = (today: string, id: string) => {
  const item = itemsOn(today).find((i) => i.id === id)!;
  return itemSentence(item, nameOf(item.vendorId), today);
};

describe("daysAway", () => {
  it("counts forward and back in plain words", () => {
    expect(daysAway("2026-11-19", "2027-03-01")).toBe("in 102 days");
    expect(daysAway("2026-11-19", "2026-11-20")).toBe("tomorrow");
    expect(daysAway("2026-11-19", "2026-11-19")).toBe("today");
    expect(daysAway("2026-11-19", "2026-11-18")).toBe("yesterday");
    expect(daysAway("2026-11-19", "2026-11-16")).toBe("3 days ago");
  });
});

describe("itemSentence on the sample data", () => {
  it("writes the renewal in the spec's words", () => {
    expect(sentenceFor("2026-12-01", "decide:cloudmetric-subscription:2027-03-01")).toBe(
      "Cloudmetric renews on 30 Apr 2027 unless you tell them by 1 Mar, which is in 90 days.",
    );
  });

  it("says a contract that does not renew ends, and asks about extending", () => {
    expect(sentenceFor("2027-01-01", "decide:brightline-logistics:2027-04-01")).toBe(
      "Brightline Logistics ends on 30 Jun 2027, so tell them by 1 Apr if you want to extend, which is in 90 days.",
    );
  });

  it("says so plainly once the last day to tell them has passed", () => {
    expect(sentenceFor("2026-12-03", "decide:ledgerline-payroll:2026-12-01")).toBe(
      "Ledgerline Payroll Services renews on 31 Dec 2026, and the last day to tell them was 1 Dec, 2 days ago.",
    );
    expect(sentenceFor("2026-12-03", "check:ledgerline-price-rise")).toMatch(/so reply today\.$/);
  });

  it("gives the safe date for a Bounded contract", () => {
    expect(sentenceFor(DEMO_START, "decide:kestrel-freight:2027-01-29")).toBe(
      "Kestrel Freight Carriers renews on a date the scan does not show, so tell them by 29 Jan to be safe, which is in 71 days.",
    );
  });

  it("states the invoice amount and the difference", () => {
    expect(sentenceFor(DEMO_START, "check:brightline-invoice")).toBe(
      "Brightline Logistics billed Rs 8,31,600 on invoice BL/26-27/0871, which is Rs 54,600 more than the agreed rate, so check it before it is paid.",
    );
  });

  it("states the price rise against the cap", () => {
    expect(sentenceFor(DEMO_START, "check:ledgerline-price-rise")).toBe(
      "Ledgerline Payroll Services wants to raise its fee by 15% to Rs 74,750 a month from 1 Jan 2027, above the 7% cap in the contract, so reply before 1 Dec.",
    );
  });

  it("states the missed service level and the credit", () => {
    expect(sentenceFor(DEMO_START, "fix:brightline-invoice")).toBe(
      "Brightline Logistics delivered 38 of 42 trips on time in October, below the 95% in the contract, so you are owed a credit of Rs 41,580.",
    );
  });

  it("states the amendment's change of date", () => {
    expect(sentenceFor(DEMO_START, "change:orbis-amendment")).toBe(
      "Orbis Facility Services sent an amendment that moves the end date from 31 Jan 2027 to 30 Jun 2027, so accept it or reject it.",
    );
  });

  it("states what was paid with no contract", () => {
    expect(sentenceFor(DEMO_START, "find:bluepeak")).toBe(
      "You have paid Bluepeak Security Services Rs 1,12,000 with no contract on file, so find it or ask them for one.",
    );
  });

  it("follows the copy rules on every item", () => {
    const banned = /—|–|!|\b(leverage|seamless|robust|powerful|unlock|empower)\b/i;
    for (const today of [DEMO_START, "2026-12-31", "2027-02-25"]) {
      for (const item of itemsOn(today)) {
        const sentence = itemSentence(item, nameOf(item.vendorId), today);
        expect(sentence, item.id).not.toMatch(banned);
        expect(actionLabel(item)).not.toBe("");
      }
    }
  });
});

describe("one sentence per item", () => {
  it("never puts two sentences in an item line", () => {
    for (const today of [DEMO_START, "2026-12-01", "2026-12-31", "2027-03-05"]) {
      for (const item of buildItems({ today, firstReadOn: DEMO_START, vendors, contracts, payments, emails, actions: {} })) {
        const s = itemSentence(item, item.vendorId, today);
        expect(s.match(/[.?] [A-Z]/), s).toBeNull();
        expect(s.endsWith("."), s).toBe(true);
      }
    }
  });
});
