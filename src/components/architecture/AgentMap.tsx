import { agents, agentsWhy } from "../../data/architecture";
import "./Architecture.css";

/** The five agents around the ledger, each with its one job, its tools and what it cannot do. */
export function AgentMap() {
  return (
    <div className="stack">
      <div className="agent-map">
        <div className="agent-map__core">
          <p className="label">At the centre</p>
          <p className="agent-map__core-name">The ledger</p>
          <p className="muted">Code owns it. Agents read from it, and only code writes dates.</p>
        </div>
        <ul className="agent-map__agents">
          {agents.map((a) => (
            <li key={a.name} className="agent">
              <p className="agent__head">
                <span className="agent__name">{a.name}</span>
                <span className="label">Step {a.step}</span>
              </p>
              <p>{a.job}</p>
              <p>
                <span className="label">Can use</span> {a.tools}
              </p>
              <p>
                <span className="label">Cannot</span> {a.cannot}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <p className="muted">{agentsWhy}</p>
    </div>
  );
}
