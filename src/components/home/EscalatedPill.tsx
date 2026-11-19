import "./DueChip.css";

/** Marks an item nobody acted on, now also with the procurement lead. */
export function EscalatedPill({ leadName }: { leadName: string }) {
  return <span className="escalated-pill">No action yet, also sent to {leadName}</span>;
}
