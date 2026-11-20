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
import { handoffLabel, handoffStatus, type HandoffStatus } from "../logic/sirionHandoff";
import { useDemoState } from "../state/DemoStateContext";
import { useLedger } from "../state/useLedger";
import { personName } from "../state/useNeedsYou";
import "./Sirion.css";

type Row = LedgerRow & { handoff: HandoffStatus };

const COLUMNS: Column<Row>[] = [
  { key: "supplier", header: "Supplier", render: (r) => <Link to={`/contract/${r.contractId}`}>{r.supplier}</Link> },
  { key: "sirion", header: "Sirion", render: (r) => <span className={`handoff-tag handoff-tag--${r.handoff.kind}`}>{handoffLabel(r.handoff)}</span> },
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
  const { state } = useDemoState();
  const [toast, setToast] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);
  const rows: Row[] = ledgerRows(contracts, vendors, people, paid, today).map((r) => ({
    ...r,
    handoff: handoffStatus(contracts.find((c) => c.id === r.contractId)!, state.sirion[r.contractId]),
  }));
  const inSirion = rows.filter((r) => r.handoff.kind === "in-sirion");
  const ready = rows.filter((r) => r.handoff.kind === "ready");
  const notReady = rows.filter((r) => r.handoff.kind === "not-ready");
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
          A contract moves to Sirion once its owner has confirmed every fact and pressed Send to Sirion. The rest stay in Sonar's
          ledger with their labels until they are checked, so Sirion only gets records someone has stood behind.
        </p>
      </header>

      <section className="stack" aria-labelledby="handoff-title" data-tour="sirion-status">
        <h2 id="handoff-title">Which contracts go to Sirion</h2>
        <ol className="handoff-steps" aria-label="How a contract gets to Sirion">
          <li><strong>Sonar reads it</strong> and quotes each fact from its sentence.</li>
          <li><strong>The owner confirms</strong> every fact against the contract.</li>
          <li><strong>The owner sends it</strong> with Send to Sirion. Nothing goes on its own.</li>
          <li><strong>Sirion holds it</strong> as a managed record, and Sonar keeps watching its dates.</li>
        </ol>
        <div className="handoff-groups">
          <HandoffGroup title="In Sirion" kind="in-sirion" rows={inSirion} empty="Nothing sent yet." detail={(r) => r.handoff.kind === "in-sirion" ? `Sent by ${personName.get(r.handoff.by) ?? r.handoff.by} on ${formatDate(r.handoff.on)}${r.handoff.changedSince ? ". A fact changed since" : ""}.` : ""} />
          <HandoffGroup title="Ready to send" kind="ready" rows={ready} empty="None waiting. A contract is ready once every fact is confirmed." detail={(r) => `Every fact confirmed. ${r.owner === "No owner" ? "The procurement lead" : r.owner} can send it.`} />
          <HandoffGroup title="Not ready yet" kind="not-ready" rows={notReady} empty="Every contract is checked." detail={(r) => (r.handoff.kind === "not-ready" ? r.handoff.reason : "")} />
        </div>
      </section>

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

/** One group of the handoff: the contracts in it, each with why it is there. */
function HandoffGroup({ title, kind, rows, empty, detail }: { title: string; kind: HandoffStatus["kind"]; rows: Row[]; empty: string; detail: (r: Row) => string }) {
  return (
    <section className={`handoff-group handoff-group--${kind}`} aria-label={title}>
      <h3>
        {title} <span className="num handoff-group__count">{rows.length}</span>
      </h3>
      {rows.length === 0 ? (
        <p className="muted">{empty}</p>
      ) : (
        <ul>
          {rows.map((r) => (
            <li key={r.contractId}>
              <Link to={`/contract/${r.contractId}`}>{r.contract}</Link>
              <span className="handoff-group__detail">{detail(r)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
