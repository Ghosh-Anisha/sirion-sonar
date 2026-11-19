import { assumptionsIntro, comicIntro, storyAssumptions, storyClose, whoIsIn, whyStart } from "../data/story";
import { AssumptionMeters } from "../story/AssumptionMeters";
import { ComicStrip } from "../story/ComicStrip";
import { FlipCards } from "../story/FlipCards";
import { ProblemMatrix } from "../story/ProblemMatrix";
import { SectionHead } from "../story/SectionHead";
import { StakeholderExplorer } from "../story/StakeholderExplorer";
import { StoryHook } from "../story/StoryHook";
import { StoryNext } from "../story/StoryNext";
import { StoryProgress } from "../story/StoryProgress";
import "../story/Story.css";

/** Page 1: the problem as a comic, then the reasoning, then into the solution. */
export function Story() {
  return (
    <div className="story-page story">
      <StoryProgress />
      <StoryHook />

      <section id="comic" className="story-section" aria-labelledby="comic-title">
        <SectionHead id="comic-title" kicker={comicIntro.kicker} headline={comicIntro.headline} lead={comicIntro.lead} />
        <ComicStrip />
      </section>

      <section className="story-section" aria-labelledby="why-title">
        <SectionHead id="why-title" kicker={whyStart.kicker} headline={whyStart.headline} lead={whyStart.lead} />
        <FlipCards />
        <ProblemMatrix />
        <p className="story-line">{whyStart.matrixLine}</p>
      </section>

      <section className="story-section" aria-labelledby="who-title">
        <SectionHead id="who-title" kicker={whoIsIn.kicker} headline={whoIsIn.headline} lead={whoIsIn.lead} />
        <StakeholderExplorer />
      </section>

      <section className="story-section" aria-labelledby="assumed-title">
        <SectionHead id="assumed-title" kicker={assumptionsIntro.kicker} headline={assumptionsIntro.headline} lead={assumptionsIntro.lead} />
        <AssumptionMeters items={storyAssumptions} />
      </section>

      <StoryNext soWhat={storyClose.soWhat} next={storyClose.next} />
    </div>
  );
}
