import { useState } from "react";
import { people } from "../../data/people";
import { ROLE_NAME, roleView } from "../../logic/roles";
import { canSee, canSeeContract } from "../../logic/visibility";
import { useLedger } from "../../state/useLedger";
import { Avatar } from "../../components/layout/Avatar";
import "./Sections.css";

const ROLES = ["kavya", "arjun", "neha", "vikram"];

/** Pick a role and see which of the sample items and contracts stay visible. */
export function RoleTryIt() {
  const { items, contracts, vendors } = useLedger();
  const [id, setId] = useState("neha");
  const person = people.find((p) => p.id === id)!;
  const open = items.filter((i) => i.status === "open");
  const seenItems = open.filter((i) => canSee(i, person)).length;
  const seenContracts = contracts.filter((c) => canSeeContract(c, person, vendors)).length;
  return (
    <div className="role-try" data-tour="solution-role-try">
      <div className="role-try__pick" role="group" aria-label="Pick a role">
        {ROLES.map((pid) => {
          const p = people.find((x) => x.id === pid)!;
          return (
            <button key={pid} type="button" className={`chip${pid === id ? " chip--on" : ""}`} aria-pressed={pid === id} onClick={() => setId(pid)}>
              {ROLE_NAME[p.role]}
            </button>
          );
        })}
      </div>
      <div className="role-try__result" aria-live="polite">
        <Avatar person={person} size={40} />
        <div>
          <p>
            <strong>{person.name}</strong>, {person.title}
          </p>
          <p className="role-try__counts">
            <span>
              <span className="num">{seenItems}</span> of <span className="num">{open.length}</span> open items
            </span>
            <span>
              <span className="num">{seenContracts}</span> of <span className="num">{contracts.length}</span> contracts
            </span>
          </p>
          <p className="muted">{roleView(person, items, vendors)}</p>
        </div>
      </div>
    </div>
  );
}
