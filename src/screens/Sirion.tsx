import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { people } from "../data/people";
import { sirionLayers } from "../data/sirionMap";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Table, type Column } from "../components/ui/Table";
import { Toast } from "../components/ui/Toast";
import { formatDate } from "../logic/format";
import { ledgerCsv, ledgerRows, type LedgerRow } from "../logic/ledger";
import { useLedger } from "../state/useLedger";
import "./Sirion.css";

const COLUMNS: Column<LedgerRow>[] = [
  { key: "supplier", header: "Supplier", render: (r) => <Link to={`/contract/${r.contractId}`}>{r.supplier}</Link> },
  { key: "owner", header: "Owner", render: (r) => r.owner },
  { key: "end", header: "End date", render: (r) => (r.endDate ? formatDate(r.endDate) : "Not known") },
  { key: "deadline", header: "Notice deadline", render: (r) => (r.noticeDeadline ? formatDate(r.noticeDeadline) : "Not known") },
  { key: "label", header: "Label", render: (r) => <Badge kind={r.label} /> },
];

/** Saves text as a file in the browser's downloads. */
function download(fileName: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function Sirion() {
  const { contracts, paid, today, vendors } = useLedger();
  const [toast, setToast] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);
  const rows = ledgerRows(contracts, vendors, people, paid, today);
  const confirmed = rows.filter((r) => r.label === "confirmed").length;

  const exportCsv = () => {
    const fileName = `sonar-ledger-${today}.csv`;
    download(fileName, ledgerCsv(rows));
    setToast(`Saved ${fileName} with ${rows.length} contracts.`);
  };

  return (
    <div className="stack sirion">
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>Handing over to Sirion</h1>
        <p className="muted">
          Sonar finds the contracts and keeps the list. When the company is ready for a full platform, this ledger is the clean
          data Sirion would otherwise spend months building.
        </p>
      </header>

      <section className="stack" aria-labelledby="ledger-title" data-tour="sirion-ledger">
        <div className="sirion__ledger-head">
          <div>
            <h2 id="ledger-title">The ledger</h2>
            <p className="muted">
              <span className="num">{confirmed}</span> of <span className="num">{rows.length}</span> contracts have every date
              confirmed by an owner. The rest carry their label, so nobody mistakes a guess for a fact.
            </p>
          </div>
          <Button variant="primary" onClick={exportCsv} data-tour="export-csv" data-nudge="export-csv">
            Export CSV
          </Button>
        </div>
        {rows.length === 0 ? (
          <EmptyState title="The ledger is empty" body="Contracts appear here once the first read has found them." />
        ) : (
          <Table caption="The contract ledger" columns={COLUMNS} rows={rows} rowKey={(r) => r.contractId} />
        )}
      </section>

      <section className="stack" aria-labelledby="map-title">
        <h2 id="map-title">Where Sirion picks up after intake</h2>
        <ul className="sirion__map" data-tour="sirion-map">
          {sirionLayers.map((layer) => (
            <li key={layer.name} className="sirion__layer">
              <h3>{layer.name}</h3>
              <p>{layer.does}</p>
              <p className="sirion__from">{layer.from}</p>
            </li>
          ))}
        </ul>
        <p className="sirion__note" role="note">
          These come from Sirion's published product material. The prototype does not rebuild them. It only shows where they
          connect.
        </p>
      </section>
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  );
}
