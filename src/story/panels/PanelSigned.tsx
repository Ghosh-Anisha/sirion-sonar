import { bubbles } from "../../data/story";
import { Bubble } from "../Bubble";
import { Character } from "../Character";
import { Prop } from "../Prop";

/** Panel 1: Monday. Meera emails a supplier and signs a one year order form. */
export function PanelSigned() {
  return (
    <g>
      <Prop kind="desk" x={30} y={170} />
      <Character who="meera" x={70} y={170} />
      <Prop kind="laptop" x={98} y={134} />
      <Bubble x={20} y={20} width={130} lines={bubbles.signed} tail="left" />
      <path d="M170 120 q40 -40 80 -10" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeDasharray="4 4" />
      <Prop kind="envelope" x={196} y={84} />
      <rect x="240" y="104" width="56" height="70" rx="3" fill="var(--decide-soft)" stroke="var(--decide)" />
      <text x="268" y="128" fontSize="10" textAnchor="middle" fill="var(--ink)">Supplier</text>
      <Prop kind="doc" x={255} y={136} scale={0.8} />
      <text x="282" y="170" fontSize="10" fill="var(--find)">Signed</text>
    </g>
  );
}
