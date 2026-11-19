import { Link } from "react-router-dom";
import { SENDING_ADDRESS } from "../../data/drafts";
import { formatDate } from "../../logic/format";
import { reasonLabel } from "../../logic/sentences";
import { weeklyItems, weeklySubject } from "../../logic/weekly";
import { useLedger } from "../../state/useLedger";
import { toRow } from "../../state/useNeedsYou";
import { PROCUREMENT_LEAD, useViewer } from "../../state/ViewerContext";
import { Badge } from "../ui/Badge";
import { ThinkingBadge } from "../thinking/ThinkingBadge";
import "./Email.css";

/** The weekly email, as the person being viewed as would get it. Each item has its reason and one link back in. */
export function WeeklyEmail() {
  const { items, today } = useLedger();
  const { viewer } = useViewer();
  const rows = weeklyItems(items, viewer, today, PROCUREMENT_LEAD.id).map((i) => toRow(i, today));
  const urgent = rows.filter((r) => r.group === "urgent").length;
  const firstName = viewer.name.split(" ")[0];

  if (viewer.role === "it-admin") {
    return <p className="muted">IT admins do not get the weekly email. Switch the view to an owner or a lead to see one.</p>;
  }

  return (
    <article className="mail" aria-label="Weekly email">
      <ThinkingBadge at="email.weekly" />
      <dl className="mail__head">
        <dt className="label">From</dt>
        <dd>Sirion Sonar &lt;{SENDING_ADDRESS}&gt;</dd>
        <dt className="label">To</dt>
        <dd>
          {viewer.name} &lt;{viewer.email}&gt;
        </dd>
        <dt className="label">Date</dt>
        <dd className="num">{formatDate(today)}</dd>
        <dt className="label">Subject</dt>
        <dd className="mail__subject">{weeklySubject(rows.length, urgent, today)}</dd>
      </dl>
      <div className="mail__body">
        <p>Hi {firstName},</p>
        {rows.length === 0 ? (
          <p>Nothing needs you this week. Sonar will write again next Monday, or sooner if a date gets close.</p>
        ) : (
          <>
            <p>
              Here is what needs you this week, earliest first. Each one has a link that opens it in Sonar.
              {urgent > 0 && ` ${urgent === 1 ? "One is" : `${urgent} are`} due within 7 days.`}
            </p>
            <ol className="mail__items">
              {rows.map(({ item, sentence, routing }) => (
                <li key={item.id}>
                  <div className="row">
                    <Badge kind={item.type} />
                    {routing.urgent && <Badge kind="urgent" />}
                    <span className="mail__reason">
                      {reasonLabel(item.reason)}, due {formatDate(item.dueDate)}
                    </span>
                  </div>
                  <p>{sentence}</p>
                  <Link to={`/item/${encodeURIComponent(item.id)}`}>Open in Sonar</Link>
                </li>
              ))}
            </ol>
          </>
        )}
        <p className="mail__footer">
          {viewer.role === "contract-owner"
            ? "You get this because you own these suppliers."
            : viewer.role === "procurement-lead"
              ? "You get this because nobody owns these suppliers, or nobody has acted in time."
              : "You get this because you look after invoices and prices."}{" "}
          Sonar never pays, holds or signs anything, and never writes to a supplier without your click.
        </p>
      </div>
    </article>
  );
}
