import { Link } from "react-router-dom";
import { ClockControl } from "./ClockControl";
import { ViewAsSwitcher } from "./ViewAsSwitcher";

export function TopBar() {
  return (
    <header className="topbar">
      <Link to="/home" className="topbar__name">
        Sirion Sonar
      </Link>
      <div className="topbar__controls">
        <ViewAsSwitcher />
        <ClockControl />
      </div>
    </header>
  );
}
