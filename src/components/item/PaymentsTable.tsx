import type { Payment } from "../../data/types";
import { formatDate, formatMoney } from "../../logic/format";
import { Table, type Column } from "../ui/Table";

const COLUMNS: Column<Payment>[] = [
  { key: "date", header: "Date", render: (p) => formatDate(p.date) },
  { key: "payee", header: "Payee as written", render: (p) => p.payee },
  { key: "reference", header: "Reference", render: (p) => p.reference },
  { key: "amount", header: "Amount", render: (p) => formatMoney(p.amount), numeric: true },
];

/** The payments behind a Find item, exactly as they appear in the payables export. */
export function PaymentsTable({ lines }: { lines: Payment[] }) {
  return (
    <div className="item-screen__payments">
      <Table caption="Payments to this supplier" columns={COLUMNS} rows={lines} rowKey={(p) => p.id} />
    </div>
  );
}
