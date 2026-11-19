import { fact } from "./fact";
import type { Clause, Contract } from "./types";

/*
 * The 12 sample contracts. Each fact quotes the sentence it comes from.
 * Facts hold only what the document says. End dates after renewals and
 * notice deadlines are computed in src/logic, never stored here.
 */

const cloudmetricClauses: Clause[] = [
  {
    id: "1",
    heading: "Start",
    page: 1,
    text: "This Agreement is between Tamarind Home Goods Pvt Ltd (the Customer) and Cloudmetric Software Pvt Ltd (Cloudmetric). This Agreement starts on 1 May 2024.",
  },
  {
    id: "2",
    heading: "Term and renewal",
    page: 1,
    text: "The initial term ends on 30 April 2025. After that, this Agreement renews on its own for further periods of 12 months each.",
  },
  {
    id: "3",
    heading: "Notice",
    page: 2,
    text: "Either party may stop a renewal by giving written notice at least 60 days before the end of the current term. Notice by email to the account contact is enough.",
  },
  {
    id: "4",
    heading: "Fees",
    page: 2,
    text: "The Customer will pay a subscription fee of Rs 14,40,000 for each 12 month period. Cloudmetric will invoice the fee at the start of each period.",
  },
  {
    id: "5",
    heading: "Price changes",
    page: 2,
    text: "Cloudmetric may raise the fee at a renewal by no more than 8 percent over the fee for the previous period.",
  },
];

const brightlineClauses: Clause[] = [
  {
    id: "1",
    heading: "Term",
    page: 1,
    text: "This Agreement is between Tamarind Home Goods Pvt Ltd (the Customer) and Brightline Logistics Pvt Ltd (Brightline). This Agreement runs from 1 July 2025 to 30 June 2027.",
  },
  {
    id: "2",
    heading: "Extension",
    page: 1,
    text: "This Agreement does not renew on its own. Each party will tell the other at least 90 days before the end date whether it wants to extend.",
  },
  {
    id: "3",
    heading: "Rates",
    page: 2,
    text: "The Customer will pay Rs 18,500 for each full truck trip between the Bhiwandi warehouse and the Pune store. This rate includes fuel and tolls.",
  },
  {
    id: "4",
    heading: "Service levels",
    page: 3,
    text: "Brightline will deliver at least 95 percent of trips on time in each calendar month. A trip is on time if it reaches the store within the agreed slot.",
  },
  {
    id: "5",
    heading: "Service credits",
    page: 3,
    text: "For each month below that level, Brightline will credit 5 percent of that month's invoice.",
  },
  {
    id: "6",
    heading: "Invoices",
    page: 3,
    text: "Brightline will invoice monthly for the trips completed in the previous month, with a trip log attached.",
  },
];

const orbisClauses: Clause[] = [
  {
    id: "1",
    heading: "Start",
    page: 1,
    text: "This Agreement is between Tamarind Home Goods Pvt Ltd (the Customer) and Orbis Facility Services LLP (Orbis). It is signed on 1 February 2026 and starts on the same day.",
  },
  {
    id: "2",
    heading: "Term",
    page: 1,
    text: "It runs for 12 months from the start date.",
  },
  {
    id: "3",
    heading: "Renewal",
    page: 1,
    text: "At the end of each term it renews for another 12 months. Either party may stop a renewal by giving notice at least 30 days before the term ends.",
  },
  {
    id: "4",
    heading: "Services",
    page: 2,
    text: "Orbis will provide housekeeping, pantry staff and minor repairs at the Andheri office on all working days.",
  },
  {
    id: "5",
    heading: "Fees",
    page: 2,
    text: "The Customer will pay a monthly fee of Rs 3,20,000.",
  },
];

const saffronClauses: Clause[] = [
  {
    id: "1",
    heading: "Term",
    page: 1,
    text: "This retainer is between Tamarind Home Goods Pvt Ltd and Saffron Lane Creative Studio LLP. The retainer starts on 1 April 2026 and ends on 31 March 2027.",
  },
  {
    id: "2",
    heading: "New retainer",
    page: 1,
    text: "It does not renew on its own. The parties will agree any new retainer at least 30 days before the end date.",
  },
  {
    id: "3",
    heading: "Fees",
    page: 2,
    text: "The Customer will pay a monthly retainer of Rs 2,75,000, covering campaign planning, design and two shoots a quarter.",
  },
];

