import { solution } from "../data/story";
import { Part } from "./Part";
import { SolutionIcon, type SolutionIconName } from "./SolutionIcon";

const ICON: Record<string, SolutionIconName> = { notice: "mail", deadline: "clock", invoice: "invoice", "no-contract": "coin" };

/** Column 1: the four things that happen in the company. */
export function EventsColumn() {
  return (
    <ul className="col-list">
      {solution.events.map((e) => (
        <li key={e.id}>
          <Part id={`event-${e.id}`} thinking={e.thinking} label={e.label} className="event">
            <span className="tile tile--brand event__icon">
              <SolutionIcon name={ICON[e.id]} />
            </span>
            <span>{e.label}</span>
          </Part>
        </li>
      ))}
    </ul>
  );
}
