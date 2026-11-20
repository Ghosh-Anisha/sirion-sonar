import { describe, expect, it } from "vitest";
import { people } from "../data/people";
import { modelReply, privacyDocument } from "../data/privacySample";
import { vendors } from "../data/vendors";
import { buildDictionary } from "./dictionary";
import { leakCheck, mask, restore } from "./mask";

const dictionary = buildDictionary(vendors, people, privacyDocument.recognisedNames);
const masked = mask(privacyDocument.text, dictionary);

describe("mask", () => {
  it("swaps supplier, company, people, contact and bank details for tokens", () => {
    expect(masked.text).toContain('between [SUPPLIER_1] ("Provider") and [COMPANY_1] ("Customer").');
    expect(masked.text).toContain("Notices go to [PERSON_1] at [EMAIL_1] for the Customer, and to [PERSON_2] at [EMAIL_2] or [PHONE_1] for Provider.");
    expect(masked.text).toContain("into [SUPPLIER_1]'s account [ACCOUNT_1], IFSC [IFSC_1].");
  });

  it("leaves dates and amounts in place, because code works those out", () => {
    for (const kept of ["1 May 2026", "30 April 2027", "sixty (60) days", "Rs 18,00,000", "twelve (12) months"]) {
      expect(masked.text).toContain(kept);
    }
  });

  it("gives every spelling of one supplier the same token", () => {
    expect(masked.tokens.filter((t) => t.kind === "SUPPLIER")).toEqual([{ token: "[SUPPLIER_1]", kind: "SUPPLIER", display: "Cloudmetric" }]);
  });

  it("passes the leak check", () => {
    expect(leakCheck(masked.text, dictionary)).toEqual([]);
    expect(leakCheck("Pay Cloudmetric at x@y.example", dictionary)).toEqual(["Cloudmetric", "x@y.example"]);
  });
});

describe("restore", () => {
  it("puts the real values back into the model's reply", () => {
    const restored = restore(modelReply, masked.tokens);
    expect(restored).toContain("Supplier: Cloudmetric");
    expect(restored).toContain("Send notice to: Anil Bhat, anil.bhat@cloudmetric.example, +91 98200 41177");
    expect(restored).toContain("Pays into: account 50200041177301, CLMB0004521");
    expect(restored).not.toMatch(/\[[A-Z]+_\d+\]/);
  });

  it("restores the masked document to the original exactly, apart from supplier spellings", () => {
    expect(restore(masked.text, masked.tokens)).toContain("Notices go to Neha Kulkarni at neha.kulkarni@haldenfoods.example");
  });

  it("refuses a token it never issued", () => {
    expect(() => restore("[PERSON_9]", masked.tokens)).toThrow();
  });

  it("finds every token the model used in the mask", () => {
    for (const token of modelReply.match(/\[[A-Z]+_\d+\]/g)!) {
      expect(masked.tokens.map((t) => t.token)).toContain(token);
    }
  });
});
