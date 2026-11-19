import { useState } from "react";
import { Link } from "react-router-dom";
import type { Source } from "../../data/sources";
import { people } from "../../data/people";
import { IT_ADMIN_ID } from "../../data/sources";
import { andList, revokeEntry, scopeText } from "../../logic/accessText";
import { formatDate } from "../../logic/format";
import { itemsFromSource } from "../../logic/owners";
import { useActor } from "../../state/useActor";
import { useLedger } from "../../state/useLedger";
import { useOnboarding } from "../../state/OnboardingContext";
import { useViewer } from "../../state/ViewerContext";
import { Button } from "../ui/Button";
import "./Access.css";

const admin = people.find((p) => p.id === IT_ADMIN_ID)!;

/** One source's access, and for the IT admin, a way to revoke it that first says what stops working. */
export function SourceAccess({ source }: { source: Source }) {
  const { state, dispatch } = useOnboarding();
  const { viewer } = useViewer();
  const { items } = useLedger();
  const actor = useActor();
  const [asking, setAsking] = useState(false);
  const current = state.sources[source.id];
  const isAdmin = viewer.id === IT_ADMIN_ID;
  const affected = itemsFromSource(source.id, items).length;

  const revoke = () => {
    dispatch({ type: "revoke", source: source.id, entry: revokeEntry(source.id, current.scope?.products ?? [source.name], actor) });
    setAsking(false);
  };

  const stops = (
    <>
      <ul>
        {source.stops.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p>
        <span className="num">{affected}</span> open {affected === 1 ? "item depends" : "items depend"} on it. They stay on the
        list but stop updating.
      </p>
    </>
  );

  return (
    <section className={`access-source access-source--${current.status}`} aria-labelledby={`access-${source.id}`}>
      <h3 id={`access-${source.id}`}>{source.name}</h3>
      {current.status === "connected" && current.scope ? (
        <>
          <p>{scopeText(source.id, current.scope)}.</p>
          {isAdmin ? (
            asking ? (
              <div className="access-source__confirm" role="group" aria-label={`Revoke ${source.name}`}>
                <p>
                  <strong>If you revoke {andList(current.scope.products)}, this stops working:</strong>
                </p>
                {stops}
                <div className="row">
                  <Button variant="primary" onClick={revoke}>
                    Revoke access
                  </Button>
                  <Button onClick={() => setAsking(false)}>Keep it</Button>
                </div>
              </div>
            ) : (
              <div>
                <Button onClick={() => setAsking(true)}>Revoke access</Button>
              </div>
            )
          ) : (
            <p className="muted">Only the IT admin can revoke this. Switch View as to {admin.name} to try it.</p>
          )}
        </>
      ) : current.status === "revoked" && current.revoked ? (
        <div className="access-source__revoked" role="status">
          <p>
            <strong>
              Revoked by {current.revoked.by} on {formatDate(current.revoked.on)}.
            </strong>{" "}
            What stopped working:
          </p>
          {stops}
          <Link to="/welcome" onClick={() => dispatch({ type: "go", step: 2 })}>
            Connect it again in onboarding
          </Link>
        </div>
      ) : (
        <p className="muted">Not connected yet.</p>
      )}
    </section>
  );
}
