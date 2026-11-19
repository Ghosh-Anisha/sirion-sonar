import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { contracts as sampleContracts } from "../data/contracts";
import { emails } from "../data/emails";
import { ClauseCompare } from "../components/versions/ClauseCompare";
import { DateChanges } from "../components/versions/DateChanges";
import { History } from "../components/item/History";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Toast } from "../components/ui/Toast";
import { applyAmendment } from "../logic/amend";
import { amendmentItemId } from "../logic/arrivals";
import { applyFactEdits } from "../logic/edits";
import { formatDate } from "../logic/format";
import { compareClauses } from "../logic/redline";
import { useDemoState } from "../state/DemoStateContext";
import { useLedger } from "../state/useLedger";
import { personName } from "../state/useNeedsYou";
import { useViewer } from "../state/ViewerContext";
import { ThinkingBadge } from "../components/thinking/ThinkingBadge";
import "../components/versions/Versions.css";

export function Versions() {
  const { id = "" } = useParams();
  const { items, today } = useLedger();
  const { state, dispatch } = useDemoState();
  const { viewer } = useViewer();
  const [toast, setToast] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const sample = sampleContracts.find((c) => c.id === id);
  if (!sample) return <EmptyState title="No contract with that name" action={<Link to="/contracts">See all contracts</Link>} />;

  const original = applyFactEdits(sample, state.factEdits[sample.id] ?? {});
  const arrived = emails.filter((e) => e.amendment?.contractId === sample.id && e.receivedOn <= today);

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <Link to={`/contract/${sample.id}`} style={{ fontSize: "var(--text-12)" }}>
        Back to the contract
      </Link>
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>Versions: {sample.title}</h1>
        <p className="muted">
          The file in the drive is never changed. Sonar keeps the working copy, clause by clause, and records every change to it.
        </p>
      </header>

      {arrived.length === 0 ? (
        <EmptyState title="No amendments yet" body="When an amendment arrives by email or in the drive, it shows here next to the original." />
      ) : (
        arrived.map((email) => {
          const amendment = email.amendment!;
          const itemId = amendmentItemId(email.id);
          const item = items.find((i) => i.id === itemId);
          const answer = item?.action;
          const dates = item?.detail.kind === "amendment" ? item.detail : null;
          const changes = compareClauses(original.clauses, applyAmendment(original, amendment).clauses);

          const respond = (kind: "accepted" | "rejected") => {
            const text =
              kind === "accepted" && dates
                ? `accepted ${amendment.title}. The end date moved from ${formatDate(dates.before.endDate!)} to ${formatDate(dates.after.endDate!)} and the notice deadline from ${formatDate(dates.before.noticeDeadline!)} to ${formatDate(dates.after.noticeDeadline!)}.`
                : `rejected ${amendment.title}. The original terms stay.`;
            dispatch({ type: "answer-amendment", itemId, amendment, action: { kind, on: today, by: viewer.id }, text });
            setToast(kind === "accepted" ? `${amendment.title} accepted. Dates and the list are updated.` : `${amendment.title} rejected.`);
          };

          return (
            <section key={email.id} className="stack" aria-label={amendment.title}>
              <Card title={`${amendment.title}, signed ${formatDate(amendment.signedOn)}`} actions={<ThinkingBadge at="versions.amendment" />}>
                <div className="stack">
                  <div className="row">
                    <Badge kind="check" />
                    <span>
                      Arrived by email on <span className="num">{formatDate(email.receivedOn)}</span> from {email.from.name} ({email.from.address}).
                    </span>
                    {item && <Link to={`/item/${encodeURIComponent(item.id)}`}>Open the item</Link>}
                  </div>
                  {dates && <DateChanges before={dates.before} after={dates.after} />}
                  <div className="versions__answer">
                    {answer ? (
                      <p className={`versions__answered versions__answered--${answer.kind}`} role="status">
                        {personName.get(answer.by)} {answer.kind} it on <span className="num">{formatDate(answer.on)}</span>.
                        {answer.kind === "accepted" ? " The dates above now apply." : " The original terms stay."}
                      </p>
                    ) : (
                      <div className="row">
                        <Button variant="primary" onClick={() => respond("accepted")}>
                          Accept the amendment
                        </Button>
                        <Button variant="secondary" onClick={() => respond("rejected")}>
                          Reject it
                        </Button>
                        <span className="muted">This changes the ledger only. Nothing is signed or sent.</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <p className="versions__legend">
                <ThinkingBadge at="versions.redline" />
                <span>
                  <ins className="redline__added">Added text</ins> is underlined on green.
                </span>
                <span>
                  <del className="redline__removed">Removed text</del> is struck through on red.
                </span>
              </p>
              <ClauseCompare changes={changes} originalTitle="Original" amendmentTitle={amendment.title} />
            </section>
          );
        })
      )}

      <Card title="Version history">
        <ol className="version-list">
          <li>
            <span className="label">Version 1</span>
            <span>Original, as found in {sample.fileName}.</span>
          </li>
          {arrived.map((email, i) => {
            const answer = items.find((it) => it.id === amendmentItemId(email.id))?.action;
            return (
              <li key={email.id}>
                <span className="label">Version {i + 2}</span>
                <span>
                  {email.amendment!.title}:{" "}
                  {answer ? `${answer.kind} by ${personName.get(answer.by)} on ${formatDate(answer.on)}.` : "waiting for the owner to accept or reject it."}
                </span>
              </li>
            );
          })}
        </ol>
      </Card>

      <History entries={state.log.filter((e) => e.contractId === sample.id)} empty="No tracked changes yet." />
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  );
}
