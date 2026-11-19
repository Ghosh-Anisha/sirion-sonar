import { useEffect, useRef, useState } from "react";
import { SENDING_ADDRESS } from "../../data/drafts";
import type { Draft } from "../../logic/drafts";
import { formatDate } from "../../logic/format";
import type { SentMessage } from "../../state/DemoStateContext";
import { personName } from "../../state/useNeedsYou";
import { Button } from "../ui/Button";
import "./DraftReply.css";

interface DraftReplyProps {
  draft: Draft;
  sent: SentMessage | undefined;
  onSend: () => void;
}

/**
 * The drafted reply, as the supplier would get it. Sending takes two clicks:
 * Send, then a confirmation that names who it goes to. Nothing goes out on its own.
 */
export function DraftReply({ draft, sent, onSend }: DraftReplyProps) {
  const [confirming, setConfirming] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);
  const shown = sent ?? draft;

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  return (
    <section className="draft" aria-labelledby="draft-title">
      <h3 id="draft-title">{sent ? "Reply sent" : "Drafted reply"}</h3>
      <dl className="draft__head">
        <dt className="label">To</dt>
        <dd>{shown.to}</dd>
        <dt className="label">From</dt>
        <dd>{SENDING_ADDRESS}</dd>
        <dt className="label">Subject</dt>
        <dd>{shown.subject}</dd>
      </dl>
      <p className="draft__body">{shown.body}</p>

      {sent ? (
        <p className="draft__status">
          Sent on <span className="num">{formatDate(sent.on)}</span> by {personName.get(sent.by) ?? sent.by}.
        </p>
      ) : confirming ? (
        <div className="draft__confirm" role="group" aria-label="Confirm sending" tabIndex={-1} ref={confirmRef}>
          <p>
            Send this to <strong>{draft.to}</strong> now? It goes from {SENDING_ADDRESS}. Nothing else is sent.
          </p>
          <div className="row">
            <Button
              variant="primary"
              onClick={() => {
                setConfirming(false);
                onSend();
              }}
            >
              Yes, send it
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="row">
          <Button variant="primary" onClick={() => setConfirming(true)}>
            Send
          </Button>
          <span className="muted">You will be asked to confirm first.</span>
        </div>
      )}
    </section>
  );
}
