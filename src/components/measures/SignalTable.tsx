import type { Signal } from "../../logic/measures";
import { Table, type Column } from "../ui/Table";
import "./Measures.css";

const STATUS_TEXT: Record<Signal["status"], string> = {
  clear: "Clear",
  triggered: "Rethink",
  "too-early": "Too early to tell",
  "no-data": "No data yet",
};

const COLUMNS: Column<Signal>[] = [
  { key: "signal", header: "Signal", render: (s) => <strong>{s.title}</strong> },
  { key: "threshold", header: "Threshold", render: (s) => s.threshold },
  { key: "now", header: "Now", render: (s) => s.current },
  {
    key: "status",
    header: "Status",
    render: (s) => <span className={`signal-status signal-status--${s.status}`}>{STATUS_TEXT[s.status]}</span>,
  },
  { key: "response", header: "What we would do", render: (s) => s.response },
];

/** The signals that would make us rethink the product, each with its threshold and where it stands now. */
export function SignalTable({ signals }: { signals: Signal[] }) {
  return <Table caption="Rethink signals" columns={COLUMNS} rows={signals} rowKey={(s) => s.id} />;
}
