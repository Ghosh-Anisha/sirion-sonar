import { Link } from "react-router-dom";
import { BrandMark } from "./BrandMark";
import { ClockControl } from "./ClockControl";
import { ViewerChip } from "./ViewerChip";

export function TopBar() {
  return (
    <header className="topbar">
      <Link to="/home" className="topbar__name">
        <BrandMark />
        Sirion Sonar
      </Link>
      <div className="topbar__controls">
        <ClockControl />
        <ViewerChip />
      </div>
    </header>
  );
}
