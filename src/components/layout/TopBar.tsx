import { Link } from "react-router-dom";
import { COMPANY_NAME } from "../../data/drafts";
import { ClockControl } from "./ClockControl";
import { ViewerChip } from "./ViewerChip";

/** The product's own bar inside Try it: the sample company's workspace, the demo clock and who is signed in. */
export function TopBar() {
  return (
    <header className="topbar">
      <Link to="/home" className="topbar__name">
        <span className="topbar__workspace label">Workspace</span>
        {COMPANY_NAME}
      </Link>
      <div className="topbar__controls">
        <ClockControl />
        <ViewerChip />
      </div>
    </header>
  );
}
