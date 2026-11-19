import type { ThinkingKey } from "../../data/thinking";
import { thinkingNote } from "../../data/thinking";
import { useThinking } from "../../state/ThinkingContext";
import "./Sections.css";

/** A small button that opens the Under the hood drawer for one part. */
export function HoodLink({ at }: { at: ThinkingKey }) {
  const { show } = useThinking();
  return (
    <button type="button" className="hood-link" onClick={() => show(at)} aria-label={`Under the hood: ${thinkingNote(at).title}`}>
      Under the hood
    </button>
  );
}
