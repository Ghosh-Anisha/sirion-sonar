/*
 * Reply templates, precomputed for the demo. In the product the Drafter writes these.
 * Words in braces are filled in by src/logic/drafts.ts with values computed in code,
 * so a draft never holds a date or amount that code did not work out.
 */

export interface DraftTemplate {
  subject: string;
  body: string;
}

export type DraftKey =
  | "renew"
  | "renegotiate"
  | "end"
  | "invoice"
  | "price-rise"
  | "service"
  | "no-contract";

export const draftTemplates: Record<DraftKey, DraftTemplate> = {
  renew: {
    subject: "Continuing our {title}",
    body: "Hello,\n\nWe would like to continue our {title} on the current terms when the present term ends on {endDate}. Please confirm on your side.\n\nRegards,\n{sender}\n{company}",
  },
  renegotiate: {
    subject: "Reviewing our {title} before {endDate}",
    body: "Hello,\n\nOur {title} comes up for renewal on {endDate}. Before then we would like to review the terms with you. Could we find a time in the next two weeks to talk?\n\nRegards,\n{sender}\n{company}",
  },
  end: {
    subject: "Notice: not renewing our {title}",
    body: "Hello,\n\nThis is our written notice that we will not renew the {title} when the current term ends on {endDate}. We are giving it before {deadline}, as {clause} of the agreement requires. Please confirm you have received it.\n\nRegards,\n{sender}\n{company}",
  },
  invoice: {
    subject: "Invoice {invoiceNumber}: amount above the agreed rate",
    body: "Hello,\n\nInvoice {invoiceNumber} comes to {invoiced}. At the rate in {clause} of our agreement, {agreedRate}, the same work comes to {agreed}. Please send a corrected invoice for the difference of {difference}.\n\nRegards,\n{sender}\n{company}",
  },
  "price-rise": {
    subject: "Your proposed fee from {effectiveFrom}",
    body: "Hello,\n\nThank you for letting us know about the new fee of {proposed} a month from {effectiveFrom}. Under {clause} of our agreement, any increase at renewal is limited to {cap}, and the new fee is {increase} higher. We can accept a fee of up to {capped} a month. Please send revised figures.\n\nRegards,\n{sender}\n{company}",
  },
  service: {
    subject: "Service credit for {month}",
    body: "Hello,\n\nThe trip log for {month} shows {onTime} of {trips} trips on time, which is {onTimePercent}. Under {clause} of our agreement, the level is {target}, with a credit of {creditPercent} of the month's invoice when it is missed. Please send a credit note for {credit}.\n\nRegards,\n{sender}\n{company}",
  },
  "no-contract": {
    subject: "Copy of our agreement",
    body: "Hello,\n\nWe are bringing our supplier records up to date and cannot find a signed agreement for the work you do for us. Could you send a copy of the current agreement or order, with its start date, term and rates?\n\nRegards,\n{sender}\n{company}",
  },
};

/** Messages go out from the product's own address, never from a person's mailbox. */
export const SENDING_ADDRESS = "sonar@tamarindhome.example";
export const COMPANY_NAME = "Tamarind Home Goods";
