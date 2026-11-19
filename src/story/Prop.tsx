/** The objects in the comic, each a few flat shapes in the brand palette. (x, y) is the top left corner. */

export type PropKind = "laptop" | "envelope" | "folder" | "sheet" | "doc" | "calendar" | "invoice" | "chart" | "phone" | "desk";

interface PropProps {
  kind: PropKind;
  x: number;
  y: number;
  scale?: number;
  /** A word drawn on the prop, such as a day on the calendar. */
  label?: string;
}

export function Prop({ kind, x, y, scale = 1, label }: PropProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {kind === "laptop" && (
        <>
          <rect x="0" y="0" width="56" height="36" rx="3" fill="var(--ink)" />
          <rect x="4" y="4" width="48" height="28" rx="1" fill="var(--brand-soft)" />
          <rect x="-6" y="36" width="68" height="5" rx="2" fill="var(--ink-2)" />
        </>
      )}
      {kind === "envelope" && (
        <>
          <rect x="0" y="0" width="34" height="22" rx="2" fill="var(--surface)" stroke="var(--ink-2)" />
          <path d="M1 1 l16 12 l16 -12" fill="none" stroke="var(--ink-2)" />
        </>
      )}
      {kind === "folder" && (
        <>
          <path d="M0 4 h14 l4 4 h22 v26 h-40z" fill="var(--check-soft)" stroke="var(--check)" />
          {label && <text x="20" y="27" fontSize="10" textAnchor="middle" fill="var(--ink)">{label}</text>}
        </>
      )}
      {kind === "sheet" && (
        <>
          <rect x="0" y="0" width="46" height="34" fill="var(--surface)" stroke="var(--confirmed)" />
          {[9, 17, 25].map((r) => <path key={r} d={`M0 ${r} h46`} stroke="var(--confirmed-soft)" strokeWidth="2" />)}
          <path d="M15 0 v34 M30 0 v34" stroke="var(--confirmed-soft)" strokeWidth="2" />
          <rect x="0" y="0" width="46" height="34" fill="none" stroke="var(--confirmed)" />
        </>
      )}
      {kind === "doc" && (
        <>
          <path d="M0 0 h18 l8 8 v28 h-26z" fill="var(--surface)" stroke="var(--ink-2)" />
          <path d="M5 14 h15 M5 20 h15 M5 26 h10" stroke="var(--line)" strokeWidth="2" />
        </>
      )}
      {kind === "calendar" && (
        <>
          <rect x="0" y="0" width="40" height="38" rx="4" fill="var(--surface)" stroke="var(--ink-2)" />
          <rect x="0" y="0" width="40" height="10" rx="4" fill="var(--urgent)" />
          <text x="20" y="29" fontSize="11" fontWeight="600" textAnchor="middle" fill="var(--ink)">{label}</text>
        </>
      )}
      {kind === "invoice" && (
        <>
          <rect x="0" y="0" width="44" height="54" rx="2" fill="var(--surface)" stroke="var(--ink-2)" />
          <path d="M6 10 h22 M6 18 h30 M6 26 h18" stroke="var(--line)" strokeWidth="2" />
          <text x="38" y="44" fontSize="10" fontWeight="600" textAnchor="end" fill="var(--urgent)">{label}</text>
        </>
      )}
      {kind === "chart" && (
        <>
          <rect x="0" y="0" width="70" height="46" rx="3" fill="var(--surface)" stroke="var(--ink-2)" />
          {[8, 20, 32, 44, 56].map((cx, i) => (
            <rect key={cx} x={cx} y={i % 2 ? 14 : 22} width="7" height={i % 2 ? 26 : 18} fill={i === 2 ? "var(--confirmed)" : "var(--urgent)"} />
          ))}
        </>
      )}
      {kind === "phone" && (
        <>
          <rect x="0" y="0" width="30" height="52" rx="5" fill="var(--ink)" />
          <rect x="3" y="6" width="24" height="38" rx="2" fill="var(--brand-soft)" />
          <circle cx="15" cy="20" r="6" fill="var(--brand)" />
        </>
      )}
      {kind === "desk" && <rect x="0" y="0" width="120" height="10" rx="3" fill="var(--ink-2)" />}
    </g>
  );
}
