import { Link } from "react-router-dom";
import { formatDate } from "../../logic/format";
import type { AccessLogEntry } from "../../logic/onboarding";
import { EmptyState } from "../ui/EmptyState";
import { Table, type Column } from "../ui/Table";
import "./Access.css";

const SOURCE: Record<AccessLogEntry["source"], string> = { payables: "Payables", drive: "Drive", mail: "Mail", access: "Access" };
const KIND: Record<AccessLogEntry["kind"], string> = {
  connect: "Connected",
  request: "Asked",
  approve: "Approved",
  revoke: "Revoked",
  export: "Read",
  search: "Searched",
  open: "Opened",
  message: "Read",
};

type Row = AccessLogEntry & { n: number };

const COLUMNS: Column<Row>[] = [
  { key: "n", header: "#", render: (e) => e.n, numeric: true },
  { key: "on", header: "When", render: (e) => formatDate(e.on) },
  { key: "by", header: "Who", render: (e) => e.by },
  { key: "source", header: "Source", render: (e) => SOURCE[e.source] },
  { key: "kind", header: "What", render: (e) => KIND[e.kind] },
  { key: "text", header: "Detail", render: (e) => e.text },
];

export function AccessLogTable({ entries }: { entries: AccessLogEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="Nothing has been opened yet"
        body="Connect a source in onboarding and every connect, and every file Sonar opens, shows up here."
        action={<Link to="/welcome">Go to onboarding</Link>}
      />
    );
  }
  return <Table caption="Access log, oldest first" columns={COLUMNS} rows={entries.map((e, i) => ({ ...e, n: i + 1 }))} rowKey={(e) => e.key} />;
}
