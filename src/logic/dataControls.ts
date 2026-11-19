import type { Contract, Email } from "../data/types";

/*
 * The live panel under Data controls: pick a sample document and see how it is classified
 * and which controls apply to it. Worked out by code from the kind of document.
 */

export type DocKind = "contract" | "email" | "payments";

export interface SampleDoc {
  id: string;
  name: string;
  kind: DocKind;
}

export interface AppliedControl {
  control: string;
  applies: boolean;
  how: string;
}

export interface DocControls {
  classification: "Confidential" | "Restricted";
  why: string;
  controls: AppliedControl[];
}

export function sampleDocs(contracts: Contract[], emails: Email[], paymentLines: number): SampleDoc[] {
  return [
    ...contracts.map((c) => ({ id: c.id, name: c.fileName, kind: "contract" as const })),
    ...emails.map((e) => ({ id: e.id, name: `Email: ${e.subject}`, kind: "email" as const })),
    { id: "payables", name: `Payables export, ${paymentLines} lines`, kind: "payments" as const },
  ];
}

const WHERE: Record<DocKind, string> = { contract: "the customer's drive", email: "the shared inbox", payments: "the payables system" };

export function controlsFor(kind: DocKind): DocControls {
  const readByModel = kind !== "payments";
  return {
    classification: kind === "payments" ? "Restricted" : "Confidential",
    why:
      kind === "payments"
        ? "Bank lines are restricted. Account numbers are dropped on arrival and only the last four are kept."
        : kind === "contract"
          ? "Contract text is confidential."
          : "Supplier mail carries contract terms and prices, so it is treated like contract text.",
    controls: [
      { control: "Masking", applies: readByModel, how: readByModel ? "Names, people, contacts and bank details become tokens before the model reads it, with a leak check." : "Never sent to a model. Code sorts the lines." },
      { control: "Token vault", applies: readByModel, how: readByModel ? "The real names it contains are kept in the vault, under a separate key." : "No tokens, because no model reads it." },
      { control: "Encryption", applies: true, how: "Encrypted in transit and at rest with the customer's key." },
      { control: "Isolation", applies: true, how: "Kept only in this customer's database and storage." },
      { control: "Originals", applies: true, how: `The original stays in ${WHERE[kind]}. We keep a link${readByModel ? " and the extracted text" : " and the lines we need"}.` },
      { control: "Retention", applies: true, how: readByModel ? "Extracted text is deleted after 12 months, or sooner if the customer sets it." : "Payment lines are kept while the customer uses Sonar." },
      { control: "Training", applies: true, how: "Never used to train any model." },
      { control: "Residency", applies: true, how: "Stored in the customer's region." },
      { control: "Deletion", applies: true, how: "Gone for good when the customer's database, storage and key are deleted." },
    ],
  };
}
