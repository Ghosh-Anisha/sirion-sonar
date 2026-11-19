import { thinkingNote, type ThinkingKey } from "../../data/thinking";
import { stepsLabel } from "../../logic/thinkingText";
import { useThinking } from "../../state/ThinkingContext";
import "./Thinking.css";

/** A small badge next to a part of the screen. Shown only while Show the thinking is on. */
export function ThinkingBadge({ at }: { at: ThinkingKey }) {
  const { on, show } = useThinking();
  if (!on) return null;
  const note = thinkingNote(at);
  const steps = stepsLabel(note.steps);
  return (
    <button type="button" className="thinking-badge" onClick={() => show(at)} aria-label={`Under the hood: ${note.title}, ${steps}`}>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" strokeLinecap="round" />
      </svg>
      <span aria-hidden="true">{steps}</span>
    </button>
  );
}
