interface BubbleProps {
  x: number;
  y: number;
  width: number;
  lines: string[];
  /** Where the tail points: down left, down right, or none for a caption on a screen. */
  tail?: "left" | "right" | "none";
  tone?: "plain" | "brand";
}

const LINE = 13;

/** A speech bubble with one to three short lines. (x, y) is its top left corner. */
export function Bubble({ x, y, width, lines, tail = "left", tone = "plain" }: BubbleProps) {
  const height = lines.length * LINE + 12;
  const fill = tone === "brand" ? "var(--brand-soft)" : "var(--surface)";
  const stroke = tone === "brand" ? "var(--brand)" : "var(--ink-2)";
  const tx = tail === "left" ? x + 16 : x + width - 24;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="10" fill={fill} stroke={stroke} strokeWidth="1.2" />
      {tail !== "none" && <path d={`M${tx} ${y + height - 0.6} l4 10 l6 -10z`} fill={fill} stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" />}
      {tail !== "none" && <path d={`M${tx + 1} ${y + height - 1} h8`} stroke={fill} strokeWidth="2" />}
      {lines.map((line, i) => (
        <text key={line} x={x + 10} y={y + 18 + i * LINE} fontSize="11" fill="var(--ink)">
          {line}
        </text>
      ))}
    </g>
  );
}
