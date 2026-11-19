import type { ReactNode } from "react";
import type { ThinkingKey } from "../data/thinking";
import { useThinking } from "../state/ThinkingContext";
import { useLit } from "./LitContext";
import "./Solution.css";

interface PartProps {
  id: string;
  thinking: ThinkingKey;
  /** What a screen reader hears, ending with what pressing does. */
  label: string;
  className?: string;
  children: ReactNode;
}

/** One part of the diagram. It lights up when the example touches it, and pressing it opens its Under the hood note. */
export function Part({ id, thinking, label, className, children }: PartProps) {
  const lit = useLit(id);
  const { show } = useThinking();
  return (
    <button
      type="button"
      data-part={id}
      className={`part${lit ? " part--lit" : ""}${className ? ` ${className}` : ""}`}
      aria-label={`${label}. Open under the hood.`}
      onClick={() => show(thinking)}
    >
      {children}
    </button>
  );
}
