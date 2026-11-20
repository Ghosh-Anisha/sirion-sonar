/*
 * One sample document for the Privacy screen: the Cloudmetric notice and payment clauses,
 * with the contacts and bank details a real contract carries. All fictional.
 * Nothing here is sent anywhere. The model's reply is precomputed.
 */

export const privacyDocument = {
  contractId: "cloudmetric-subscription",
  fileName: "Contracts/Software/Cloudmetric_SaaS_Subscription_2026.pdf, page 1",
  text: [
    'This Agreement is made on 1 May 2026 between Cloudmetric Software Private Limited ("Provider") and Halden Foods Private Limited ("Customer").',
    'The subscription starts on 1 May 2026 and runs for twelve (12) months, ending on 30 April 2027 (the "Initial Term").',
    "After the Initial Term the subscription renews automatically for successive periods of twelve (12) months unless either party gives written notice of non-renewal at least sixty (60) days before the end of the current term. Notices go to Neha Kulkarni at neha.kulkarni@haldenfoods.example for the Customer, and to Anil Bhat at anil.bhat@cloudmetric.example or +91 98200 41177 for Provider.",
    "The annual fee is Rs 18,00,000, invoiced yearly in advance and payable within thirty (30) days of the invoice date into Cloudmetric's account 50200041177301, IFSC CLMB0004521.",
  ].join("\n\n"),
  /** Names the open-source name recogniser finds that are not on the vendor or people lists. */
  recognisedNames: ["Anil Bhat"],
};

/**
 * What the model sends back for the masked text: tokens, never real names, and the exact
 * sentence it relied on for each term. It returns no dates or amounts of its own.
 */
export const modelReply = [
  "Supplier: [SUPPLIER_1]",
  "Customer: [COMPANY_1]",
  'Renewal: renews on its own. Sentence: "After the Initial Term the subscription renews automatically for successive periods of twelve (12) months unless either party gives written notice of non-renewal at least sixty (60) days before the end of the current term."',
  'Notice: Sentence: "After the Initial Term the subscription renews automatically for successive periods of twelve (12) months unless either party gives written notice of non-renewal at least sixty (60) days before the end of the current term."',
  "Send notice to: [PERSON_2], [EMAIL_2], [PHONE_1]",
  "Our contact: [PERSON_1], [EMAIL_1]",
  "Pays into: account [ACCOUNT_1], [IFSC_1]",
].join("\n");
