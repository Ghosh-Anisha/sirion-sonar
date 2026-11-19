/*
 * The three people in the comic, drawn flat from the waist up in the brand palette.
 * Original characters: Meera owns a marketing tool, Raj works in Finance, Imran runs Procurement.
 */

export type Who = "meera" | "raj" | "imran";

const LOOK: Record<Who, { shirt: string; hair: string; long: boolean }> = {
  meera: { shirt: "var(--find)", hair: "var(--ink)", long: true },
  raj: { shirt: "var(--check)", hair: "var(--ink-2)", long: false },
  imran: { shirt: "var(--decide)", hair: "var(--ink)", long: false },
};

interface CharacterProps {
  who: Who;
  x: number;
  y: number;
  scale?: number;
  /** A worried mouth instead of a smile. */
  worried?: boolean;
  /** Draws the figure faded, for someone in the background. */
  faded?: boolean;
}

/** One figure. (x, y) is the bottom centre of the body. */
export function Character({ who, x, y, scale = 1, worried = false, faded = false }: CharacterProps) {
  const look = LOOK[who];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={faded ? 0.55 : 1}>
      {look.long && <path d="M-16 -60 q0 -24 16 -24 q16 0 16 24 v26 h-32z" fill={look.hair} />}
      <rect x="-20" y="-44" width="40" height="44" rx="16" fill={look.shirt} />
      <rect x="-4" y="-50" width="8" height="8" fill="var(--check-soft)" />
      <circle cx="0" cy="-62" r="14" fill="var(--check-soft)" stroke="var(--line)" />
      <path d="M-14 -64 q2 -15 14 -15 q12 0 14 15 q-7 -7 -14 -7 q-7 0 -14 7z" fill={look.hair} />
      <circle cx="-5" cy="-61" r="1.6" fill="var(--ink)" />
      <circle cx="5" cy="-61" r="1.6" fill="var(--ink)" />
      <path d={worried ? "M-4 -53 q4 -3 8 0" : "M-4 -55 q4 4 8 0"} fill="none" stroke="var(--ink)" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}
