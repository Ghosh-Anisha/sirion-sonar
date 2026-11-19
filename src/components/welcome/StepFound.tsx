import { vendors } from "../../data/vendors";
import type { ReadStep } from "../../logic/firstRead";
import { formatMoney } from "../../logic/format";
import { firstReadPlan } from "../../state/firstReadPlan";
import { Badge } from "../ui/Badge";
import { Table, type Column } from "../ui/Table";
import "./Welcome.css";

const notFound = firstReadPlan.steps.filter((s) => s.result === "none");
const total = notFound.reduce((n, s) => n + s.spend, 0);
const category = new Map(vendors.map((v) => [v.id, v.category]));

const COLUMNS: Column<ReadStep>[] = [
  {
    key: "supplier",
    header: "Supplier",
    render: (s) => (
      <span className="row" style={{ gap: "var(--space-2)" }}>
        <Badge kind="find" />
        {s.vendorName}
      </span>
    ),
  },
  { key: "what", header: "Paid for", render: (s) => category.get(s.vendorId) },
  { key: "paid", header: "Paid so far", render: (s) => formatMoney(s.spend), numeric: true },
];

/** Step 7: the suppliers the company pays with no contract on file. */
export function StepFound() {
  return (
    <div className="stack">
      <p>
        The company pays <strong className="num">{notFound.length}</strong> suppliers with no contract on file, and has paid
        them <strong className="num">{formatMoney(total)}</strong> so far. Each one is now a Find item: someone needs to find
        the contract, or decide there should be one.
      </p>
      <Table caption="Suppliers paid with no contract on file" columns={COLUMNS} rows={notFound} rowKey={(s) => s.vendorId} />
    </div>
  );
}
