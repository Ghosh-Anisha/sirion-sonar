import { describe, expect, it } from "vitest";
import { deadlineLabel } from "../logic/labels";
import { contracts } from "./contracts";
import { DEMO_START } from "./demo";
import { emails } from "./emails";
import { payments } from "./payments";
import { people } from "./people";
import type { Clause, Fact } from "./types";
import { vendors } from "./vendors";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_FIELDS = new Set(["startDate", "endDate"]);

function countBy<T>(list: T[], key: (item: T) => string): Record<string, number> {
  return list.reduce<Record<string, number>>((acc, item) => {
    acc[key(item)] = (acc[key(item)] ?? 0) + 1;
    return acc;
  }, {});
}

function checkFacts(facts: Fact[], clauses: Clause[], where: string) {
  for (const f of facts) {
    const clause = clauses.find((c) => c.id === f.clauseId);
    expect(clause, `${where} ${f.field} cites a missing clause`).toBeDefined();
    expect(clause!.text, `${where} ${f.field} sentence is not in its clause`).toContain(f.sentence);
    expect(f.page, `${where} ${f.field} page`).toBe(clause!.page);
    expect(f.label === "confirmed", `${where} ${f.field} confirmed iff someone confirmed it`).toBe(
      f.confirmedBy !== null,
    );
    if (f.confirmedBy) expect(people.map((p) => p.id)).toContain(f.confirmedBy);
    if (f.value === null) expect(["bounded", "unknown"]).toContain(f.label);
    else expect(["confirmed", "derived"]).toContain(f.label);
    if (DATE_FIELDS.has(f.field) && f.value !== null) expect(f.value).toMatch(ISO_DATE);
  }
}

describe("people", () => {
  it("has the six roles from the spec", () => {
    expect(countBy(people, (p) => p.role)).toEqual({
      "procurement-lead": 1,
      "finance-lead": 1,
      "contract-owner": 3,
      "it-admin": 1,
    });
  });
});

describe("vendors", () => {
  it("has 24 suppliers: 10 full, 2 partial, 12 with nothing found", () => {
    expect(vendors).toHaveLength(24);
    expect(countBy(vendors, (v) => v.contractStatus)).toEqual({ full: 10, partial: 2, none: 12 });
  });

  it("has unique ids", () => {
    expect(new Set(vendors.map((v) => v.id)).size).toBe(vendors.length);
  });

  it("has at least two suppliers with no owner", () => {
    expect(vendors.filter((v) => v.ownerId === null).length).toBeGreaterThanOrEqual(2);
  });

  it("only gives suppliers to contract owners", () => {
    const owners = people.filter((p) => p.role === "contract-owner").map((p) => p.id);
    for (const v of vendors) if (v.ownerId) expect(owners).toContain(v.ownerId);
  });

  it("includes the three demo suppliers", () => {
    for (const id of ["cloudmetric", "brightline", "orbis"]) {
      expect(vendors.find((v) => v.id === id)?.contractStatus).toBe("full");
    }
  });
});

