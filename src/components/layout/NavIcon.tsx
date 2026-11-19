const PATHS = {
  home: "M2.5 7.5 8 3l5.5 4.5V13a.5.5 0 0 1-.5.5h-3v-4H6v4H3a.5.5 0 0 1-.5-.5Z",
  contracts: "M4 1.5h5.5L12.5 4.5V14a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5ZM9 1.5V5h3.5M5.5 8h5M5.5 10.5h5",
  mail: "M2 3.5h12v9H2ZM2 4l6 4.5L14 4",
  measures: "M2.5 13.5h11M4 11V8M7 11V5M10 11V7M13 11V3",
  privacy: "M8 1.5 13 3.5v4c0 3-2.2 5.6-5 6.5-2.8-.9-5-3.5-5-6.5v-4ZM6 8l1.5 1.5L10.5 6.5",
  sirion: "M2 8h9M8 4.5 11.5 8 8 11.5M13.5 3v10",
  access: "M3 3.5h10M3 6.5h10M3 9.5h10M3 12.5h6",
  how: "M4 4a2 2 0 1 0 0 .01M12 4a2 2 0 1 0 0 .01M8 12a2 2 0 1 0 0 .01M5.5 5.5 7 10.5M10.5 5.5 9 10.5M6 4h4",
  why: "M8 1.5a4.5 4.5 0 0 0-2.5 8.2V11.5h5V9.7A4.5 4.5 0 0 0 8 1.5ZM6 14h4",
  problem: "M8 2 14.5 13.5h-13ZM8 6.5v3M8 11.5v.01",
  stakeholders: "M5.5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM11 7.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM1.5 13c.4-2.2 2-3.5 4-3.5s3.6 1.3 4 3.5M10 9.6c1.9-.3 3.6.8 4.3 3.4",
  assumptions: "M3.5 14V2M3.5 2.5h8l-1.5 3 1.5 3h-8",
} as const;

export type NavIconName = keyof typeof PATHS;

/** A small line icon for the side nav. Always next to its text, so hidden from screen readers. */
export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
