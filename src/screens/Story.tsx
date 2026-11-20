import { assumptionsIntro, comicIntro, storyAssumptions, storyClose, whoIsIn, whyStart } from "../data/story";
import { AssumptionMeters } from "../story/AssumptionMeters";
import { ComicStrip } from "../story/ComicStrip";
import { FlipCards } from "../story/FlipCards";
import { ProblemMatrix } from "../story/ProblemMatrix";
import { SectionHead } from "../story/SectionHead";
import { StagePick } from "../story/StagePick";
import { StoryBrief } from "../story/StoryBrief";
import { StoryCosts } from "../story/StoryCosts";
import { StakeholderExplorer } from "../story/StakeholderExplorer";
import { StoryHook } from "../story/StoryHook";
import { StoryNext } from "../story/StoryNext";
import { StoryProgress } from "../story/StoryProgress";
import "../story/Story.css";

/** Page 1: the case brief, the stage we picked and what the problem costs, then the comic, the reasoning, and into the solution. */
export function Story() {
  return (
    <div className="story-page story">
      <StoryProgress />
      <StoryHook />
      <StoryBrief />
      <StagePick />
      <StoryCosts />

      <section id="comic" className="story-section" aria-labelledby="comic-title">
        <SectionHead id="comic-title" kicker={comicIntro.kicker} headline={comicIntro.headline} lead={comicIntro.lead} />
        <ComicStrip />
      </section>

      <section id="why" className="story-section" aria-labelledby="why-title">
        <SectionHead id="why-title" kicker={whyStart.kicker} headline={whyStart.headline} lead={whyStart.lead} />
        <FlipCards />
        <ProblemMatrix />
        <p className="story-line">{whyStart.matrixLine}</p>
      </section>

      <section id="who" className="story-section" aria-labelledby="who-title">
        <SectionHead id="who-title" kicker={whoIsIn.kicker} headline={whoIsIn.headline} lead={whoIsIn.lead} />
        <StakeholderExplorer />
      </section>

      <section id="assumed" className="story-section" aria-labelledby="assumed-title">
        <SectionHead id="assumed-title" kicker={assumptionsIntro.kicker} headline={assumptionsIntro.headline} lead={assumptionsIntro.lead} />
        <AssumptionMeters items={storyAssumptions} />
      </section>

      <StoryNext soWhat={storyClose.soWhat} next={storyClose.next} />
    </div>
  );
}
