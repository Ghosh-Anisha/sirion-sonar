import { sources } from "../data/sources";
import { Part } from "./Part";
import { SolutionIcon, type SolutionIconName } from "./SolutionIcon";

const ICON: Record<string, SolutionIconName> = { payables: "ledger", drive: "drive", mail: "mail" };

/** Column 2: the three sources, each read-only, with the products a company might use. */
export function SourcesColumn() {
  return (
    <ul className="col-list">
      {sources.map((s) => (
        <li key={s.id}>
          <Part id={`source-${s.id}`} thinking="welcome.sources" label={`${s.name}, read-only`} className="source-tile">
            <span className="source-tile__head">
              <SolutionIcon name={ICON[s.id]} />
              <strong>{s.name}</strong>
              <span className="pill">Read only</span>
            </span>
            <span className="source-tile__products">{s.products.join(", ")}</span>
          </Part>
        </li>
      ))}
    </ul>
  );
}
