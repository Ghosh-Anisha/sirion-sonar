import { describe, expect, it } from "vitest";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { payments } from "../data/payments";
import { people } from "../data/people";
import { vendors } from "../data/vendors";
import { applyFactEdits } from "./edits";
import { ledgerCsv, ledgerRows, type LedgerRow } from "./ledger";
import { paidByVendor } from "./match";

const paid = paidByVendor(payments, vendors, DEMO_START);
const rows = ledgerRows(contracts, vendors, people, paid, DEMO_START);

describe("ledgerRows", () => {
  it("has one row per contract, confirmed first", () => {
    expect(rows).toHaveLength(12);
    expect(rows[0]).toMatchObject({ supplier: "Datavane Analytics", owner: "Neha Kulkarni", label: "confirmed", endDate: "2027-08-31", noticeDeadline: "2027-05-31" });
    expect(rows.map((r) => r.label).slice(-2)).toEqual(["bounded", "unknown"]);
  });

  it("gives Cloudmetric its rolled-forward dates", () => {
    expect(rows.find((r) => r.contractId === "cloudmetric-subscription")).toMatchObject({ endDate: "2027-04-30", noticeDeadline: "2027-03-01", label: "derived", note: "" });
  });

  it("explains the dates it cannot give exactly", () => {
    expect(rows.find((r) => r.contractId === "kestrel-marketing")!.note).toBe("Notice deadline falls between 2027-01-29 and 2027-02-28");
    expect(rows.find((r) => r.contractId === "pinecrest-msa")!.note).toMatch(/Order Form/);
    expect(rows.find((r) => r.contractId === "ledgerline-payroll")!.owner).toBe("No owner");
  });

  it("moves a contract up once its dates are confirmed", () => {
    const edited = contracts.map((c) =>
      c.id === "cloudmetric-subscription"
        ? applyFactEdits(c, Object.fromEntries(["endDate", "renewalTermMonths", "noticeDays"].map((f) => [f, { kind: "confirmed", value: c.facts.find((x) => x.field === f)!.value, by: "neha", on: DEMO_START }])))
        : c,
    );
    const confirmed = ledgerRows(edited, vendors, people, paid, DEMO_START).filter((r) => r.label === "confirmed");
    expect(confirmed.map((r) => r.supplier)).toEqual(["Cloudmetric", "Datavane Analytics", "Talentbridge Staffing"]);
  });
});

describe("ledgerCsv", () => {
  it("writes a header and one line per contract", () => {
    const lines = ledgerCsv(rows).trimEnd().split("\r\n");
    expect(lines[0]).toBe("supplier,contract,owner,end_date,notice_deadline,label,note");
    expect(lines).toHaveLength(13);
    expect(lines[1]).toBe("Datavane Analytics,Datavane reporting subscription,Neha Kulkarni,2027-08-31,2027-05-31,confirmed,");
  });

  it("quotes values with commas or quotes", () => {
    const row: LedgerRow = { contractId: "x", supplier: 'A "B", C', contract: "D", owner: "E", endDate: null, noticeDeadline: null, label: "unknown", note: "x, y" };
    expect(ledgerCsv([row]).split("\r\n")[1]).toBe('"A ""B"", C",D,E,,,unknown,"x, y"');
  });
});
