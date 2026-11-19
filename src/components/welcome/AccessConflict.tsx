import "./Welcome.css";

/** The access conflict from the stakeholder map, said plainly where it plays out. */
export function AccessConflict() {
  return (
    <section className="conflict" aria-labelledby="conflict-title">
      <h3 id="conflict-title">Where IT and Sonar pull different ways</h3>
      <div className="conflict__sides">
        <div>
          <p className="label">Sonar needs</p>
          <p>Broad read access, because it has to find contracts nobody told it about.</p>
        </div>
        <div>
          <p className="label">IT wants</p>
          <p>The least access that still works, and a way to see and stop it.</p>
        </div>
      </div>
      <p className="muted">
        How it settles: read-only everywhere, mail limited to supplier domains, an access log IT can read, and a pilot that
        starts with the suppliers paid most.
      </p>
    </section>
  );
}