const ledgerlineClauses: Clause[] = [
  {
    id: "1",
    heading: "Term",
    page: 1,
    text: "This Agreement is between Tamarind Home Goods Pvt Ltd and Ledgerline Payroll Services Pvt Ltd. It starts on 1 January 2025 for an initial term of 24 months.",
  },
  {
    id: "2",
    heading: "Renewal",
    page: 1,
    text: "It then renews for periods of 12 months. Either party may stop a renewal by giving 30 days' notice before the term ends.",
  },
  {
    id: "3",
    heading: "Fees",
    page: 2,
    text: "The monthly fee is Rs 65,000 for up to 150 employees. Any increase at renewal will not be more than 7 percent.",
  },
];

const greenleafPantryClauses: Clause[] = [
  {
    id: "1",
    heading: "Term",
    page: 1,
    text: "This Agreement is between Tamarind Home Goods Pvt Ltd and Greenleaf Pantry Supplies Pvt Ltd. It runs from 1 October 2025 to 30 September 2026.",
  },
  {
    id: "2",
    heading: "Renewal",
    page: 1,
    text: "It renews for 12 months at a time unless either party gives 30 days' notice before the end of a term.",
  },
  {
    id: "3",
    heading: "Fees",
    page: 1,
    text: "The monthly fee for tea, coffee, snacks and restocking is Rs 42,000.",
  },
];

const greenleafWaterClauses: Clause[] = [
  {
    id: "1",
    heading: "Term",
    page: 1,
    text: "Greenleaf Pantry Supplies Pvt Ltd rents four water dispensers to Tamarind Home Goods Pvt Ltd. The rental starts on 15 June 2026 for 12 months.",
  },
  {
    id: "2",
    heading: "End of rental",
    page: 1,
    text: "The rental ends at the end of the term unless both parties sign an extension.",
  },
  {
    id: "3",
    heading: "Rent",
    page: 1,
    text: "The monthly rent is Rs 6,500, including servicing and filter changes.",
  },
];

const quillstoneClauses: Clause[] = [
  {
    id: "1",
    heading: "Term",
    page: 1,
    text: "Quillstone Legal Associates LLP will act for Tamarind Home Goods Pvt Ltd on contracts and employment matters. This retainer runs from 1 January 2026 to 31 December 2026.",
  },
  {
    id: "2",
    heading: "Renewal",
    page: 1,
    text: "It renews for 12 months unless either side gives at least 21 days' notice before it ends.",
  },
  {
    id: "3",
    heading: "Fees",
    page: 2,
    text: "The monthly retainer is Rs 1,50,000 for up to 20 hours of work. Extra hours are billed separately.",
  },
];

const northstarClauses: Clause[] = [
  {
    id: "1",
    heading: "Term",
    page: 1,
    text: "Northstar Workspace Pvt Ltd gives Tamarind Home Goods Pvt Ltd 30 dedicated seats at its Lower Parel centre. This Agreement starts on 1 August 2025 and lasts 24 months.",
  },
  {
    id: "2",
    heading: "Leaving or staying",
    page: 1,
    text: "Either party may leave at the end of the term by giving 90 days' notice. If nobody does, it continues for 12 months at a time.",
  },
  {
    id: "3",
    heading: "Fees",
    page: 2,
    text: "The monthly fee is Rs 1,80,000 for 30 seats, including power and internet.",
  },
];

const vantageClauses: Clause[] = [
  {
    id: "1",
    heading: "Term",
    page: 1,
    text: "This Agreement sets the rates Vantage Print Works charges Tamarind Home Goods Pvt Ltd. It covers print orders placed between 1 April 2026 and 31 March 2027.",
  },
  {
    id: "2",
    heading: "Rate review",
    page: 1,
    text: "The parties will review rates at least 30 days before the end date.",
  },
  {
    id: "3",
    heading: "Rates",
    page: 1,
    text: "Colour catalogue pages are charged at Rs 4.20 per page, with delivery to the Bhiwandi warehouse included.",
  },
];

const kestrelClauses: Clause[] = [
  {
    id: "1",
    heading: "Commencement",
    page: 1,
    text: "This Agreement between Kestrel Freight Carriers Pvt Ltd and Tamarind Home Goods Pvt Ltd commences on [date unreadable in scan] and continues for a period of twelve months.",
  },
  {
    id: "2",
    heading: "Renewal",
    page: 1,
    text: "It renews for further periods of twelve months unless terminated by 30 days' written notice before the end of a period.",
  },
  {
    id: "3",
    heading: "Charges",
    page: 2,
    text: "Freight charges for the year are payable annually in advance.",
  },
];

