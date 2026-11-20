import { fact } from "./fact";
import type { Clause, Contract } from "./types";

/*
 * The 12 sample contracts, from docs/contracts. Each clause is the file's text as written,
 * split at its numbers. Clause 0 is the opening paragraph that names the parties.
 * Each fact quotes the sentence it comes from, word for word.
 * Facts hold only what the document says. End dates after renewals and
 * notice deadlines are computed in src/logic, never stored here.
 */

// docs/contracts/01-cloudmetric-saas-subscription.md
const cloudmetricClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 1 May 2026 between Cloudmetric Software Private Limited (\"Provider\") and Halden Foods Private Limited (\"Customer\")." },
  { id: "1", heading: "Subscription", page: 1, text: "Provider grants Customer a non-exclusive right to use the Cloudmetric analytics platform for up to 150 named users." },
  { id: "2", heading: "Term", page: 1, text: "The subscription starts on 1 May 2026 and runs for twelve (12) months, ending on 30 April 2027 (the \"Initial Term\")." },
  { id: "3", heading: "Renewal", page: 1, text: "After the Initial Term the subscription renews automatically for successive periods of twelve (12) months unless either party gives written notice of non-renewal at least sixty (60) days before the end of the current term." },
  { id: "4", heading: "Fees", page: 1, text: "The annual fee is Rs 18,00,000, invoiced yearly in advance and payable within thirty (30) days of the invoice date." },
  { id: "5", heading: "Price changes", page: 1, text: "Provider may raise the fee for a renewal term by no more than seven percent (7%), and only if it tells Customer in writing at least ninety (90) days before the current term ends." },
  { id: "6", heading: "Availability", page: 2, text: "Provider will keep the platform available 99.5% of each month, excluding planned maintenance. If availability falls below that level, Customer receives a credit of 5% of the monthly fee for each full percentage point missed." },
  { id: "7", heading: "Support", page: 2, text: "Provider answers critical issues within four (4) business hours and other issues within two (2) business days." },
  { id: "8", heading: "Termination", page: 2, text: "Either party may end this Agreement for an uncured material breach on thirty (30) days' written notice." },
  { id: "9", heading: "Data", page: 2, text: "Customer owns its data. On termination Provider returns it within thirty (30) days and then deletes it." },
  { id: "10", heading: "Law", page: 2, text: "Indian law applies. Courts in Bengaluru have jurisdiction." },
];

// docs/contracts/02-datavane-analytics-subscription.md
const datavaneClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 1 September 2025 between Datavane Analytics Private Limited (\"Datavane\") and Halden Foods Private Limited (\"Customer\")." },
  { id: "1", heading: "Services", page: 1, text: "Datavane provides the Datavane reporting suite described in Order Form 1, attached." },
  { id: "2", heading: "Initial term", page: 1, text: "The first subscription term is twenty-four (24) months from 1 September 2025 and ends on 31 August 2027." },
  { id: "3", heading: "Automatic renewal", page: 1, text: "Unless a party ends the subscription by written notice three (3) months before the end of a term, the subscription renews for a further twelve (12) months." },
  { id: "4", heading: "Fees", page: 1, text: "The fee is Rs 9,60,000 a year, billed annually in advance. Invoices are due in forty-five (45) days." },
  { id: "5", heading: "Price on renewal", page: 1, text: "The renewal price equals the price of the prior term unless Datavane gives written notice of an increase at least ninety (90) days before the end of that term." },
  { id: "6", heading: "Support", page: 2, text: "Support is provided on business days from 9 am to 6 pm IST. Datavane responds to urgent requests within one (1) business day." },
  { id: "7", heading: "Termination for cause", page: 2, text: "Either party may terminate for a material breach not fixed within thirty (30) days of written notice." },
  { id: "8", heading: "Confidentiality", page: 2, text: "Each party keeps the other's non-public information confidential for three (3) years after this Agreement ends." },
  { id: "9", heading: "Law", page: 2, text: "Indian law applies." },
];

