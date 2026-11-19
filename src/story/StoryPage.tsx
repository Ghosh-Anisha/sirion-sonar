import type { ReactNode } from "react";
import type { StoryPageCopy } from "../data/story";
import { StoryNext } from "./StoryNext";
import "./Story.css";

/** A short page in the story layer: a kicker, a one-sentence headline, up to three lines, one visual, a so what and Next. */
export function StoryPage({ copy, children }: { copy: StoryPageCopy; children: ReactNode }) {
  return (
    <div className="story-page story-page--short">
      <header className="section-head" data-tour="story-head">
        <p className="story-kicker">{copy.kicker}</p>
        <h1 className="story-headline">{copy.headline}</h1>
        {copy.lines.map((line) => (
          <p key={line} className="story-lead">
            {line}
          </p>
        ))}
      </header>
      <div className="story-visual" data-tour="story-visual">
        {children}
      </div>
      <StoryNext soWhat={copy.soWhat} next={copy.next} />
    </div>
  );
}
