import { solution } from "../data/story";
import { Character, type Who } from "../story/Character";
import { Part } from "./Part";

const FIGURE: Record<string, Who> = { owner: "meera", finance: "raj", procurement: "imran" };

/** Column 6: the three people Sonar reaches, each with what reaches them. */
export function PeopleColumn() {
  return (
    <div className="people">
      <ul className="col-list">
        {solution.people.map((p) => (
          <li key={p.id}>
            <Part id={`person-${p.id}`} thinking={p.thinking} label={`${p.title}: ${p.gets}`} className="person">
              <svg viewBox="-30 -90 60 92" width="48" height="74" aria-hidden="true">
                <Character who={FIGURE[p.id]} x={0} y={0} />
              </svg>
              <span className="person__text">
                <strong>{p.title}</strong>
                <span>{p.gets}</span>
              </span>
            </Part>
          </li>
        ))}
      </ul>
      <p className="people__line">{solution.peopleLine}</p>
    </div>
  );
}
