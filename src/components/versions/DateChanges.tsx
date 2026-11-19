import type { ContractDates } from "../../logic/dates";
import { formatDate } from "../../logic/format";
import { Table, type Column } from "../ui/Table";

interface Row {
  name: string;
  before: string | null;
  after: string | null;
}

const show = (iso: string | null) => (iso ? formatDate(iso) : "Not known");

const COLUMNS: Column<Row>[] = [
  { key: "name", header: "Date", render: (r) => r.name },
  { key: "before", header: "Now", render: (r) => show(r.before) },
  { key: "after", header: "If accepted", render: (r) => <strong>{show(r.after)}</strong> },
];

/** What accepting the amendment does to the dates, worked out by the logic layer. */
export function DateChanges({ before, after }: { before: ContractDates; after: ContractDates }) {
  const rows: Row[] = [
    { name: "Current term ends", before: before.endDate, after: after.endDate },
    { name: "Last day to give notice", before: before.noticeDeadline, after: after.noticeDeadline },
  ];
  return <Table caption="Dates before and after the amendment" columns={COLUMNS} rows={rows} rowKey={(r) => r.name} />;
}
