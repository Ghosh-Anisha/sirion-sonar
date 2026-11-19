import type { ReactNode } from "react";
import type { ThinkingKey } from "../../data/thinking";
import { SectionHead } from "../../story/SectionHead";
import { HoodLink } from "./HoodLink";
import "./Sections.css";

interface SolutionSectionProps {
  id: string;
  kicker: string;
  title: string;
  lead?: string;
  soWhat: string;
  /** The Under the hood note for this section, where one exists. */
  thinking?: ThinkingKey;
  children: ReactNode;
}

/** One section of the architecture: a heading, the content, and a one line so what. */
export function SolutionSection({ id, kicker, title, lead, soWhat, thinking, children }: SolutionSectionProps) {
  return (
    <section id={id} className="sol-section" aria-labelledby={`${id}-title`} data-tour={`solution-${id}`}>
      <div className="sol-section__head">
        <SectionHead id={`${id}-title`} kicker={kicker} headline={title} lead={lead} />
        {thinking && <HoodLink at={thinking} />}
      </div>
      {children}
      <p className="sol-section__so-what">
        <span className="story-kicker">So what</span>
        {soWhat}
      </p>
    </section>
  );
}