// docs/contracts/03-brightline-logistics-msa.md
const brightlineClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 1 July 2025 between Brightline Logistics Private Limited (\"Carrier\") and Halden Foods Private Limited (\"Shipper\")." },
  { id: "1", heading: "Services", page: 1, text: "Carrier moves the Shipper's goods between its plants and distribution centres under shipment orders placed through the Carrier portal." },
  { id: "2", heading: "Term", page: 1, text: "The Agreement runs for twenty-four (24) months from 1 July 2025 to 30 June 2027." },
  { id: "3", heading: "Renewal", page: 1, text: "It then renews for successive twelve (12) month periods unless either party gives written notice at least ninety (90) days before the end of the current term." },
  { id: "4", heading: "Rates", page: 1, text: "The agreed rate is Rs 42 per kilometre for a 10 tonne truck and Rs 58 per kilometre for a 20 tonne truck. Waiting time beyond four (4) hours is charged at Rs 650 per hour." },
  { id: "5", heading: "Fuel surcharge", page: 1, text: "Carrier may add a fuel surcharge that tracks the published diesel price, capped at six percent (6%) of the freight charge." },
  { id: "6", heading: "Invoices", page: 2, text: "Carrier invoices monthly. An invoice must list each shipment, the distance and the rate applied. Shipper pays within forty-five (45) days of receiving a correct invoice and may withhold a disputed amount." },
  { id: "7", heading: "Service level", page: 2, text: "Carrier delivers at least ninety-five percent (95%) of shipments by the committed delivery date each month." },
  { id: "8", heading: "Service credits", page: 2, text: "For each full percentage point below the service level, Carrier credits Shipper two percent (2%) of that month's freight charges, up to a maximum of twenty percent (20%)." },
  { id: "9", heading: "Damage", page: 2, text: "Carrier is liable for loss or damage in transit up to the invoice value of the goods." },
  { id: "10", heading: "Termination", page: 2, text: "Either party may terminate on sixty (60) days' notice if the service level is missed in three consecutive months." },
  { id: "11", heading: "Law", page: 2, text: "Indian law applies." },
];

// docs/contracts/04-swiftlane-freight-transport.md
const swiftlaneClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 1 February 2026 between Swiftlane Freight Private Limited (\"Swiftlane\") and Halden Foods Private Limited (\"Customer\")." },
  { id: "1", heading: "Scope", page: 1, text: "Swiftlane carries parcels and pallets on the express lanes listed in Schedule A." },
  { id: "2", heading: "Term", page: 1, text: "This Agreement runs from 1 February 2026 for twelve (12) months and ends on 31 January 2027." },
  { id: "3", heading: "Renewal", page: 1, text: "It renews for a further twelve (12) months unless a party gives thirty (30) days' written notice before the end of the term." },
  { id: "4", heading: "Rates", page: 1, text: "Express lane freight is charged at Rs 3.10 per kilogram, with a minimum of Rs 450 per consignment." },
  { id: "5", heading: "Delivery", page: 1, text: "Swiftlane delivers express consignments within two (2) business days of pickup. For each late consignment Customer receives a credit of ten percent (10%) of that consignment's charge." },
  { id: "6", heading: "Payment", page: 2, text: "Invoices are monthly and due in thirty (30) days." },
  { id: "7", heading: "Claims", page: 2, text: "Customer reports damage or loss within seven (7) days of delivery." },
  { id: "8", heading: "Termination", page: 2, text: "Either party may end this Agreement on thirty (30) days' written notice for a material breach left unfixed." },
];

// docs/contracts/05-orbis-facility-services.md
const orbisClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 2 April 2024 between Orbis Facility Services Private Limited (\"Contractor\") and Halden Foods Private Limited (\"Client\")." },
  { id: "1", heading: "Services", page: 1, text: "Contractor provides housekeeping, electrical and plumbing maintenance and pantry services at the Client's head office in Gurugram, as listed in Schedule 1." },
  { id: "2", heading: "Term", page: 1, text: "The term is three (3) years from 2 April 2024 to 1 April 2027." },
  { id: "3", heading: "Renewal", page: 1, text: "The Agreement renews for successive twelve (12) month terms unless either party gives ninety (90) days' written notice before the end of the current term." },
  { id: "4", heading: "Fees", page: 1, text: "The monthly fee is Rs 4,20,000, invoiced at the start of each month and payable in thirty (30) days." },
  { id: "5", heading: "Annual review", page: 1, text: "The fee may be revised once a year by agreement, and by no more than five percent (5%) without Client's written consent." },
  { id: "6", heading: "Service levels", page: 2, text: "Contractor attends urgent faults within two (2) hours and routine requests within one (1) business day. Missed response times in a month are listed in the monthly report." },
  { id: "7", heading: "Staff", page: 2, text: "Contractor supplies trained staff and is responsible for their wages, insurance and statutory payments." },
  { id: "8", heading: "Termination", page: 2, text: "Client may terminate for repeated service failures (four or more missed urgent responses in a quarter) on thirty (30) days' notice." },
  { id: "9", heading: "Law", page: 2, text: "Indian law applies." },
];

