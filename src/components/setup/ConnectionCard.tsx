import type { Connection } from "../../data/connections";
import "./Setup.css";

/** One read-only connection: what it is, what it reads, and what it never does. */
export function ConnectionCard({ connection, approvedBy }: { connection: Connection; approvedBy: string }) {
  return (
    <section className="connection" aria-labelledby={`conn-${connection.id}`}>
      <header className="connection__head">
        <h3 id={`conn-${connection.id}`}>{connection.name}</h3>
        <span className="pill">Read-only</span>
      </header>
      <p className="muted">{connection.system}</p>
      <dl className="connection__terms">
        <dt className="label">Access</dt>
        <dd>{connection.access}</dd>
        <dt className="label">Reads</dt>
        <dd>{connection.reads}</dd>
        <dt className="label">Never</dt>
        <dd>{connection.never}</dd>
      </dl>
      <p className="connection__approved">Mock approval by {approvedBy}. Nothing is really connected.</p>
    </section>
  );
}
