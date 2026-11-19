/** The Sonar mark: rings going out from a point, on a teal to blue tile. */
export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
        <path d="M5.2 5.2a4 4 0 0 0 0 5.6M10.8 5.2a4 4 0 0 1 0 5.6M3 3a7 7 0 0 0 0 10M13 3a7 7 0 0 1 0 10" />
      </svg>
    </span>
  );
}
