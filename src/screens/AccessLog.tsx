import { sources } from "../data/sources";
import { AccessLogTable } from "../components/access/AccessLogTable";
import { SourceAccess } from "../components/access/SourceAccess";
import { useOnboarding } from "../state/OnboardingContext";
import "../components/access/Access.css";

/** Every connect and every file or message Sonar opened, oldest first. Nothing here can be edited or removed. */
export function AccessLog() {
  const { log } = useOnboarding().state;
  return (
    <div className="stack access">
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>Access log</h1>
        <p className="muted">
          Every source connected and every file or message Sonar opened, in the order it happened. The log can only be added
          to. Only the IT admin can revoke a source.
        </p>
      </header>

      <section className="stack" aria-labelledby="sources-title">
        <h2 id="sources-title">Sources</h2>
        <div className="access__sources" data-tour="access-sources">
          {sources.map((s) => (
            <SourceAccess key={s.id} source={s} />
          ))}
        </div>
      </section>

      <section className="stack" aria-labelledby="log-title" data-tour="access-log">
        <h2 id="log-title">
          The log, <span className="num">{log.length}</span> {log.length === 1 ? "entry" : "entries"}
        </h2>
        <AccessLogTable entries={log} />
      </section>
    </div>
  );
}