describe("contracts", () => {
  it("has 12 contracts with unique ids", () => {
    expect(contracts).toHaveLength(12);
    expect(new Set(contracts.map((c) => c.id)).size).toBe(12);
  });

  it("matches each supplier's contract status", () => {
    for (const v of vendors) {
      const own = contracts.filter((c) => c.vendorId === v.id);
      if (v.contractStatus === "none") expect(own, v.id).toHaveLength(0);
      else expect(own.length, v.id).toBeGreaterThan(0);
      for (const c of own) expect(c.gap !== null, c.id).toBe(v.contractStatus === "partial");
    }
  });

  it("quotes every fact from its own clause text", () => {
    for (const c of contracts) checkFacts(c.facts, c.clauses, c.id);
  });

  it("has Pinecrest's term and notice Unknown and Kestrel's start date Bounded", () => {
    const all = contracts.flatMap((c) => c.facts.map((f) => ({ contract: c.id, ...f })));
    expect(all.filter((f) => f.label === "unknown").map((f) => [f.contract, f.field])).toEqual([
      ["pinecrest-msa", "termMonths"],
      ["pinecrest-msa", "noticeDays"],
    ]);
    expect(all.filter((f) => f.label === "bounded").map((f) => [f.contract, f.field])).toEqual([
      ["kestrel-marketing", "startDate"],
    ]);
  });

  it("labels each contract as its notes say: Datavane and Talentbridge confirmed, Kestrel Bounded, Pinecrest Unknown, the rest Derived", () => {
    const labels = Object.fromEntries(contracts.map((c) => [c.id, deadlineLabel(c.facts)]));
    expect(labels).toEqual({
      "cloudmetric-subscription": "derived",
      "datavane-subscription": "confirmed",
      "brightline-logistics": "derived",
      "swiftlane-transport": "derived",
      "orbis-facilities": "derived",
      "greenleaf-grounds": "derived",
      "ledgerline-payroll": "derived",
      "talentbridge-staffing": "confirmed",
      "quillstone-retainer": "derived",
      "arjun-rao-consultant": "derived",
      "kestrel-marketing": "bounded",
      "pinecrest-msa": "unknown",
    });
  });

  it("keeps every clause word for word as the file in docs/contracts has it, and credits the source", () => {
    const files = import.meta.glob<string>("/docs/contracts/[0-9][0-9]-*.md", { query: "?raw", import: "default", eager: true });
    const bodies = Object.values(files).map((text) => text.split("\n").filter((line) => /^(\d+\. |This )/.test(line)));
    expect(Object.keys(files)).toHaveLength(13);
    for (const c of contracts) {
      const lines = c.clauses.map((clause) => (clause.id === "0" ? clause.text : `${clause.id}. ${clause.heading}. ${clause.text}`));
      expect(bodies, c.id).toContainEqual(lines);
      expect(c.sourceNote, c.id).toMatch(/^Pattern source: Law Insider /);
    }
  });

  it("gives Cloudmetric an autorenewing yearly term with 60 days notice", () => {
    const facts = contracts.find((c) => c.id === "cloudmetric-subscription")!.facts;
    const value = (field: string) => facts.find((f) => f.field === field)?.value;
    expect(value("endDate")).toBe("2027-04-30");
    expect(value("renewalTermMonths")).toBe(12);
    expect(value("noticeDays")).toBe(60);
  });
});

describe("payments", () => {
  it("has about 60 lines with unique ids, all before the demo start", () => {
    expect(payments.length).toBeGreaterThanOrEqual(55);
    expect(payments.length).toBeLessThanOrEqual(65);
    expect(new Set(payments.map((p) => p.id)).size).toBe(payments.length);
    for (const p of payments) {
      expect(p.date).toMatch(ISO_DATE);
      expect(p.date < DEMO_START).toBe(true);
      expect(p.amount).toBeGreaterThan(0);
    }
  });

  it("pays every supplier at least once under one of its spellings", () => {
    for (const v of vendors) {
      expect(payments.some((p) => v.aliases.includes(p.payee)), v.id).toBe(true);
    }
  });

  it("pays Kestrel every March, which is what bounds its date", () => {
    const kestrel = vendors.find((v) => v.id === "kestrel")!;
    const months = payments.filter((p) => kestrel.aliases.includes(p.payee)).map((p) => p.date.slice(5, 7));
    expect(months).toEqual(["03", "03"]);
  });
});

describe("emails", () => {
  it("has five emails, each from a known supplier domain", () => {
    expect(emails).toHaveLength(5);
    const domains = vendors.flatMap((v) => v.emailDomains);
    for (const e of emails) expect(domains).toContain(e.from.address.split("@")[1]);
  });

  it("carries an Orbis amendment that replaces existing clauses", () => {
    const amendment = emails.find((e) => e.amendment)!.amendment!;
    const contract = contracts.find((c) => c.id === amendment.contractId)!;
    expect(contract.vendorId).toBe("orbis");
    for (const clause of amendment.clauses) {
      expect(contract.clauses.map((c) => c.id)).toContain(clause.id);
    }
    checkFacts(amendment.facts, amendment.clauses, "orbis amendment");
  });

  it("includes a Brightline invoice, a price rise and an email from a supplier with no contract", () => {
    const vendorOf = (address: string) =>
      vendors.find((v) => v.emailDomains.includes(address.split("@")[1]))!;
    expect(emails.some((e) => e.invoice && vendorOf(e.from.address).id === "brightline")).toBe(true);
    expect(emails.some((e) => e.priceChange)).toBe(true);
    expect(emails.some((e) => vendorOf(e.from.address).contractStatus === "none")).toBe(true);
  });
});
