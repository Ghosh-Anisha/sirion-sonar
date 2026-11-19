import { Link } from "react-router-dom";
import type { Contract } from "../data/types";
import { Badge } from "../components/ui/Badge";
import { Table, type Column } from "../components/ui/Table";
import { contractDates } from "../logic/dates";
import { formatDate } from "../logic/format";
import { useLedger } from "../state/useLedger";
import { personName, vendorName } from "../state/useNeedsYou";

/** Every contract on file, with its next deadline and how far to trust it. */
export function Contracts() {
  const { contracts, paid, today, vendors } = useLedger();
  const datesOf = (c: Contract) => contractDates(c.facts, today, (paid.get(c.vendorId) ?? []).map((p) => p.date));
  const ownerOf = (c: Contract) => vendors.find((v) => v.id === c.vendorId)?.ownerId ?? null;

  const columns: Column<Contract>[] = [
    { key: "supplier", header: "Supplier", render: (c) => vendorName.get(c.vendorId) },
    { key: "contract", header: "Contract", render: (c) => <Link to={`/contract/${c.id}`}>{c.title}</Link> },
    { key: "owner", header: "Owner", render: (c) => (ownerOf(c) ? personName.get(ownerOf(c)!) : "No owner") },
    {
      key: "deadline",
      header: "Notice deadline",
      render: (c) => {
        const d = datesOf(c);
        return d.earliestDeadline ? formatDate(d.earliestDeadline) : "Not known";
      },
    },
    { key: "label", header: "Label", render: (c) => <Badge kind={datesOf(c).label} /> },
  ];

  return (
    <div className="stack">
      <h1>Contracts</h1>
      <p className="muted">
        The {contracts.length} contracts Sonar found and read. Open one to check its facts against the text.
      </p>
      <Table caption="Contracts on file" columns={columns} rows={contracts} rowKey={(c) => c.id} />
    </div>
  );
}
