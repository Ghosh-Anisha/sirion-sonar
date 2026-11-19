import { useLocation } from "react-router-dom";
import { tourScreenFor } from "../../data/tours";
import { useGuide } from "../../state/GuideContext";
import { resetDemo } from "../../state/resetDemo";
import { Button } from "../ui/Button";
import "./Guide.css";

/** Tour, Demo guide and Reset demo, in the top bar. */
export function TopBarActions() {
  const { pathname } = useLocation();
  const { open, setOpen, startTour } = useGuide();
  const screen = tourScreenFor(pathname);

  return (
    <div className="row topbar-actions">
      <Button variant="quiet" data-tour="topbar-tour" disabled={!screen} onClick={() => screen && startTour(screen)}>
        Tour
      </Button>
      <Button variant="quiet" data-tour="topbar-guide" aria-expanded={open} aria-controls="demo-guide" onClick={() => setOpen(!open)}>
        Demo guide
      </Button>
      <Button variant="quiet" onClick={resetDemo}>
        Reset demo
      </Button>
    </div>
  );
}
