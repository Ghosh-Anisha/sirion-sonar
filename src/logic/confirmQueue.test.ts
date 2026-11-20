import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { confirmEdits, datesToConfirm } from "./confirmQueue";
import { contractDates } from "./dates";
import { applyFactEdits } from "./edits";
import { paidByVendor } from "./match";

const paid = paidByVendor(payments, vendors, DEMO_START);

describe("datesToConfirm", () => {
  it("lists the riskiest unchecked dates, earliest deadline first", () => {
    const queue = datesToConfirm(contracts, DEMO_START, paid);
    expect(queue.map((d) => [d.contract.id, d.deadline])).toEqual([
      ["greenleaf-grounds", "2026-12-01"],
      ["ledgerline-payroll", "2026-12-01"],
      ["quillstone-retainer", "2026-12-10"],
      ["orbis-facilities", "2027-01-01"],
      ["swiftlane-transport", "2027-01-01"],
    ]);
  });

  it("leaves out dates already confirmed, and ones a yes cannot settle", () => {
    const ids = datesToConfirm(contracts, DEMO_START, paid, 20).map((d) => d.contract.id);
    expect(ids).not.toContain("datavane-subscription");
    expect(ids).not.toContain("talentbridge-staffing");
    expect(ids).not.toContain("kestrel-marketing");
    expect(ids).not.toContain("pinecrest-msa");
  });
});

describe("confirmEdits", () => {
  it("turns the date Confirmed without changing it", () => {
    const [first] = datesToConfirm(contracts, DEMO_START, paid);
    const confirmed = applyFactEdits(first.contract, confirmEdits(first.facts, "kavya", DEMO_START));
    expect(contractDates(confirmed.facts, DEMO_START)).toMatchObject({ label: "confirmed", noticeDeadline: first.deadline });
  });
});