// docs/contracts/07-greenleaf-grounds-maintenance.md
const greenleafClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 1 January 2025 between Greenleaf Landscaping LLP (\"Contractor\") and Halden Foods Private Limited (\"Client\")." },
  { id: "1", heading: "Services", page: 1, text: "Contractor maintains the lawns, trees and paths at the Client's three campuses listed in Schedule A." },
  { id: "2", heading: "Term", page: 1, text: "The first term is one (1) year from 1 January 2025 to 31 December 2025." },
  { id: "3", heading: "Renewal", page: 1, text: "The Client may renew the Agreement for a further year, up to four (4) times, by written confirmation given at least thirty (30) days before the end of the current year. If the Client gives no confirmation, the Agreement ends." },
  { id: "4", heading: "Fee", page: 1, text: "The annual fee is Rs 6,00,000, paid in four equal quarterly instalments." },
  { id: "5", heading: "Standards", page: 1, text: "Contractor visits each campus twice a week and keeps a visit log." },
  { id: "6", heading: "Termination", page: 2, text: "Client may terminate at any time on sixty (60) days' written notice." },
];

// docs/contracts/08-ledgerline-payroll-services.md
const ledgerlineClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 1 January 2026 between Ledgerline Payroll Services Private Limited (\"Ledgerline\") and Halden Foods Private Limited (\"Client\")." },
  { id: "1", heading: "Services", page: 1, text: "Ledgerline runs the Client's monthly payroll, prepares statutory returns and issues payslips." },
  { id: "2", heading: "Term", page: 1, text: "The Agreement runs for one (1) year ending on 31 December 2026." },
  { id: "3", heading: "Renewal", page: 1, text: "It renews for further terms of twelve (12) months unless either party gives written notice thirty (30) days before the end of the current term." },
  { id: "4", heading: "Fees", page: 1, text: "The service fee is Rs 65,000 a month, invoiced monthly and due in fifteen (15) days." },
  { id: "5", heading: "Increases", page: 1, text: "Ledgerline may increase the fee for a renewal term by no more than five percent (5%), and only if it gives written notice at least sixty (60) days before the end of the current term." },
  { id: "6", heading: "Accuracy", page: 2, text: "If an error by Ledgerline causes a late filing, Ledgerline pays the resulting penalty." },
  { id: "7", heading: "Data", page: 2, text: "Ledgerline keeps employee data confidential and deletes it on request after termination." },
  { id: "8", heading: "Termination", page: 2, text: "Either party may terminate for uncured material breach on thirty (30) days' notice." },
];

// docs/contracts/09-talentbridge-staffing.md
const talentbridgeClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 1 July 2026 between Talentbridge Staffing Private Limited (\"Agency\") and Halden Foods Private Limited (\"Client\")." },
  { id: "1", heading: "Services", page: 1, text: "Agency supplies temporary workers for warehouse, data entry and customer support roles on written requests from the Client." },
  { id: "2", heading: "Term", page: 1, text: "The Agreement runs for twelve (12) months from 1 July 2026 to 30 June 2027." },
  { id: "3", heading: "Renewal", page: 1, text: "It renews for further twelve (12) month terms unless a party gives written notice forty-five (45) days before the end of the term." },
  { id: "4", heading: "Charges", page: 1, text: "Client pays Agency the worker's pay cost plus a markup of eighteen percent (18%). Agency invoices every two weeks against signed timesheets." },
  { id: "5", heading: "Employer duties", page: 1, text: "Agency is the employer of each worker and handles wages, insurance and statutory payments." },
  { id: "6", heading: "Replacement", page: 2, text: "Agency replaces an unsuitable worker within three (3) business days of a request, at no extra charge." },
  { id: "7", heading: "Conversion", page: 2, text: "If Client hires an Agency worker within six (6) months of placement, Client pays a conversion fee of 8.33% of the worker's annual pay." },
  { id: "8", heading: "Termination", page: 2, text: "Either party may terminate on thirty (30) days' notice for uncured material breach." },
];

// docs/contracts/10-quillstone-legal-retainer.md
const quillstoneClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 1 January 2026 between Quillstone Legal LLP (\"Firm\") and Halden Foods Private Limited (\"Client\")." },
  { id: "1", heading: "Services", page: 1, text: "Firm provides general commercial legal advice, up to forty (40) hours a month." },
  { id: "2", heading: "Term", page: 1, text: "The retainer runs from 1 January 2026 to 31 December 2026." },
  { id: "3", heading: "Renewal", page: 1, text: "It renews for a further twelve (12) months unless either party gives twenty-one (21) days' written notice before the end of the term." },
  { id: "4", heading: "Fees", page: 1, text: "Client pays a monthly retainer of Rs 2,50,000. Hours above forty (40) in a month are charged at Rs 7,500 per hour." },
  { id: "5", heading: "Conflicts", page: 1, text: "Firm will tell Client promptly of any conflict of interest." },
  { id: "6", heading: "Termination", page: 2, text: "Either party may end the retainer on thirty (30) days' written notice." },
];

