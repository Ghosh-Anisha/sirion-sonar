import { bubbles } from "../../data/story";
import { Bubble } from "../Bubble";
import { Character } from "../Character";
import { Prop } from "../Prop";

/** Panel 2: the file lands in downloads, a shared drive and a spreadsheet row, with no owner and no dates. */
export function PanelScattered() {
  const arrow = (x: number) => <path d={`M${x} 104 h22 m-6 -5 l6 5 l-6 5`} fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />;
  return (
    <g>
      <Prop kind="folder" x={22} y={86} label="Downloads" />
      {arrow(70)}
      <Prop kind="folder" x={100} y={86} label="Shared" />
      {arrow(148)}
      <Prop kind="sheet" x={178} y={88} />
      <text x="201" y="136" fontSize="10" textAnchor="middle" fill="var(--ink-2)">Row 412</text>
      <text x="22" y="148" fontSize="10" fill="var(--urgent)">Owner: none</text>
      <text x="22" y="162" fontSize="10" fill="var(--urgent)">End date: none</text>
      <Character who="meera" x={268} y={196} worried />
      <Bubble x={180} y={20} width={120} lines={bubbles.scattered} tail="right" />
    </g>
  );
}
