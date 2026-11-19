import { useState } from "react";
import { emails } from "../../data/emails";
import { people } from "../../data/people";
import { vendors } from "../../data/vendors";
import { formatDate } from "../../logic/format";
import { traceEmail } from "../../logic/inbound";
import { useLedger } from "../../state/useLedger";
import { PROCUREMENT_LEAD } from "../../state/ViewerContext";
import { StageList } from "./StageList";
import "./Email.css";

/** The sample emails in the shared inboxes. Selecting one steps it through what Sonar does with it. */
export function IncomingMail() {
  const ledger = useLedger();
  const arrived = emails.filter((e) => e.receivedOn <= ledger.today).sort((a, b) => b.receivedOn.localeCompare(a.receivedOn));
  const [selectedId, setSelectedId] = useState(arrived[0]?.id ?? null);
  const [shown, setShown] = useState(0);
  const email = arrived.find((e) => e.id === selectedId);

  const trace = email
    ? traceEmail(email, {
        vendors,
        contracts: ledger.contracts,
        originals: ledger.originals,
        paid: ledger.paid,
        items: ledger.items,
        people,
        procurementLeadId: PROCUREMENT_LEAD.id,
        today: ledger.today,
      })
    : null;

  return (
    <div className="inbox">
      <ul className="inbox__list" aria-label="Incoming mail">
        {arrived.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              className="inbox__item"
              aria-pressed={e.id === selectedId}
              onClick={() => {
                setSelectedId(e.id);
                setShown(0);
              }}
            >
              <span className="inbox__from">{e.from.name}</span>
              <span className="inbox__subject">{e.subject}</span>
              <span className="inbox__date num">
                {formatDate(e.receivedOn)}, to {e.to.split("@")[0]}@
              </span>
            </button>
          </li>
        ))}
      </ul>

      {email && trace ? (
        <div className="stack">
          <article className="mail" aria-label="Selected email">
            <dl className="mail__head">
              <dt className="label">From</dt>
              <dd>
                {email.from.name} &lt;{email.from.address}&gt;
              </dd>
              <dt className="label">To</dt>
              <dd>{email.to}</dd>
              <dt className="label">Subject</dt>
              <dd className="mail__subject">{email.subject}</dd>
              {email.attachments.length > 0 && (
                <>
                  <dt className="label">Attached</dt>
                  <dd>{email.attachments.join(", ")}</dd>
                </>
              )}
            </dl>
            <p className="mail__body mail__text">{email.body}</p>
          </article>
          <section className="stack" aria-labelledby="stages-title">
            <h3 id="stages-title">What Sonar does with it</h3>
            <p className="muted">Precomputed for the demo. In the product the email agent does the reading, and code does every comparison.</p>
            <StageList trace={trace} shown={shown} onShow={setShown} />
          </section>
        </div>
      ) : (
        <p className="muted">No mail has arrived yet on this date.</p>
      )}
    </div>
  );
}
