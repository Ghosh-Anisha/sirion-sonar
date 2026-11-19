import type { ComicPanel as Panel } from "../data/story";
import { PanelBuried } from "./panels/PanelBuried";
import { PanelNoFacts } from "./panels/PanelNoFacts";
import { PanelRenewed } from "./panels/PanelRenewed";
import { PanelScattered } from "./panels/PanelScattered";
import { PanelSigned } from "./panels/PanelSigned";
import { PanelWithSonar } from "./panels/PanelWithSonar";

const DRAWINGS: Record<string, () => React.JSX.Element> = {
  signed: PanelSigned,
  scattered: PanelScattered,
  buried: PanelBuried,
  renewed: PanelRenewed,
  "no-facts": PanelNoFacts,
  "with-sonar": PanelWithSonar,
};

/** One comic panel: the drawing, the moment it happens and the caption box. */
export function ComicPanel({ panel, number }: { panel: Panel; number: number }) {
  const Drawing = DRAWINGS[panel.id];
  return (
    <>
      <span className="comic__when label">
        <span className="num">{number}</span> {panel.when}
      </span>
      <svg viewBox="0 0 320 200" className="comic__art" role="img" aria-label={panel.alt}>
        <rect width="320" height="200" fill={panel.id === "with-sonar" ? "var(--brand-soft)" : "var(--bg)"} />
        <Drawing />
      </svg>
      <span className={`comic__caption${panel.id === "with-sonar" ? " comic__caption--sonar" : ""}`}>{panel.caption}</span>
    </>
  );
}
