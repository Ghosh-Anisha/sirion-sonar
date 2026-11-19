const PATHS = {
  decide: "M8 14V8M8 8 4 4M8 8l4-4M4 4v3M4 4h3M12 4v3M12 4H9",
  check: "M4 2h8v12l-2-1.5L8 14l-2-1.5L4 14ZM6 6h4M6 9h4",
  fix: "M10 2.5a3 3 0 0 0-3.4 4L2.5 10.6l2.9 2.9 4.1-4.1a3 3 0 0 0 4-3.4L11.6 8 9.5 7.5 9 5.4Z",
  find: "M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10ZM10.5 10.5 14 14",
  confirmed: "M3 8.5 6.5 12 13 4.5",
  derived: "M2 8h10M9 4.5 12.5 8 9 11.5",
  bounded: "M5 3H3v10h2M11 3h2v10h-2M6.5 8h3",
  unknown: "M6 6a2 2 0 1 1 3 1.7c-.7.4-1 .9-1 1.6M8 12v.01",
  urgent: "M8 2 14.5 13.5h-13ZM8 6.5v3M8 11.5v.01",
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
}

/** Decorative line icon. Always paired with text, so it is hidden from screen readers. */
export function Icon({ name, size = 12 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
