import { contracts } from "./contracts";
import { ORBIS_AMENDMENT_ARRIVES } from "./demo";
import { fact } from "./fact";
import type { Clause, Email } from "./types";

/*
 * The Orbis First Amendment, docs/contracts/06-orbis-first-amendment.md, as written.
 * Each of its clauses 1 to 3 changes one clause of the Facilities Services Agreement.
 */
const orbisAmendmentText: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This First Amendment is made on 10 November 2026 between Orbis Facility Services Private Limited (\"Contractor\") and Halden Foods Private Limited (\"Client\") and amends the Facilities Services Agreement dated 2 April 2024." },
  { id: "1", heading: "Term", page: 1, text: "Clause 2 is replaced with: The term runs until 31 March 2028." },
  { id: "2", heading: "Notice", page: 1, text: "In clause 3, ninety (90) days is replaced with one hundred and twenty (120) days." },
  { id: "3", heading: "Fees", page: 1, text: "In clause 4, the monthly fee of Rs 4,20,000 is replaced with Rs 4,41,000 from 1 December 2026." },
  { id: "4", heading: "Other terms", page: 1, text: "Every other term of the Agreement stays as it is." },
  { id: "5", heading: "Counterparts", page: 1, text: "This Amendment may be signed in counterparts, including by electronic signature." },
];

const orbisClause = (id: string): Clause => contracts.find((c) => c.id === "orbis-facilities")!.clauses.find((c) => c.id === id)!;
const amendmentLine = (id: string) => orbisAmendmentText.find((c) => c.id === id)!.text;

/** Swaps one phrase in a clause, as the amendment says. Fails loudly if the phrase is not there. */
function replaceIn(clause: Clause, from: string, to: string): Clause {
  if (!clause.text.includes(from)) throw new Error(`Clause ${clause.id} has no "${from}"`);
  return { ...clause, text: clause.text.replace(from, to) };
}

/** The agreement's clauses 2, 3 and 4 as they read once the amendment applies. */
const orbisAmendedClauses: Clause[] = [
  { ...orbisClause("2"), text: amendmentLine("1").replace("Clause 2 is replaced with: ", "") },
  replaceIn(orbisClause("3"), "ninety (90) days", "one hundred and twenty (120) days"),
  replaceIn(orbisClause("4"), "Rs 4,20,000,", "Rs 4,41,000 from 1 December 2026,"),
];

/*
 * Five sample emails, as they arrive in the shared inboxes.
 * The structured parts (invoice, deliveries, price change, amendment) are what
 * the email agent read out of each message. Totals and differences are computed
 * in src/logic.
 */
