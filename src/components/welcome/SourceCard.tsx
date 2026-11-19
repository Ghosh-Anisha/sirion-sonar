import { useEffect, useState } from "react";
import type { Source } from "../../data/sources";
import { connectEntry, scopeText } from "../../logic/accessText";
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

/** One source: pick the product, allow it on a consent screen, then watch it connect. */
export function SourceCard({ source }: { source: Source }) {
  const { state, dispatch } = useOnboarding();
  const actor = useActor();
  const current = state.sources[source.id];
  const [asking, setAsking] = useState(false);
  const [connecting, setConnecting] = useState<Connecting | null>(null);
  const product = current.product;

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

      <fieldset className="source__products" disabled={connecting !== null || current.status === "connected"}>
        <legend className="label">Product</legend>
        {source.products.map((p) => (
          <label key={p} className="source__product">
            <input
              type="radio"
              name={`product-${source.id}`}
              value={p}
              checked={product === p}
              onChange={() => dispatch({ type: "product", source: source.id, product: p })}
            />
            {p}
          </label>
        ))}
      </fieldset>

      <div className="source__status">
        {connecting ? (
          <div role="status" className="stack" style={{ gap: "var(--space-2)" }}>
            <p>Connecting to {connecting.scope.product}, read-only.</p>
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
            <Button variant="quiet" onClick={() => setAsking(true)}>
              Change access
            </Button>
          </>
        ) : (
          <>
            {current.status === "revoked" && current.revoked && (
              <p className="source__revoked">
                Access revoked by {current.revoked.by} on {formatDate(current.revoked.on)}.
              </p>
            )}
            <Button variant="primary" disabled={!product} onClick={() => setAsking(true)}>
              {product ? `Connect ${product}` : "Pick a product first"}
            </Button>
          </>
        )}
      </div>

      {asking && product && (
        <ConsentDialog source={source} product={product} initial={current.scope} onAllow={allow} onCancel={() => setAsking(false)} />
      )}
    </section>
  );
}
