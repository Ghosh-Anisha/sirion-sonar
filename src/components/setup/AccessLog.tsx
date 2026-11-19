import type { AccessEntry } from "../../logic/firstRead";
import { Card } from "../ui/Card";
import "./Setup.css";

const SHOWN = 8;
const SOURCE: Record<AccessEntry["source"], string> = { payables: "Payables", drive: "Drive", mail: "Mail" };

/** Every file or message Sonar opened, newest last. The company can read all of it. Only the latest few are shown here. */
export function AccessLog({ entries }: { entries: AccessEntry[] }) {
  const latest = entries.slice(-SHOWN);
  return (
    <Card title="Access log">
      {entries.length === 0 ? (
        <p className="muted">Nothing has been opened yet. Every file and message Sonar opens is logged here, and the log can only be added to.</p>
      ) : (
        <>
          <p className="muted">
            Showing the latest <span className="num">{latest.length}</span> of <span className="num">{entries.length}</span> entries.
          </p>
          <ol className="access-log">
            {latest.map((e, i) => (
              <li key={entries.length - latest.length + i}>
                <span className="access-log__source label">{SOURCE[e.source]}</span>
                <span>{e.text}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </Card>
  );
}
