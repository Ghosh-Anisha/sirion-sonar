import { formatDate } from "../../logic/format";
import type { LogEntry } from "../../state/DemoStateContext";
import { personName } from "../../state/useNeedsYou";
import { Card } from "../ui/Card";
import "./History.css";

/** What people have done here, oldest first. */
export function History({ entries, empty, tour }: { entries: LogEntry[]; empty: string; tour?: string }) {
  return (
    <Card title="History" tour={tour}>
      {entries.length === 0 ? (
        <p className="muted">{empty}</p>
      ) : (
        <ol className="history">
          {entries.map((e) => (
            <li key={e.id}>
              <span className="history__when num">{formatDate(e.on)}</span>
              <span>
                {personName.get(e.by) ?? e.by} {e.text}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
