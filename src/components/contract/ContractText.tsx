import { useEffect, useRef } from "react";
import type { Contract } from "../../data/types";
import { highlightSegments } from "../../logic/highlight";
import "./ContractText.css";

interface ContractTextProps {
  contract: Contract;
  /** The sentence to mark strongly and scroll to. */
  activeSentence: string | null;
}

/** The contract's clauses, with every quoted sentence marked and the selected one marked strongly. */
export function ContractText({ contract, activeSentence }: ContractTextProps) {
  const activeRef = useRef<HTMLElement>(null);
  const sentences = contract.facts.map((f) => f.sentence);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeSentence]);

  return (
    <article className="contract-text" aria-label="Contract text" data-tour="contract-text">
      <p className="label">{contract.fileName}</p>
      {contract.clauses.map((clause) => (
        <section key={clause.id} className="contract-text__clause">
          <h3>
            {clause.id}. {clause.heading} <span className="contract-text__page">page {clause.page}</span>
          </h3>
          <p>
            {highlightSegments(clause.text, sentences).map((seg, i) => {
              if (!seg.sentence) return <span key={i}>{seg.text}</span>;
              const active = seg.sentence === activeSentence;
              return (
                <mark key={i} className={active ? "cite cite--active" : "cite"} ref={active ? activeRef : undefined}>
                  {seg.text}
                </mark>
              );
            })}
          </p>
        </section>
      ))}
    </article>
  );
}
