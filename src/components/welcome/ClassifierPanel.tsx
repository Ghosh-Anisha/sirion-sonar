import type { ClassifiedLine } from "../../logic/firstRead";
import { formatMoney } from "../../logic/format";
import { Table, type Column } from "../ui/Table";
import "./Welcome.css";

const COLUMNS: Column<ClassifiedLine>[] = [
  { key: "payee", header: "Payee as written", render: (l) => l.payee },
  { key: "result", header: "Sorted as", render: (l) => (l.result === "not-sure" ? "Not sure" : "Not a supplier") },
  { key: "rule", header: "Why", render: (l) => l.explanation },
  { key: "amount", header: "Amount", render: (l) => formatMoney(l.amount), numeric: true },
];

/** The payment classifier at work: how many lines are kept, and every line dropped with the rule that dropped it. */
export function ClassifierPanel({ lines, sorted }: { lines: ClassifiedLine[]; sorted: number }) {
  const seen = lines.slice(0, sorted);
  const kept = seen.filter((l) => l.result === "supplier").length;
  const left = seen.filter((l) => l.result !== "supplier");

  return (
    <div className="stack">
      <p>
        Sorted <strong className="num">{sorted}</strong> of <span className="num">{lines.length}</span> payment lines.{" "}
        <span className="num">{kept}</span> kept as supplier payments,{" "}
        <span className="num">{left.filter((l) => l.result === "not-supplier").length}</span> dropped,{" "}
        <span className="num">{left.filter((l) => l.result === "not-sure").length}</span> not sure.
      </p>
      {left.length > 0 && <Table caption="Payment lines dropped or not sure" columns={COLUMNS} rows={left} rowKey={(l) => l.paymentId} />}
    </div>
  );
}
