import type { ThinkingKey } from "../../data/thinking";
import { useThinking } from "../../state/ThinkingContext";
import "./Guide.css";

/** A small link that opens the Under the hood drawer for this item, whether or not Show the thinking is on. */
export function WhyLink({ at }: { at: ThinkingKey }) {
  const { show } = useThinking();
  return (
    <button type="button" className="why-link" onClick={() => show(at)}>
      Why am I seeing this
    </button>
  );
}