const pinecrestClauses: Clause[] = [
  {
    id: "1",
    heading: "Start",
    page: 1,
    text: "This Master Agreement is between Pinecrest Analytics Pvt Ltd and Tamarind Home Goods Pvt Ltd. This Master Agreement starts on 10 September 2025.",
  },
  {
    id: "2",
    heading: "Order Forms",
    page: 1,
    text: "The term, fees and scope of each engagement are set out in the applicable Order Form.",
  },
  {
    id: "3",
    heading: "Ending an Order Form",
    page: 2,
    text: "Either party may end an Order Form at the end of its term by giving 30 days' notice.",
  },
];

export const contracts: Contract[] = [
  {
    id: "cloudmetric-subscription",
    vendorId: "cloudmetric",
    title: "Cloudmetric analytics subscription",
    documentType: "agreement",
    fileName: "Contracts/Software/Cloudmetric_Subscription_2024.pdf",
    clauses: cloudmetricClauses,
    facts: [
      fact(cloudmetricClauses, "1", "startDate", "2024-05-01", "This Agreement starts on 1 May 2024."),
      fact(cloudmetricClauses, "2", "endDate", "2025-04-30", "The initial term ends on 30 April 2025."),
      fact(
        cloudmetricClauses,
        "2",
        "renewalTermMonths",
        12,
        "After that, this Agreement renews on its own for further periods of 12 months each.",
      ),
      fact(
        cloudmetricClauses,
        "3",
        "noticeDays",
        60,
        "Either party may stop a renewal by giving written notice at least 60 days before the end of the current term.",
      ),
      fact(
        cloudmetricClauses,
        "4",
        "annualFee",
        1440000,
        "The Customer will pay a subscription fee of Rs 14,40,000 for each 12 month period.",
      ),
      fact(
        cloudmetricClauses,
        "5",
        "priceCapPercent",
        8,
        "Cloudmetric may raise the fee at a renewal by no more than 8 percent over the fee for the previous period.",
      ),
    ],
    gap: null,
  },
  {
    id: "brightline-logistics",
    vendorId: "brightline",
    title: "Brightline logistics services",
    documentType: "agreement",
    fileName: "Ops/Vendors/Brightline/Brightline_Logistics_Agreement_signed.pdf",
    clauses: brightlineClauses,
    facts: [
      fact(brightlineClauses, "1", "startDate", "2025-07-01", "This Agreement runs from 1 July 2025 to 30 June 2027.", {
        label: "confirmed",
        confirmedBy: "rohan",
      }),
      fact(brightlineClauses, "1", "endDate", "2027-06-30", "This Agreement runs from 1 July 2025 to 30 June 2027.", {
        label: "confirmed",
        confirmedBy: "rohan",
      }),
      fact(
        brightlineClauses,
        "2",
        "noticeDays",
        90,
        "Each party will tell the other at least 90 days before the end date whether it wants to extend.",
      ),
      fact(
        brightlineClauses,
        "3",
        "unitRate",
        18500,
        "The Customer will pay Rs 18,500 for each full truck trip between the Bhiwandi warehouse and the Pune store.",
        { label: "confirmed", confirmedBy: "arjun", unit: "per trip" },
      ),
      fact(
        brightlineClauses,
        "4",
        "slaOnTimePercent",
        95,
        "Brightline will deliver at least 95 percent of trips on time in each calendar month.",
      ),
      fact(
        brightlineClauses,
        "5",
        "slaCreditPercent",
        5,
        "For each month below that level, Brightline will credit 5 percent of that month's invoice.",
      ),
    ],
    gap: null,
  },
  {
    id: "orbis-facilities",
    vendorId: "orbis",
    title: "Orbis facility management",
    documentType: "agreement",
    fileName: "Admin/Facilities/Orbis_FM_Agreement_Feb2026.docx",
    clauses: orbisClauses,
    facts: [
      fact(orbisClauses, "1", "startDate", "2026-02-01", "It is signed on 1 February 2026 and starts on the same day."),
      fact(orbisClauses, "2", "termMonths", 12, "It runs for 12 months from the start date."),
      fact(orbisClauses, "3", "renewalTermMonths", 12, "At the end of each term it renews for another 12 months."),
      fact(
        orbisClauses,
        "3",
        "noticeDays",
        30,
        "Either party may stop a renewal by giving notice at least 30 days before the term ends.",
      ),
      fact(orbisClauses, "5", "monthlyFee", 320000, "The Customer will pay a monthly fee of Rs 3,20,000."),
    ],
    gap: null,
  },
  {
    id: "saffron-retainer",
    vendorId: "saffron-lane",
    title: "Saffron Lane marketing retainer",
    documentType: "agreement",
    fileName: "Marketing/Agencies/Saffron_Lane_Retainer_FY27.pdf",
    clauses: saffronClauses,
    facts: [
      fact(saffronClauses, "1", "startDate", "2026-04-01", "The retainer starts on 1 April 2026 and ends on 31 March 2027.", {
        label: "confirmed",
        confirmedBy: "neha",
      }),
      fact(saffronClauses, "1", "endDate", "2027-03-31", "The retainer starts on 1 April 2026 and ends on 31 March 2027.", {
        label: "confirmed",
        confirmedBy: "neha",
      }),
      fact(
        saffronClauses,
        "2",
        "noticeDays",
        30,
        "The parties will agree any new retainer at least 30 days before the end date.",
        { label: "confirmed", confirmedBy: "neha" },
      ),
      fact(
        saffronClauses,
        "3",
        "monthlyFee",
        275000,
        "The Customer will pay a monthly retainer of Rs 2,75,000, covering campaign planning, design and two shoots a quarter.",
      ),
    ],
    gap: null,
  },
  {
    id: "ledgerline-payroll",
    vendorId: "ledgerline",
    title: "Ledgerline payroll processing",
    documentType: "agreement",
    fileName: "Finance/Payroll/Ledgerline_Agreement_2025.pdf",
    clauses: ledgerlineClauses,
    facts: [
      fact(ledgerlineClauses, "1", "startDate", "2025-01-01", "It starts on 1 January 2025 for an initial term of 24 months."),
      fact(ledgerlineClauses, "1", "termMonths", 24, "It starts on 1 January 2025 for an initial term of 24 months."),
      fact(ledgerlineClauses, "2", "renewalTermMonths", 12, "It then renews for periods of 12 months."),
      fact(
        ledgerlineClauses,
        "2",
        "noticeDays",
        30,
        "Either party may stop a renewal by giving 30 days' notice before the term ends.",
      ),
      fact(ledgerlineClauses, "3", "monthlyFee", 65000, "The monthly fee is Rs 65,000 for up to 150 employees."),
      fact(ledgerlineClauses, "3", "priceCapPercent", 7, "Any increase at renewal will not be more than 7 percent."),
    ],
    gap: null,
  },
  {
    id: "greenleaf-pantry",
    vendorId: "greenleaf",
    title: "Greenleaf pantry supply",
    documentType: "agreement",
    fileName: "Admin/Pantry/Greenleaf_Pantry_Agreement.pdf",
    clauses: greenleafPantryClauses,
    facts: [
      fact(greenleafPantryClauses, "1", "startDate", "2025-10-01", "It runs from 1 October 2025 to 30 September 2026."),
      fact(greenleafPantryClauses, "1", "endDate", "2026-09-30", "It runs from 1 October 2025 to 30 September 2026."),
      fact(
        greenleafPantryClauses,
        "2",
        "renewalTermMonths",
        12,
        "It renews for 12 months at a time unless either party gives 30 days' notice before the end of a term.",
      ),
      fact(
        greenleafPantryClauses,
        "2",
        "noticeDays",
        30,
        "It renews for 12 months at a time unless either party gives 30 days' notice before the end of a term.",
      ),
      fact(
        greenleafPantryClauses,
        "3",
        "monthlyFee",
        42000,
        "The monthly fee for tea, coffee, snacks and restocking is Rs 42,000.",
      ),
    ],
    gap: null,
  },
  {
    id: "greenleaf-water",
    vendorId: "greenleaf",
    title: "Greenleaf water dispenser rental",
    documentType: "agreement",
    fileName: "Admin/Pantry/Greenleaf_Water_Rental_Jun2026.pdf",
    clauses: greenleafWaterClauses,
    facts: [
      fact(greenleafWaterClauses, "1", "startDate", "2026-06-15", "The rental starts on 15 June 2026 for 12 months."),
      fact(greenleafWaterClauses, "1", "termMonths", 12, "The rental starts on 15 June 2026 for 12 months."),
      fact(
        greenleafWaterClauses,
        "3",
        "monthlyFee",
        6500,
        "The monthly rent is Rs 6,500, including servicing and filter changes.",
      ),
    ],
    gap: null,
  },
  {
    id: "quillstone-retainer",
    vendorId: "quillstone",
    title: "Quillstone legal retainer",
    documentType: "agreement",
    fileName: "Legal/Retainers/Quillstone_Retainer_2026.pdf",
    clauses: quillstoneClauses,
    facts: [
      fact(quillstoneClauses, "1", "startDate", "2026-01-01", "This retainer runs from 1 January 2026 to 31 December 2026."),
      fact(quillstoneClauses, "1", "endDate", "2026-12-31", "This retainer runs from 1 January 2026 to 31 December 2026."),
      fact(
        quillstoneClauses,
        "2",
        "renewalTermMonths",
        12,
        "It renews for 12 months unless either side gives at least 21 days' notice before it ends.",
      ),
      fact(
        quillstoneClauses,
        "2",
        "noticeDays",
        21,
        "It renews for 12 months unless either side gives at least 21 days' notice before it ends.",
      ),
      fact(
        quillstoneClauses,
        "3",
        "monthlyFee",
        150000,
        "The monthly retainer is Rs 1,50,000 for up to 20 hours of work.",
      ),
    ],
    gap: null,
  },
  {
    id: "northstar-seats",
    vendorId: "northstar",
    title: "Northstar workspace seats",
    documentType: "agreement",
    fileName: "Ops/Office/Northstar_Seat_Agreement.pdf",
    clauses: northstarClauses,
    facts: [
      fact(northstarClauses, "1", "startDate", "2025-08-01", "This Agreement starts on 1 August 2025 and lasts 24 months."),
      fact(northstarClauses, "1", "termMonths", 24, "This Agreement starts on 1 August 2025 and lasts 24 months."),
      fact(
        northstarClauses,
        "2",
        "noticeDays",
        90,
        "Either party may leave at the end of the term by giving 90 days' notice.",
      ),
      fact(northstarClauses, "2", "renewalTermMonths", 12, "If nobody does, it continues for 12 months at a time."),
      fact(
        northstarClauses,
        "3",
        "monthlyFee",
        180000,
        "The monthly fee is Rs 1,80,000 for 30 seats, including power and internet.",
      ),
    ],
    gap: null,
  },
  {
    id: "vantage-print",
    vendorId: "vantage",
    title: "Vantage print rates",
    documentType: "agreement",
    fileName: "Marketing/Print/Vantage_Rate_Agreement_FY27.pdf",
    clauses: vantageClauses,
    facts: [
      fact(vantageClauses, "1", "startDate", "2026-04-01", "It covers print orders placed between 1 April 2026 and 31 March 2027."),
      fact(vantageClauses, "1", "endDate", "2027-03-31", "It covers print orders placed between 1 April 2026 and 31 March 2027."),
      fact(vantageClauses, "2", "noticeDays", 30, "The parties will review rates at least 30 days before the end date."),
      fact(
        vantageClauses,
        "3",
        "unitRate",
        4.2,
        "Colour catalogue pages are charged at Rs 4.20 per page, with delivery to the Bhiwandi warehouse included.",
        { unit: "per page" },
      ),
    ],
    gap: null,
  },
  {
    id: "kestrel-freight",
    vendorId: "kestrel",
    title: "Kestrel freight agreement (scan)",
    documentType: "scan",
    fileName: "Ops/Scans/SCAN_0047.pdf",
    clauses: kestrelClauses,
    facts: [
      fact(
        kestrelClauses,
        "1",
        "startDate",
        null,
        "This Agreement between Kestrel Freight Carriers Pvt Ltd and Tamarind Home Goods Pvt Ltd commences on [date unreadable in scan] and continues for a period of twelve months.",
        { label: "bounded" },
      ),
      fact(
        kestrelClauses,
        "1",
        "termMonths",
        12,
        "This Agreement between Kestrel Freight Carriers Pvt Ltd and Tamarind Home Goods Pvt Ltd commences on [date unreadable in scan] and continues for a period of twelve months.",
      ),
      fact(
        kestrelClauses,
        "2",
        "renewalTermMonths",
        12,
        "It renews for further periods of twelve months unless terminated by 30 days' written notice before the end of a period.",
      ),
      fact(
        kestrelClauses,
        "2",
        "noticeDays",
        30,
        "It renews for further periods of twelve months unless terminated by 30 days' written notice before the end of a period.",
      ),
    ],
    gap: "The start date is unreadable in the scan. Payments arrive every March, so the term most likely starts then.",
  },
  {
    id: "pinecrest-msa",
    vendorId: "pinecrest",
    title: "Pinecrest master services agreement",
    documentType: "master-agreement",
    fileName: "Marketing/Research/Pinecrest_MSA.pdf",
    clauses: pinecrestClauses,
    facts: [
      fact(pinecrestClauses, "1", "startDate", "2025-09-10", "This Master Agreement starts on 10 September 2025."),
      fact(
        pinecrestClauses,
        "2",
        "termMonths",
        null,
        "The term, fees and scope of each engagement are set out in the applicable Order Form.",
        { label: "unknown" },
      ),
      fact(
        pinecrestClauses,
        "3",
        "noticeDays",
        30,
        "Either party may end an Order Form at the end of its term by giving 30 days' notice.",
      ),
    ],
    gap: "The Order Form, where the term sits, is not in the drive or the mail.",
  },
];
