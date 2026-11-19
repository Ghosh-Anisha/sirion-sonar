import { dataPlaces } from "../../data/architecture";
import "./Architecture.css";

/** Where data lives: originals in the customer's systems, everything else in one isolated environment per customer. */
export function DataMap() {
  const d = dataPlaces;
  return (
    <div className="data-map">
      <div className="data-map__zone data-map__zone--customer">
        <p className="data-map__zone-name">{d.customer.name}</p>
        <p>{d.customer.note}</p>
        <ul className="data-map__chips">
          <li>Drive</li>
          <li>Mail</li>
          <li>Payables</li>
        </ul>
      </div>

      <p className="data-map__arrow" aria-hidden="true">
        Read-only →
      </p>

      <div className="data-map__zone data-map__zone--account">
        <p className="data-map__zone-name">{d.account.name}</p>
        <p className="muted">{d.account.note}</p>
        <div className="data-map__inner">
          <div className="data-map__zone data-map__zone--env">
            <p className="data-map__zone-name">One customer's environment</p>
            <ul className="data-map__boxes">
              {d.environment.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong>
                  <span>{p.holds}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="data-map__boxes data-map__boxes--side">
            <li className="data-map__vault">
              <strong>{d.vault.name}</strong>
              <span>{d.vault.holds}</span>
            </li>
            <li>
              <strong>{d.servers.name}</strong>
              <span>{d.servers.holds}</span>
            </li>
            <li className="data-map__model">
              <strong>{d.model.name}</strong>
              <span>{d.model.holds}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
