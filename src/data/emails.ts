import { fact } from "./fact";
import type { Clause, Email } from "./types";

/** Amendment No. 1 to the Orbis agreement. Each clause replaces the clause with the same id. */
const orbisAmendmentClauses: Clause[] = [
  {
    id: "2",
    heading: "Term",
    page: 1,
    text: "It runs until 30 June 2027.",
  },
  {
    id: "3",
    heading: "Renewal",
    page: 1,
    text: "At the end of each term it renews for another 12 months. Either party may stop a renewal by giving notice at least 60 days before the term ends.",
  },
  {
    id: "5",
    heading: "Fees",
    page: 1,
    text: "The Customer will pay a monthly fee of Rs 3,45,000 from 1 December 2026.",
  },
];

/*
 * Five sample emails, as they arrive in the shared inboxes.
 * The structured parts (invoice, deliveries, price change, amendment) are what
 * the email agent read out of each message. Totals and differences are computed
 * in src/logic.
 */
export const emails: Email[] = [
  {
    id: "orbis-amendment",
    receivedOn: "2026-11-14",
    from: { name: "Sunil Rao", address: "sunil.rao@orbisfacility.example" },
    to: "procurement@tamarindhome.example",
    subject: "Amendment No. 1 to our facility agreement",
    body: "Hi Farah, as discussed, attached is Amendment No. 1, signed on our side. It moves the end of the current term to 30 June 2027 so it lines up with your financial year, changes the notice period to 60 days, and updates the monthly fee for the extra pantry staff from December. Please countersign when you can. Regards, Sunil",
    attachments: ["Orbis_Amendment_1_signed.pdf"],
    amendment: {
      contractId: "orbis-facilities",
      title: "Amendment No. 1",
      signedOn: "2026-11-13",
      clauses: orbisAmendmentClauses,
      facts: [
        fact(orbisAmendmentClauses, "2", "endDate", "2027-06-30", "It runs until 30 June 2027."),
        fact(orbisAmendmentClauses, "3", "renewalTermMonths", 12, "At the end of each term it renews for another 12 months."),
        fact(
          orbisAmendmentClauses,
          "3",
          "noticeDays",
          60,
          "Either party may stop a renewal by giving notice at least 60 days before the term ends.",
        ),
        fact(
          orbisAmendmentClauses,
          "5",
          "monthlyFee",
          345000,
          "The Customer will pay a monthly fee of Rs 3,45,000 from 1 December 2026.",
        ),
      ],
    },
  },
  {
    id: "ledgerline-price-rise",
    receivedOn: "2026-11-12",
    from: { name: "Priya Shetty", address: "accounts@ledgerline.example" },
    to: "ap@tamarindhome.example",
    subject: "Revised fees from January 2027",
    body: "Dear customer, because of higher compliance costs, from 1 January 2027 the monthly fee for payroll processing will be Rs 74,750. All other terms stay the same. Thank you for your continued business. Ledgerline Accounts",
    attachments: [],
    priceChange: {
      currentMonthlyFee: 65000,
      newMonthlyFee: 74750,
      effectiveFrom: "2027-01-01",
    },
  },
  {
    id: "brightline-invoice",
    receivedOn: "2026-11-17",
    from: { name: "Brightline Billing", address: "billing@brightline-logistics.example" },
    to: "ap@tamarindhome.example",
    subject: "Invoice BL/26-27/0871 for October trips",
    body: "Please find attached our invoice for 42 trips completed in October 2026, with the trip log. Payment is due in 30 days. Brightline Billing",
    attachments: ["BL-26-27-0871.pdf", "Trip_log_Oct_2026.xlsx"],
    invoice: {
      number: "BL/26-27/0871",
      date: "2026-11-15",
      lines: [{ description: "Full truck trip, Bhiwandi to Pune", quantity: 42, unitRate: 19800 }],
    },
    deliveries: { month: "2026-10", trips: 42, onTime: 38 },
  },
  {
    id: "greenleaf-invoice",
    receivedOn: "2026-11-15",
    from: { name: "Greenleaf Accounts", address: "accounts@greenleafpantry.example" },
    to: "ap@tamarindhome.example",
    subject: "Invoice GL-1123, pantry supply November",
    body: "Hello, our invoice for pantry supply and restocking for November 2026 is attached. Thanks, Greenleaf Accounts",
    attachments: ["GL-1123.pdf"],
    invoice: {
      number: "GL-1123",
      date: "2026-11-15",
      lines: [{ description: "Pantry supply and restocking, November 2026", quantity: 1, unitRate: 42000 }],
    },
  },
  {
    id: "bluepeak-invoice",
    receivedOn: "2026-11-16",
    from: { name: "Bluepeak Security", address: "billing@bluepeaksecurity.example" },
    to: "ap@tamarindhome.example",
    subject: "Invoice BPS-1142, guard services November",
    body: "Dear sir or madam, please find our invoice for two guards at the Bhiwandi warehouse for November 2026. Kindly arrange payment. Bluepeak Security",
    attachments: ["BPS-1142.pdf"],
    invoice: {
      number: "BPS-1142",
      date: "2026-11-16",
      lines: [{ description: "Security guard, 12 hour shift, November 2026", quantity: 2, unitRate: 28000 }],
    },
  },
];
