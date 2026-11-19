import { Link } from "react-router-dom";
import type { PlaysOut } from "../../data/caseStudy";
import "./Case.css";

/** A link from the reasoning to the screen where it plays out. */
export function PlaysOutLink({ to }: { to: PlaysOut }) {
  return (
    <Link to={to.to} className="plays-out">
      <span className="label">Plays out in</span> {to.text}
    </Link>
  );
}
