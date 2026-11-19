import { bubbles } from "../../data/story";
import { Bubble } from "../Bubble";
import { Character } from "../Character";
import { Prop } from "../Prop";

/** Panel 5: at the review Imran has no record that the supplier missed its service level four times. */
export function PanelNoFacts() {
  return (
    <g>
      <rect x="30" y="160" width="260" height="10" rx="3" fill="var(--ink-2)" />
      <Character who="imran" x={70} y={160} worried />
      <g>
        <rect x="230" y="116" width="40" height="44" rx="16" fill="var(--ink-2)" />
        <circle cx="250" cy="102" r="14" fill="var(--unknown-soft)" stroke="var(--line)" />
        <text x="250" y="186" fontSize="10" textAnchor="middle" fill="var(--ink-2)">Supplier</text>
      </g>
      <Prop kind="chart" x={126} y={70} />
      <text x="161" y="132" fontSize="10" textAnchor="middle" fill="var(--urgent)">4 missed, not on record</text>
      <Bubble x={14} y={22} width={100} lines={bubbles.noFacts} tail="left" />
    </g>
  );
}
