import { groups, type GroupId } from "../../data/caseStudy";
import "./Case.css";

interface StakeholderMapProps {
  selected: GroupId | null;
  highlighted: GroupId[];
  onSelect: (id: GroupId) => void;
}

/** Power up the side, interest along the bottom. Each group is a button placed where it sits. */
export function StakeholderMap({ selected, highlighted, onSelect }: StakeholderMapProps) {
  return (
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
          {groups.map((g) => {
            const classes = [
              "power-map__group",
              g.id === selected ? "power-map__group--on" : "",
              highlighted.includes(g.id) ? "power-map__group--lit" : "",
            ].join(" ");
            return (
              <button
                key={g.id}
                type="button"
                className={classes}
                style={{ left: `${g.interest}%`, bottom: `${g.power}%` }}
                aria-pressed={g.id === selected}
                aria-label={`${g.name}${highlighted.includes(g.id) ? ", part of the conflict shown" : ""}`}
                onClick={() => onSelect(g.id)}
              >
                {g.name}
              </button>
            );
          })}
        </div>
        <span className="power-map__axis power-map__axis--x label">More interest</span>
      </div>
    </figure>
  );
}
