import { describe, expect, it } from "vitest";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { supplierPayments } from "./classify";
import { compareNames, groupNames, matchVendor, nameTokens, paymentsByVendor, vendorForEmail } from "./match";

describe("compareNames", () => {
  it("merges company-form variants", () => {
    expect(compareNames("ACME PVT LTD", "Acme Private Limited")).toBe("same");
    expect(compareNames("Orbis Facility Svcs", "ORBIS FACILITY SERVICES LLP")).toBe("same");
    expect(compareNames("Kestrel Freight Carriers Pvt Ltd", "KESTREL FREIGHT CARRIERS")).toBe("same");
  });

  it("merges spacing and plural differences", () => {
    expect(compareNames("Vantage Printworks", "VANTAGE PRINT WORKS")).toBe("same");
    expect(compareNames("Northstar Workspaces", "NORTHSTAR WORKSPACE PVT LTD")).toBe("same");
  });

  it("is unsure when one name has extra words", () => {
    expect(compareNames("Saffron Lane Creative Studio LLP", "SAFFRON LANE STUDIO")).toBe("unsure");
    expect(compareNames("Quillstone Legal Associates LLP", "QUILLSTONE LEGAL LLP")).toBe("unsure");
  });

  it("keeps different suppliers apart, even when they share a word", () => {
    expect(compareNames("MERIDIAN CAB SERVICES", "LOTUS HOUSEKEEPING SERVICES")).toBe("different");
    expect(compareNames("BRIGHTLINE LOGISTICS PVT LTD", "KESTREL FREIGHT CARRIERS")).toBe("different");
  });

  it("does not match on company-form words alone", () => {
    expect(nameTokens("PVT LTD")).toEqual([]);
    expect(compareNames("PVT LTD", "Private Limited")).toBe("different");
  });
});

describe("groupNames", () => {
  it("merges variants into one supplier and sends near misses to not sure", () => {
    const result = groupNames([
      "ACME PVT LTD",
      "Acme Private Limited",
      "SAFFRON LANE STUDIO",
      "Saffron Lane Creative Studio LLP",
      "COPPERLEAF COURIER",
    ]);
    expect(result.groups).toEqual([
      ["ACME PVT LTD", "Acme Private Limited"],
      ["SAFFRON LANE STUDIO"],
      ["Saffron Lane Creative Studio LLP"],
      ["COPPERLEAF COURIER"],
    ]);
    expect(result.unsure).toEqual([["SAFFRON LANE STUDIO", "Saffron Lane Creative Studio LLP"]]);
  });

  it("builds 24 suppliers from the sample supplier payments", () => {
    const names = supplierPayments(payments).map((p) => p.payee);
    const { groups, unsure } = groupNames(names);
    expect(groups.length - unsure.length).toBe(24);
  });
});

describe("matchVendor", () => {
  it("finds the vendor from any known spelling", () => {
    expect(matchVendor("Cloudmetric Software Private Limited", vendors)).toMatchObject({
      vendor: { id: "cloudmetric" },
      match: "same",
    });
  });

  it("returns an unsure match rather than guessing", () => {
    expect(matchVendor("Pinecrest Analytics Research LLP", vendors)).toMatchObject({ vendor: { id: "pinecrest" }, match: "unsure" });
  });

  it("returns null for a stranger", () => {
    expect(matchVendor("SALARY PAYOUT OCT-2026 BULK", vendors)).toBeNull();
  });
});

describe("vendorForEmail", () => {
  it("recognises the supplier from the email domain", () => {
    expect(vendorForEmail("billing@brightline-logistics.example", vendors)?.id).toBe("brightline");
    expect(vendorForEmail("someone@unknown.example", vendors)).toBeNull();
  });
});

describe("paymentsByVendor", () => {
  it("links every sample supplier payment to its vendor", () => {
    const linked = paymentsByVendor(supplierPayments(payments), vendors);
    expect(linked.size).toBe(24);
    expect([...linked.values()].flat()).toHaveLength(supplierPayments(payments).length);
  });
});
