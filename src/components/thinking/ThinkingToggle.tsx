import { useThinking } from "../../state/ThinkingContext";
import "./Thinking.css";

/** A switch in the top bar that shows or hides the Under the hood badges. */
export function ThinkingToggle() {
  const { on, setOn } = useThinking();
  return (
    <button type="button" role="switch" aria-checked={on} className="thinking-toggle" onClick={() => setOn(!on)}>
      <span className="thinking-toggle__track" aria-hidden="true">
        <span className="thinking-toggle__thumb" />
      </span>
      Show the thinking
    </button>
  );
}
