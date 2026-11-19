import { groups, type Group, type GroupId } from "../../data/caseStudy";
import "./Case.css";

interface StakeholderMapProps {
  selected: GroupId | null;
  highlighted: GroupId[];
  onSelect: (id: GroupId) => void;
}

const QUADRANTS: { name: string; test: (g: Group) => boolean }[] = [
  { name: "Manage closely", test: (g) => g.power >= 50 && g.interest >= 50 },
  { name: "Keep satisfied", test: (g) => g.power >= 50 && g.interest < 50 },
  { name: "Keep informed", test: (g) => g.power < 50 && g.interest >= 50 },
  { name: "Monitor", test: (g) => g.power < 50 && g.interest < 50 },
];

/**
 * Power up the side, interest along the bottom. Each group is a button placed where it sits.
 * On a narrow screen the same groups show as a list by quadrant, because the chips would overlap.
 */
export function StakeholderMap({ selected, highlighted, onSelect }: StakeholderMapProps) {
  const classes = (id: GroupId, base: string) =>
    [base, id === selected ? `${base}--on` : "", highlighted.includes(id) ? `${base}--lit` : ""].filter(Boolean).join(" ");
  const label = (g: Group) => `${g.name}${highlighted.includes(g.id) ? ", part of the conflict shown" : ""}`;
  return (
    <>
    <div className="power-list" data-tour="power-map">
      {QUADRANTS.map((q) => (
        <section key={q.name} className="power-list__quadrant" aria-label={q.name}>
          <p className="label">{q.name}</p>
          <ul>
            {groups.filter(q.test).map((g) => (
              <li key={g.id}>
                <button type="button" className={`${classes(g.id, "power-map__group")} power-list__group`} aria-pressed={g.id === selected} aria-label={label(g)} onClick={() => onSelect(g.id)}>
                  {g.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
    <figure className="power-map" data-tour="power-map" aria-labelledby="power-map-caption">
      <figcaption id="power-map-caption" className="visually-hidden">
        Stakeholder map: power against interest. Pick a group to see what it wants.
      </figcaption>
      <div className="power-map__frame">
        <span className="power-map__axis power-map__axis--y label">More power</span>
        <div className="power-map__plot">
          <span className="power-map__quad power-map__quad--tl label">Keep satisfied</span>
          <span className="power-map__quad power-map__quad--tr label">Manage closely</span>
          <span className="power-map__quad power-map__quad--bl label">Monitor</span>
          <span className="power-map__quad power-map__quad--br label">Keep informed</span>
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              className={classes(g.id, "power-map__group")}
              style={{ left: `${g.interest}%`, bottom: `${g.power}%` }}
              aria-pressed={g.id === selected}
              aria-label={label(g)}
              onClick={() => onSelect(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
        <span className="power-map__axis power-map__axis--x label">More interest</span>
      </div>
    </figure>
    </>
  );
}
