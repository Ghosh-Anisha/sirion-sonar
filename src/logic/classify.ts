import type { Payment } from "../data/types";

export type PaymentClass = "supplier" | "not-supplier" | "not-sure";

interface Rule {
  id: string;
  result: PaymentClass;
  explanation: string;
  pattern: RegExp;
}

/*
 * Layered rules, checked in order on the payee name. The first match wins.
 * A business name is checked first, so a supplier such as "Ledgerline Payroll
 * Services" is not dropped by the payroll rule. Anything no rule catches is kept:
 * when in doubt, include the line and let a person drop it.
 */
export const RULES: Rule[] = [
  {
    id: "business-name",
    result: "supplier",
    explanation: "The name looks like a business.",
    pattern: /\b(PVT|PRIVATE|LTD|LIMITED|LLP|SERVICES|SVCS|SUPPLIES)\b/,
  },
  {
    id: "payroll",
    result: "not-supplier",
    explanation: "Salary or payroll, paid to staff.",
    pattern: /\b(SALARY|SALARIES|PAYROLL|WAGES)\b/,
  },
  {
    id: "tax",
    result: "not-supplier",
    explanation: "A tax payment to the government.",
    pattern: /\b(TDS|GST|GSTR|CHALLAN|INCOME TAX|ADVANCE TAX)\b/,
  },
  {
    id: "loan",
    result: "not-supplier",
    explanation: "A loan EMI to a bank.",
    pattern: /\b(EMI|LOAN)\b/,
  },
  {
    id: "own-transfer",
    result: "not-supplier",
    explanation: "Money moved between the company's own accounts.",
    pattern: /\bOWN A\/C\b|\bSELF TRANSFER\b/,
  },
  {
    id: "refund",
    result: "not-supplier",
    explanation: "A refund to a customer.",
    pattern: /\bREFUND\b/,
  },
  {
    id: "reimbursement",
    result: "not-supplier",
    explanation: "An expense claim paid back to an employee.",
    pattern: /\bREIMB/,
  },
  {
    id: "cash",
    result: "not-sure",
    explanation: "Cash could have paid anyone, so a person should look.",
    pattern: /\bCASH\b/,
  },
  {
    id: "person-name",
    result: "not-sure",
    explanation: "Paid to a person by name. Could be a contractor or an employee.",
    pattern: /^([A-Z]\.?\s+){1,3}[A-Z]{2,}$/,
  },
];

const DEFAULT_RULE: Rule = {
  id: "kept",
  result: "supplier",
  explanation: "No rule dropped it, so it stays in. When in doubt we include.",
  pattern: /.*/,
};

export interface Classification {
  paymentId: string;
  result: PaymentClass;
  rule: string;
  explanation: string;
}

export function classifyPayment(payment: Payment): Classification {
  const payee = payment.payee.toUpperCase().replace(/\s+/g, " ").trim();
  const rule = RULES.find((r) => r.pattern.test(payee)) ?? DEFAULT_RULE;
  return { paymentId: payment.id, result: rule.result, rule: rule.id, explanation: rule.explanation };
}

export function supplierPayments(payments: Payment[]): Payment[] {
  return payments.filter((p) => classifyPayment(p).result === "supplier");
}
