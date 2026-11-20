import { useState } from "react";
import { Link } from "react-router-dom";
import type { Contract } from "../../data/types";
import { formatDate } from "../../logic/format";
import type { HandoffStatus } from "../../logic/sirionHandoff";
import { personName } from "../../state/useNeedsYou";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import "./SirionCard.css";

interface SirionCardProps {
  contract: Contract;
  status: HandoffStatus;
  /** Whether this viewer may send it: the owner or the procurement lead. */
  canSend: boolean;
  onSend: () => void;
}

/** Where this contract stands on its way to Sirion, and the owner's Send to Sirion with a confirmation. */
export function SirionCard({ contract, status, canSend, onSend }: SirionCardProps) {
  const [confirming, setConfirming] = useState(false);
  return (
    <Card tour="contract-sirion" title="Sirion">
      <div className={`sirion-card sirion-card--${status.kind}`}>
        {status.kind === "in-sirion" && (
          <p role="status">
            <strong>In Sirion</strong> since <span className="num">{formatDate(status.on)}</span>, sent by {personName.get(status.by) ?? status.by}. Sirion has the
            checked record and a link to the file. Sonar keeps watching its dates.
            {status.changedSince && " A fact has changed since, so confirm it and send it again."}
          </p>
        )}
        {status.kind === "not-ready" && (
          <p>
            <strong>Not ready for Sirion.</strong> {status.reason} A contract goes to Sirion once its owner has confirmed every fact.
          </p>
        )}
        {status.kind === "ready" && !confirming && (
          <>
            <p>
              <strong>Ready for Sirion.</strong> Every fact is confirmed against its sentence.
            </p>
            {canSend ? (
              <div className="row">
                <Button variant="primary" onClick={() => setConfirming(true)} data-nudge="send-to-sirion">
                  Send to Sirion
                </Button>
              </div>
            ) : (
              <p className="muted">Its owner or the procurement lead sends it.</p>
            )}
          </>
        )}
        {status.kind === "ready" && confirming && (
          <div className="sirion-card__confirm" role="group" aria-label="Confirm sending to Sirion">
            <p>
              Send <strong>{contract.title}</strong> to Sirion now? It goes with its confirmed facts, its version history and a link to the file.
            </p>
            <div className="row">
              <Button
                variant="primary"
                onClick={() => {
                  setConfirming(false);
                  onSend();
                }}
              >
                Yes, send to Sirion
              </Button>
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        <Link to="/sirion" className="sirion-card__link">
          See every contract's place in the handoff
        </Link>
      </div>
    </Card>
  );
}
