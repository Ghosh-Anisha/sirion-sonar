import { conflicts } from "../../data/caseStudy";
import { PlaysOutLink } from "./PlaysOutLink";
import "./Case.css";

interface ConflictTableProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

/** The conflict table. Picking a conflict lights up its two groups on the map and shows what Sonar does. */
export function ConflictTable({ selected, onSelect }: ConflictTableProps) {
  return (
    <div className="table-wrap" data-tour="conflict-table">
      <table className="table conflict-table">
        <caption className="visually-hidden">Where the stakeholders conflict</caption>
        <thead>
          <tr>
            <th scope="col">Conflict</th>
            <th scope="col">Between</th>
            <th scope="col">Why</th>
          </tr>
        </thead>
        <tbody>
          {conflicts.map((c) => {
            const on = c.id === selected;
            return [
              <tr key={c.id} className={on ? "conflict-table__row--on" : undefined}>
                <th scope="row">
                  <button type="button" className="conflict-table__pick" aria-expanded={on} onClick={() => onSelect(c.id)}>
                    {c.title}
                  </button>
                </th>
                <td>{c.betweenText}</td>
                <td>{c.why}</td>
              </tr>,
              on && (
                <tr key={`${c.id}-sonar`} className="conflict-table__detail">
                  <td colSpan={3}>
                    <p>
                      <span className="label">What Sonar does</span> {c.sonar}
                    </p>
                    <PlaysOutLink to={c.playsOut} />
                  </td>
                </tr>
              ),
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}
