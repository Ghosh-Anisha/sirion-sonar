import { bubbles } from "../../data/story";
import { Bubble } from "../Bubble";
import { Character } from "../Character";
import { Prop } from "../Prop";

/** Panel 6: with Sirion Sonar the date comes to Meera ninety days ahead, and Imran sees it if she does nothing. */
export function PanelWithSonar() {
  return (
    <g>
      <Character who="meera" x={70} y={196} />
      <Prop kind="phone" x={104} y={120} />
      <Bubble x={120} y={26} width={186} lines={bubbles.sonar} tail="left" tone="brand" />
      <text x="128" y="78" fontSize="10" fill="var(--brand)">90 days before the deadline</text>
      <g transform="translate(250 110)">
        <Character who="imran" x={0} y={86} scale={0.7} faded />
        <circle cx="22" cy="18" r="9" fill="var(--find-soft)" stroke="var(--find)" />
        <path d="M22 13 v6 M22 22 v0.5" stroke="var(--find)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <text x="312" y="104" fontSize="10" textAnchor="end" fill="var(--ink-2)">If she does nothing</text>
    </g>
  );
}
