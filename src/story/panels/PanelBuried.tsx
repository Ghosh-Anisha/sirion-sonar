import { bubbles } from "../../data/story";
import { Bubble } from "../Bubble";
import { Prop } from "../Prop";

/** Panel 3: eleven months later the renewal notice is buried in a full inbox, and the window closes on a Friday. */
export function PanelBuried() {
  return (
    <g>
      <rect x="24" y="30" width="170" height="150" rx="6" fill="var(--surface)" stroke="var(--ink-2)" />
      <text x="34" y="48" fontSize="10" fontWeight="600" fill="var(--ink)">Inbox, 43 unread</text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x="34" y={58 + i * 19} width="150" height="14" rx="2" fill={i === 4 ? "var(--check-soft)" : "var(--bg)"} />
          <path d={`M40 ${65 + i * 19} h${60 + ((i * 23) % 50)}`} stroke="var(--line)" strokeWidth="3" />
        </g>
      ))}
      <text x="40" y="145" fontSize="10" fill="var(--check)">Renewal notice</text>
      <Prop kind="calendar" x={230} y={96} label="Fri" />
      <circle cx="250" cy="120" r="20" fill="none" stroke="var(--urgent)" strokeWidth="2" />
      <text x="250" y="160" fontSize="10" textAnchor="middle" fill="var(--urgent)">Window closes</text>
      <Bubble x={200} y={22} width={110} lines={bubbles.buried} tail="none" />
    </g>
  );
}