export const emails: Email[] = [
  {
    id: "ledgerline-price-rise",
    receivedOn: "2026-11-18",
    from: { name: "Priya Shetty", address: "accounts@ledgerline.example" },
    to: "ap@haldenfoods.example",
    subject: "Revised fees from January 2027",
    body: "Dear customer, because of higher compliance costs, the monthly fee for payroll processing will go up by 15%, from Rs 65,000 to Rs 74,750, from 1 January 2027. All other terms stay the same. Thank you for your continued business. Ledgerline Accounts",
    attachments: [],
    priceChange: {
      currentMonthlyFee: 65000,
      newMonthlyFee: 74750,
      effectiveFrom: "2027-01-01",
    },
  },
  {
    id: "orbis-amendment",
    receivedOn: ORBIS_AMENDMENT_ARRIVES,
    from: { name: "Sunil Rao", address: "sunil.rao@orbisfacility.example" },
    to: "procurement@haldenfoods.example",
    subject: "First Amendment to our facilities agreement",
    body: "Hi Farah, as discussed, attached is the First Amendment, signed on our side on 10 November. It extends the term to 31 March 2028, makes the notice period 120 days, and changes the monthly fee to Rs 4,41,000 from 1 December 2026. Please countersign when you can. Regards, Sunil",
    attachments: ["Orbis_First_Amendment_signed.pdf"],
    amendment: {
      contractId: "orbis-facilities",
      title: "First Amendment",
      signedOn: "2026-11-10",
      clauses: orbisAmendedClauses,
      facts: [
        fact(orbisAmendedClauses, "2", "endDate", "2028-03-31", "The term runs until 31 March 2028."),
        fact(orbisAmendedClauses, "3", "renewalTermMonths", 12, "The Agreement renews for successive twelve (12) month terms unless either party gives one hundred and twenty (120) days' written notice before the end of the current term."),
        fact(orbisAmendedClauses, "3", "noticeDays", 120, "The Agreement renews for successive twelve (12) month terms unless either party gives one hundred and twenty (120) days' written notice before the end of the current term."),
        fact(orbisAmendedClauses, "4", "monthlyFee", 441000, "The monthly fee is Rs 4,41,000 from 1 December 2026, invoiced at the start of each month and payable in thirty (30) days."),
      ],
    },
  },
  {
    id: "brightline-invoice",
    receivedOn: "2026-11-17",
    from: { name: "Brightline Billing", address: "billing@brightline-logistics.example" },
    to: "ap@haldenfoods.example",
    subject: "Invoice BL/26-27/0871 for October shipments",
    body: "Please find attached our invoice for 38 shipments by 10 tonne truck completed in October 2026, with the shipment log showing each distance. Payment is due in 45 days. Brightline Billing",
    attachments: ["BL-26-27-0871.pdf", "Shipment_log_Oct_2026.xlsx"],
    invoice: {
      number: "BL/26-27/0871",
      date: "2026-11-15",
      lines: [
        { description: "10 tonne truck, Gurugram plant to Jaipur DC, 8 shipments of 270 km", quantity: 2160, unitRate: 46 },
        { description: "10 tonne truck, Gurugram plant to Lucknow DC, 5 shipments of 560 km", quantity: 2800, unitRate: 46 },
        { description: "10 tonne truck, Gurugram plant to Chandigarh DC, 10 shipments of 255 km", quantity: 2550, unitRate: 46 },
        { description: "10 tonne truck, Sonipat plant to Ludhiana DC, 7 shipments of 280 km", quantity: 1960, unitRate: 46 },
        { description: "10 tonne truck, Gurugram plant to Indore DC, 4 shipments of 795 km", quantity: 3180, unitRate: 46 },
        { description: "10 tonne truck, Gurugram plant to Agra DC, 4 shipments of 250 km", quantity: 1000, unitRate: 46 },
      ],
    },
    deliveries: { month: "2026-10", trips: 38, onTime: 37 },
  },
  {
    id: "datavane-invoice",
    receivedOn: "2026-11-16",
    from: { name: "Datavane Accounts", address: "accounts@datavane.example" },
    to: "ap@haldenfoods.example",
    subject: "Invoice DV/26-27/0412, subscription year 2",
    body: "Hello, here is our invoice for the second year of your Datavane subscription, 1 September 2026 to 31 August 2027. Our move to a new billing system held it up, sorry for the delay. Invoices are due in 45 days. Thanks, Datavane Accounts",
    attachments: ["DV-26-27-0412.pdf"],
    invoice: {
      number: "DV/26-27/0412",
      date: "2026-11-16",
      lines: [{ description: "Datavane reporting suite, subscription year 1 Sep 2026 to 31 Aug 2027", quantity: 1, unitRate: 960000 }],
    },
  },
  {
    id: "bluepeak-invoice",
    receivedOn: "2026-11-16",
    from: { name: "Bluepeak Security", address: "billing@bluepeaksecurity.example" },
    to: "ap@haldenfoods.example",
    subject: "Invoice BPS-1142, guard services November",
    body: "Dear sir or madam, please find our invoice for two guards at the Sonipat plant for November 2026. Kindly arrange payment. Bluepeak Security",
    attachments: ["BPS-1142.pdf"],
    invoice: {
      number: "BPS-1142",
      date: "2026-11-16",
      lines: [{ description: "Security guard, 12 hour shift, November 2026", quantity: 2, unitRate: 28000 }],
    },
  },
];
