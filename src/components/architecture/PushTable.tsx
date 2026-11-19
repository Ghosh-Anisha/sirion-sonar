import { pushDesign, type PushRow } from "../../data/architecture";
import { Table, type Column } from "../ui/Table";

const COLUMNS: Column<PushRow>[] = [
  { key: "what", header: "What", render: (r) => <strong>{r.what}</strong> },
  { key: "when", header: "When", render: (r) => r.when },
  { key: "to", header: "Goes to", render: (r) => r.goesTo },
  { key: "says", header: "What it says", render: (r) => r.says },
];

/** How Sonar reaches people who never open it. */
export function PushTable() {
  return <Table caption="How Sonar pushes" columns={COLUMNS} rows={pushDesign} rowKey={(r) => r.what} />;
}
