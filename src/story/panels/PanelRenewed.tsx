import { bubbles } from "../../data/story";
import { Bubble } from "../Bubble";
import { Character } from "../Character";
import { Prop } from "../Prop";

/** Panel 4: the contract renews for a year, and Raj pays an invoice above the agreed price. */
export function PanelRenewed() {
  return (
    <g>
      <Prop kind="desk" x={20} y={170} />
      <Character who="raj" x={66} y={170} />
      <Prop kind="invoice" x={100} y={112} label="+18%" />
      <g transform="rotate(-12 170 70)">
        <rect x="132" y="56" width="60" height="22" rx="3" fill="none" stroke="var(--urgent)" strokeWidth="2" />
        <text x="162" y="72" fontSize="12" fontWeight="600" textAnchor="middle" fill="var(--urgent)">PAID</text>
      </g>
      <Prop kind="calendar" x={236} y={60} label="+1 yr" />
      <text x="256" y="118" fontSize="10" textAnchor="middle" fill="var(--ink-2)">Renewed</text>
      <path d="M220 150 h80" stroke="var(--line)" strokeWidth="2" />
      <text x="260" y="168" fontSize="10" textAnchor="middle" fill="var(--ink-2)">Agreed: Rs 1,000</text>
      <text x="260" y="182" fontSize="10" textAnchor="middle" fill="var(--urgent)">Billed: Rs 1,180</text>
      <Bubble x={18} y={20} width={96} lines={bubbles.renewed} tail="left" />
    </g>
  );
}
