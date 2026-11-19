import { useEffect, useState } from "react";
import type { Source } from "../../data/sources";
import { andList, connectEntry, scopeText } from "../../logic/accessText";
import { formatDate } from "../../logic/format";
import type { SourceScope } from "../../logic/onboarding";
import { useActor } from "../../state/useActor";
import { useOnboarding } from "../../state/OnboardingContext";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { ConsentDialog } from "./ConsentDialog";
import "./Welcome.css";

const CONNECT_MS = 2000;

interface Connecting {
  scope: SourceScope;
  actor: ReturnType<typeof useActor>;
}

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

/** One source: pick one or more products, allow them on one consent screen, then watch them connect. */
export function SourceCard({ source }: { source: Source }) {
  const { state, dispatch } = useOnboarding();
  const actor = useActor();
  const current = state.sources[source.id];
  const [asking, setAsking] = useState(false);
  const [connecting, setConnecting] = useState<Connecting | null>(null);
  const picked = source.products.filter((p) => current.products.includes(p));
  const changed = current.status === "connected" && current.scope !== null && !sameSet(picked, current.scope.products);

  useEffect(() => {
    if (!connecting) return;
    const timer = window.setTimeout(() => {
      dispatch({ type: "connect", source: source.id, scope: connecting.scope, entry: connectEntry(source.id, connecting.scope, connecting.actor) });
      setConnecting(null);
    }, CONNECT_MS);
    return () => window.clearTimeout(timer);
  }, [connecting, dispatch, source.id]);

  const allow = (scope: SourceScope) => {
    setAsking(false);
    setConnecting({ scope, actor });
  };

  const titleId = `source-${source.id}`;
  return (
    <section className={`source source--${connecting ? "connecting" : current.status}`} aria-labelledby={titleId}>
      <header className="source__head">
        <h3 id={titleId}>{source.name}</h3>
        <span className="pill">Read-only</span>
      </header>
      <p className="muted">{source.purpose}</p>

      <fieldset className="source__products" disabled={connecting !== null}>
        <legend className="label">Products, pick all the company uses</legend>
        {source.products.map((p) => (
          <label key={p} className="option">
            <input type="checkbox" value={p} checked={picked.includes(p)} onChange={() => dispatch({ type: "toggle-product", source: source.id, product: p })} />
            <span>{p}</span>
          </label>
        ))}
      </fieldset>

      <div className="source__status">
        {connecting ? (
          <div role="status" className="stack" style={{ gap: "var(--space-2)" }}>
            <p>Connecting to {andList(connecting.scope.products)}, read-only.</p>
            <div className="connecting-bar" aria-hidden="true">
              <span />
            </div>
          </div>
        ) : current.status === "connected" && current.scope ? (
          <>
            <p className="source__connected" role="status">
              <Icon name="confirmed" size={14} /> Connected
            </p>
            <p className="source__scope">{scopeText(source.id, current.scope)}.</p>
            <Button variant={changed ? "primary" : "quiet"} disabled={picked.length === 0} onClick={() => setAsking(true)}>
              {changed ? "Update access" : "Change access"}
            </Button>
          </>
        ) : (
          <>
            {current.status === "revoked" && current.revoked && (
              <p className="source__revoked">
                Access revoked by {current.revoked.by} on {formatDate(current.revoked.on)}.
              </p>
            )}
            <Button variant="primary" disabled={picked.length === 0} onClick={() => setAsking(true)}>
              {picked.length === 0 ? "Pick at least one product" : `Connect ${andList(picked)}`}
            </Button>
          </>
        )}
      </div>

      {asking && picked.length > 0 && (
        <ConsentDialog source={source} products={picked} initial={current.scope} onAllow={allow} onCancel={() => setAsking(false)} />
      )}
    </section>
  );
}
