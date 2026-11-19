/** Original line icons for the solution diagram. Always next to text, so hidden from screen readers. */
const PATHS = {
  mail: "M3 6h18v12H3ZM3 7l9 6 9-6",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 2",
  invoice: "M6 3h12v18l-3-2-3 2-3-2-3 2ZM9 8h6M9 12h6",
  coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4M12 7.5v9",
  ledger: "M4 5h16v14H4ZM4 9h16M9 9v10",
  drive: "M3 17h18l-3-10H6ZM7 17v2M17 17v2",
  person: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21c1-4 3.6-6 7-6s6 2 7 6",
} as const;

export type SolutionIconName = keyof typeof PATHS;

export function SolutionIcon({ name, size = 20 }: { name: SolutionIconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
