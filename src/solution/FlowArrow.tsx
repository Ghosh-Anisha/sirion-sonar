/** An arrow between two columns of the diagram, with a gentle moving dash. Points down when the diagram stacks. */
export function FlowArrow() {
  return (
    <span className="flow-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path className="flow-arrow__line" d="M2 12h17" />
        <path d="M15 7l5 5-5 5" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
