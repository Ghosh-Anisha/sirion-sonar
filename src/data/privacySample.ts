/*
 * One sample document for the Privacy screen: the Cloudmetric notice and payment clauses,
 * with the contacts and bank details a real contract carries. All fictional.
 * Nothing here is sent anywhere. The model's reply is precomputed.
 */

export const privacyDocument = {
  contractId: "cloudmetric-subscription",
  fileName: "Contracts/Software/Cloudmetric_Subscription_2024.pdf, pages 1 and 2",
  text: [
    "This Agreement is between Tamarind Home Goods Pvt Ltd (the Customer) and Cloudmetric Software Pvt Ltd (Cloudmetric). This Agreement starts on 1 May 2024.",
    "The initial term ends on 30 April 2025. After that, this Agreement renews on its own for further periods of 12 months each.",
    "Either party may stop a renewal by giving written notice at least 60 days before the end of the current term. Notices go to Neha Kulkarni at neha.kulkarni@tamarindhome.example for the Customer, and to Anil Bhat at anil.bhat@cloudmetric.example or +91 98200 41177 for Cloudmetric.",
    "The Customer will pay a subscription fee of Rs 14,40,000 for each 12 month period into Cloudmetric's account 50200041177301, IFSC CLMB0004521.",
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
  'Renewal: renews on its own. Sentence: "After that, this Agreement renews on its own for further periods of 12 months each."',
  'Notice: Sentence: "Either party may stop a renewal by giving written notice at least 60 days before the end of the current term."',
  "Send notice to: [PERSON_2], [EMAIL_2], [PHONE_1]",
  "Our contact: [PERSON_1], [EMAIL_1]",
  "Pays into: account [ACCOUNT_1], [IFSC_1]",
].join("\n");