// docs/contracts/11-kestrel-creative-marketing-scan.md. The file also carries the marks [scan quality: low, page 1 of 2] [page 2 not scanned], kept in the gap note.
const kestrelClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on [illegible] March 2025 between Kestrel Creative Agency (\"Agency\") and Halden Foods Private Limited (\"Client\")." },
  { id: "1", heading: "Services", page: 1, text: "Agency produces campaign creative, social content and monthly performance reports." },
  { id: "2", heading: "Term", page: 1, text: "The Agreement runs for twelve (12) months from the date written above." },
  { id: "3", heading: "Renewal", page: 1, text: "It renews for further twelve (12) month terms unless either party gives thirty (30) days' notice before the end of the term." },
  { id: "4", heading: "Fees", page: 1, text: "The annual retainer is Rs 7,20,000, payable in one instalment in [illegible]." },
  { id: "5", heading: "Ownership", page: 1, text: "Client owns all creative produced and paid for under this Agreement." },
  { id: "6", heading: "Approvals", page: 1, text: "Agency submits drafts for Client approval before publishing." },
];

// docs/contracts/12-pinecrest-master-agreement-missing-order-form.md. The file also carries the marks [Schedule 1 is not attached to this copy.], kept in the gap note.
const pinecrestClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Master Supply Agreement is made on 12 August 2025 between Pinecrest Industrial Supplies Private Limited (\"Supplier\") and Halden Foods Private Limited (\"Buyer\")." },
  { id: "1", heading: "Supply", page: 1, text: "Supplier sells packaging materials and spare parts to Buyer on Order Forms signed by both parties." },
  { id: "2", heading: "Term", page: 1, text: "The term of each supply arrangement, any renewal and any notice period are set out in the applicable Order Form." },
  { id: "3", heading: "Prices", page: 1, text: "Prices are listed in the applicable Order Form and are fixed for its term." },
  { id: "4", heading: "Delivery", page: 1, text: "Supplier delivers within the lead time stated in the Order Form." },
  { id: "5", heading: "Payment", page: 1, text: "Buyer pays undisputed invoices within thirty (30) days." },
  { id: "6", heading: "Quality", page: 1, text: "Buyer may reject goods that do not meet the specification within ten (10) days of delivery." },
  { id: "7", heading: "Order Form 1", page: 1, text: "Attached as Schedule 1." },
];

// docs/contracts/13-arjun-rao-independent-consultant.md
const arjunRaoClauses: Clause[] = [
  { id: "0", heading: "Parties", page: 1, text: "This Agreement is made on 1 September 2026 between Arjun Rao (\"Consultant\") and Halden Foods Private Limited (\"Client\")." },
  { id: "1", heading: "Services", page: 1, text: "Consultant reviews the Client's warehouse process and delivers a written recommendation report." },
  { id: "2", heading: "Term", page: 1, text: "The Agreement runs for six (6) months, from 1 September 2026 to 28 February 2027, and does not renew automatically." },
  { id: "3", heading: "Fees", page: 1, text: "Client pays Rs 1,80,000 on each of three milestones: kickoff, draft report and final report." },
  { id: "4", heading: "Independence", page: 1, text: "Consultant works as an independent contractor and not as an employee." },
  { id: "5", heading: "Confidentiality", page: 1, text: "Consultant keeps the Client's information confidential during and after the Agreement." },
  { id: "6", heading: "Ownership", page: 2, text: "Client owns the final report." },
  { id: "7", heading: "Termination", page: 2, text: "Either party may end the Agreement on fifteen (15) days' notice, and Client pays for work done to that date." },
];


/** Facts an owner has already checked against the contract. */
const checkedBy = (personId: string) => ({ label: "confirmed" as const, confirmedBy: personId });
const datavaneChecked = checkedBy("neha");
const talentbridgeChecked = checkedBy("rohan");

export const contracts: Contract[] = [
  {
    id: "cloudmetric-subscription",
    vendorId: "cloudmetric",
    title: "Cloudmetric analytics subscription",
    documentType: "agreement",
    fileName: "Contracts/Software/Cloudmetric_SaaS_Subscription_2026.pdf",
    clauses: cloudmetricClauses,
    facts: [
      fact(cloudmetricClauses, "2", "startDate", "2026-05-01", 'The subscription starts on 1 May 2026 and runs for twelve (12) months, ending on 30 April 2027 (the "Initial Term").'),
      fact(cloudmetricClauses, "2", "endDate", "2027-04-30", 'The subscription starts on 1 May 2026 and runs for twelve (12) months, ending on 30 April 2027 (the "Initial Term").'),
      fact(cloudmetricClauses, "3", "renewalTermMonths", 12, "After the Initial Term the subscription renews automatically for successive periods of twelve (12) months unless either party gives written notice of non-renewal at least sixty (60) days before the end of the current term."),
      fact(cloudmetricClauses, "3", "noticeDays", 60, "After the Initial Term the subscription renews automatically for successive periods of twelve (12) months unless either party gives written notice of non-renewal at least sixty (60) days before the end of the current term."),
      fact(cloudmetricClauses, "4", "annualFee", 1800000, "The annual fee is Rs 18,00,000, invoiced yearly in advance and payable within thirty (30) days of the invoice date."),
      fact(cloudmetricClauses, "5", "priceCapPercent", 7, "Provider may raise the fee for a renewal term by no more than seven percent (7%), and only if it tells Customer in writing at least ninety (90) days before the current term ends."),
      fact(cloudmetricClauses, "5", "priceNoticeDays", 90, "Provider may raise the fee for a renewal term by no more than seven percent (7%), and only if it tells Customer in writing at least ninety (90) days before the current term ends."),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider SaaS subscription samples and the automatic renewal clause pages (https://www.lawinsider.com/contracts/tagged/software-as-a-service-subscription-agreement, https://www.lawinsider.com/clause/automatic-renewal). Wording rewritten, parties fictional.",
  },
  {
    id: "datavane-subscription",
    vendorId: "datavane",
    title: "Datavane reporting subscription",
    documentType: "agreement",
    fileName: "Contracts/Software/Datavane_Master_Subscription_2025.pdf",
    clauses: datavaneClauses,
    facts: [
      fact(datavaneClauses, "2", "startDate", "2025-09-01", "The first subscription term is twenty-four (24) months from 1 September 2025 and ends on 31 August 2027.", datavaneChecked),
      fact(datavaneClauses, "2", "endDate", "2027-08-31", "The first subscription term is twenty-four (24) months from 1 September 2025 and ends on 31 August 2027.", datavaneChecked),
      fact(datavaneClauses, "3", "renewalTermMonths", 12, "Unless a party ends the subscription by written notice three (3) months before the end of a term, the subscription renews for a further twelve (12) months.", datavaneChecked),
      fact(datavaneClauses, "3", "noticeMonths", 3, "Unless a party ends the subscription by written notice three (3) months before the end of a term, the subscription renews for a further twelve (12) months.", datavaneChecked),
      fact(datavaneClauses, "4", "annualFee", 960000, "The fee is Rs 9,60,000 a year, billed annually in advance.", datavaneChecked),
      fact(datavaneClauses, "5", "priceNoticeDays", 90, "The renewal price equals the price of the prior term unless Datavane gives written notice of an increase at least ninety (90) days before the end of that term.", datavaneChecked),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider automatic renewal and price increase notice clause pages (https://www.lawinsider.com/clause/automatic-renewal/_10, https://lawinsider.com/clause/term-of-subscriptions/_8). Wording rewritten, parties fictional.",
  },
  {
    id: "brightline-logistics",
    vendorId: "brightline",
    title: "Brightline logistics services",
    documentType: "agreement",
    fileName: "Ops/Vendors/Brightline/Brightline_Master_Logistics_Agreement_signed.pdf",
    clauses: brightlineClauses,
    facts: [
      fact(brightlineClauses, "2", "startDate", "2025-07-01", "The Agreement runs for twenty-four (24) months from 1 July 2025 to 30 June 2027."),
      fact(brightlineClauses, "2", "endDate", "2027-06-30", "The Agreement runs for twenty-four (24) months from 1 July 2025 to 30 June 2027."),
      fact(brightlineClauses, "3", "renewalTermMonths", 12, "It then renews for successive twelve (12) month periods unless either party gives written notice at least ninety (90) days before the end of the current term."),
      fact(brightlineClauses, "3", "noticeDays", 90, "It then renews for successive twelve (12) month periods unless either party gives written notice at least ninety (90) days before the end of the current term."),
      fact(brightlineClauses, "4", "unitRate", 42, "The agreed rate is Rs 42 per kilometre for a 10 tonne truck and Rs 58 per kilometre for a 20 tonne truck.", { unit: "per km for a 10 tonne truck" }),
      fact(brightlineClauses, "5", "surchargeCapPercent", 6, "Carrier may add a fuel surcharge that tracks the published diesel price, capped at six percent (6%) of the freight charge."),
      fact(brightlineClauses, "7", "slaOnTimePercent", 95, "Carrier delivers at least ninety-five percent (95%) of shipments by the committed delivery date each month."),
      fact(brightlineClauses, "8", "slaCreditPercent", 2, "For each full percentage point below the service level, Carrier credits Shipper two percent (2%) of that month's freight charges, up to a maximum of twenty percent (20%).", { unit: "of the month's freight for each full point below" }),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider logistics and master transportation services samples (https://www.lawinsider.com/contracts/tagged/logistics-services-agreement, https://www.lawinsider.com/contracts/tagged/master-transportation-services-agreement). Wording rewritten, parties fictional.",
  },
  {
    id: "swiftlane-transport",
    vendorId: "swiftlane",
    title: "Swiftlane express freight",
    documentType: "agreement",
    fileName: "Ops/Vendors/Swiftlane/Swiftlane_Transportation_Agreement_2026.pdf",
    clauses: swiftlaneClauses,
    facts: [
      fact(swiftlaneClauses, "2", "startDate", "2026-02-01", "This Agreement runs from 1 February 2026 for twelve (12) months and ends on 31 January 2027."),
      fact(swiftlaneClauses, "2", "endDate", "2027-01-31", "This Agreement runs from 1 February 2026 for twelve (12) months and ends on 31 January 2027."),
      fact(swiftlaneClauses, "3", "renewalTermMonths", 12, "It renews for a further twelve (12) months unless a party gives thirty (30) days' written notice before the end of the term."),
      fact(swiftlaneClauses, "3", "noticeDays", 30, "It renews for a further twelve (12) months unless a party gives thirty (30) days' written notice before the end of the term."),
      fact(swiftlaneClauses, "4", "unitRate", 3.1, "Express lane freight is charged at Rs 3.10 per kilogram, with a minimum of Rs 450 per consignment.", { unit: "per kg" }),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider transportation services agreement samples (https://www.lawinsider.com:443/contracts/tagged/transportation-services-agreement). Wording rewritten, parties fictional.",
  },
  {
    id: "orbis-facilities",
    vendorId: "orbis",
    title: "Orbis facilities services",
    documentType: "agreement",
    fileName: "Admin/Facilities/Orbis_Facilities_Agreement_Apr2024.pdf",
    clauses: orbisClauses,
    facts: [
      // The start is read from the opening paragraph, which the amendment leaves alone.
      fact(orbisClauses, "0", "startDate", "2024-04-02", 'This Agreement is made on 2 April 2024 between Orbis Facility Services Private Limited ("Contractor") and Halden Foods Private Limited ("Client").'),
      fact(orbisClauses, "2", "endDate", "2027-04-01", "The term is three (3) years from 2 April 2024 to 1 April 2027."),
      fact(orbisClauses, "3", "renewalTermMonths", 12, "The Agreement renews for successive twelve (12) month terms unless either party gives ninety (90) days' written notice before the end of the current term."),
      fact(orbisClauses, "3", "noticeDays", 90, "The Agreement renews for successive twelve (12) month terms unless either party gives ninety (90) days' written notice before the end of the current term."),
      fact(orbisClauses, "4", "monthlyFee", 420000, "The monthly fee is Rs 4,20,000, invoiced at the start of each month and payable in thirty (30) days."),
      fact(orbisClauses, "5", "priceCapPercent", 5, "The fee may be revised once a year by agreement, and by no more than five percent (5%) without Client's written consent."),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider facilities services and maintenance agreement samples (https://www.lawinsider.com/contracts/tagged/facilities-services-agreement, https://www.lawinsider.com/contracts/tagged/agreement-for-maintenance-services). Wording rewritten, parties fictional.",
  },
  {
    id: "greenleaf-grounds",
    vendorId: "greenleaf",
    title: "Greenleaf grounds maintenance",
    documentType: "agreement",
    fileName: "Admin/Facilities/Greenleaf_Grounds_Maintenance_2025.pdf",
    clauses: greenleafClauses,
    facts: [
      fact(greenleafClauses, "2", "startDate", "2025-01-01", "The first term is one (1) year from 1 January 2025 to 31 December 2025."),
      fact(greenleafClauses, "2", "endDate", "2025-12-31", "The first term is one (1) year from 1 January 2025 to 31 December 2025."),
      fact(greenleafClauses, "3", "renewalOptionMonths", 12, "The Client may renew the Agreement for a further year, up to four (4) times, by written confirmation given at least thirty (30) days before the end of the current year."),
      fact(greenleafClauses, "3", "noticeDays", 30, "The Client may renew the Agreement for a further year, up to four (4) times, by written confirmation given at least thirty (30) days before the end of the current year."),
      fact(greenleafClauses, "4", "annualFee", 600000, "The annual fee is Rs 6,00,000, paid in four equal quarterly instalments."),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider grounds maintenance samples describing annual renewal up to five years (https://lawinsider.com/contracts/tagged/grounds-maintenance-services-agreement). Wording rewritten, parties fictional.",
  },
  {
    id: "ledgerline-payroll",
    vendorId: "ledgerline",
    title: "Ledgerline payroll services",
    documentType: "agreement",
    fileName: "Finance/Payroll/Ledgerline_Services_Agreement_2026.pdf",
    clauses: ledgerlineClauses,
    facts: [
      fact(ledgerlineClauses, "0", "startDate", "2026-01-01", 'This Agreement is made on 1 January 2026 between Ledgerline Payroll Services Private Limited ("Ledgerline") and Halden Foods Private Limited ("Client").'),
      fact(ledgerlineClauses, "2", "endDate", "2026-12-31", "The Agreement runs for one (1) year ending on 31 December 2026."),
      fact(ledgerlineClauses, "3", "renewalTermMonths", 12, "It renews for further terms of twelve (12) months unless either party gives written notice thirty (30) days before the end of the current term."),
      fact(ledgerlineClauses, "3", "noticeDays", 30, "It renews for further terms of twelve (12) months unless either party gives written notice thirty (30) days before the end of the current term."),
      fact(ledgerlineClauses, "4", "monthlyFee", 65000, "The service fee is Rs 65,000 a month, invoiced monthly and due in fifteen (15) days."),
      fact(ledgerlineClauses, "5", "priceCapPercent", 5, "Ledgerline may increase the fee for a renewal term by no more than five percent (5%), and only if it gives written notice at least sixty (60) days before the end of the current term."),
      fact(ledgerlineClauses, "5", "priceNoticeDays", 60, "Ledgerline may increase the fee for a renewal term by no more than five percent (5%), and only if it gives written notice at least sixty (60) days before the end of the current term."),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider services agreement and automatic renewal clause samples (https://www.lawinsider.com/clause/auto-renewal). Wording rewritten, parties fictional.",
  },
  {
    id: "talentbridge-staffing",
    vendorId: "talentbridge",
    title: "Talentbridge staffing services",
    documentType: "agreement",
    fileName: "HR/Agencies/Talentbridge_Staffing_Agreement_2026.pdf",
    clauses: talentbridgeClauses,
    facts: [
      fact(talentbridgeClauses, "2", "startDate", "2026-07-01", "The Agreement runs for twelve (12) months from 1 July 2026 to 30 June 2027.", talentbridgeChecked),
      fact(talentbridgeClauses, "2", "endDate", "2027-06-30", "The Agreement runs for twelve (12) months from 1 July 2026 to 30 June 2027.", talentbridgeChecked),
      fact(talentbridgeClauses, "3", "renewalTermMonths", 12, "It renews for further twelve (12) month terms unless a party gives written notice forty-five (45) days before the end of the term.", talentbridgeChecked),
      fact(talentbridgeClauses, "3", "noticeDays", 45, "It renews for further twelve (12) month terms unless a party gives written notice forty-five (45) days before the end of the term.", talentbridgeChecked),
      fact(talentbridgeClauses, "4", "markupPercent", 18, "Client pays Agency the worker's pay cost plus a markup of eighteen percent (18%).", talentbridgeChecked),
      fact(talentbridgeClauses, "7", "conversionFeePercent", 8.33, "If Client hires an Agency worker within six (6) months of placement, Client pays a conversion fee of 8.33% of the worker's annual pay.", talentbridgeChecked),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider staffing agreement samples (https://lawinsider.com/contracts/tagged/staffing-agreement). Wording rewritten, parties fictional.",
  },
  {
    id: "quillstone-retainer",
    vendorId: "quillstone",
    title: "Quillstone legal retainer",
    documentType: "agreement",
    fileName: "Legal/Retainers/Quillstone_Retainer_2026.pdf",
    clauses: quillstoneClauses,
    facts: [
      fact(quillstoneClauses, "2", "startDate", "2026-01-01", "The retainer runs from 1 January 2026 to 31 December 2026."),
      fact(quillstoneClauses, "2", "endDate", "2026-12-31", "The retainer runs from 1 January 2026 to 31 December 2026."),
      fact(quillstoneClauses, "3", "renewalTermMonths", 12, "It renews for a further twelve (12) months unless either party gives twenty-one (21) days' written notice before the end of the term."),
      fact(quillstoneClauses, "3", "noticeDays", 21, "It renews for a further twelve (12) months unless either party gives twenty-one (21) days' written notice before the end of the term."),
      fact(quillstoneClauses, "4", "monthlyFee", 250000, "Client pays a monthly retainer of Rs 2,50,000."),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider consulting and independent contractor agreement samples. Wording rewritten, parties fictional.",
  },
  {
    id: "arjun-rao-consultant",
    vendorId: "arjun-rao",
    title: "Arjun Rao consulting agreement",
    documentType: "agreement",
    fileName: "Ops/Consultants/Arjun_Rao_Consultant_Agreement_2026.pdf",
    clauses: arjunRaoClauses,
    facts: [
      fact(arjunRaoClauses, "2", "startDate", "2026-09-01", "The Agreement runs for six (6) months, from 1 September 2026 to 28 February 2027, and does not renew automatically."),
      fact(arjunRaoClauses, "2", "endDate", "2027-02-28", "The Agreement runs for six (6) months, from 1 September 2026 to 28 February 2027, and does not renew automatically."),
      fact(arjunRaoClauses, "3", "unitRate", 180000, "Client pays Rs 1,80,000 on each of three milestones: kickoff, draft report and final report.", { unit: "per milestone" }),
    ],
    gap: null,
    sourceNote: "Pattern source: Law Insider independent contractor agreement samples. Wording rewritten, party fictional.",
  },
  {
    id: "kestrel-marketing",
    vendorId: "kestrel",
    title: "Kestrel marketing services (scan)",
    documentType: "scan",
    fileName: "Marketing/Scans/SCAN_0047.pdf",
    clauses: kestrelClauses,
    facts: [
      fact(kestrelClauses, "0", "startDate", null, 'This Agreement is made on [illegible] March 2025 between Kestrel Creative Agency ("Agency") and Halden Foods Private Limited ("Client").', { label: "bounded" }),
      fact(kestrelClauses, "2", "termMonths", 12, "The Agreement runs for twelve (12) months from the date written above."),
      fact(kestrelClauses, "3", "renewalTermMonths", 12, "It renews for further twelve (12) month terms unless either party gives thirty (30) days' notice before the end of the term."),
      fact(kestrelClauses, "3", "noticeDays", 30, "It renews for further twelve (12) month terms unless either party gives thirty (30) days' notice before the end of the term."),
      fact(kestrelClauses, "4", "annualFee", 720000, "The annual retainer is Rs 7,20,000, payable in one instalment in [illegible]."),
    ],
    gap: "Scan quality is low and only page 1 of 2 was scanned. The day it was signed is unreadable, and Kestrel is paid once a year in March, so each term most likely starts in March.",
    sourceNote: "Pattern source: Law Insider marketing services samples. Wording rewritten, parties fictional.",
  },
  {
    id: "pinecrest-msa",
    vendorId: "pinecrest",
    title: "Pinecrest master supply agreement",
    documentType: "master-agreement",
    fileName: "Procurement/Pinecrest/Pinecrest_Master_Supply_Agreement_2025.pdf",
    clauses: pinecrestClauses,
    facts: [
      // The master agreement's own date. The Order Form's term, once someone types it in, runs from here.
      fact(pinecrestClauses, "0", "startDate", "2025-08-12", 'This Master Supply Agreement is made on 12 August 2025 between Pinecrest Industrial Supplies Private Limited ("Supplier") and Halden Foods Private Limited ("Buyer").'),
      fact(pinecrestClauses, "2", "termMonths", null, "The term of each supply arrangement, any renewal and any notice period are set out in the applicable Order Form.", { label: "unknown" }),
      fact(pinecrestClauses, "2", "noticeDays", null, "The term of each supply arrangement, any renewal and any notice period are set out in the applicable Order Form.", { label: "unknown" }),
    ],
    gap: "The term, renewal and notice period sit in Order Form 1, which should be attached as Schedule 1. It is not in this copy, the drive or the mail, so ask Pinecrest for it.",
    sourceNote: "Pattern source: Law Insider master agreement and order form samples (https://www.lawinsider.com/clause/term-of-purchased-subscriptions/_1). Wording rewritten, parties fictional.",
  },
];
