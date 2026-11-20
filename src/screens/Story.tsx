import { assumptionsIntro, comicIntro, storyAssumptions, storyClose, whoIsIn } from "../data/story";
import { AssumptionMeters } from "../story/AssumptionMeters";
import { ComicStrip } from "../story/ComicStrip";
import { SectionHead } from "../story/SectionHead";
import { StagePick } from "../story/StagePick";
import { StoryBrief } from "../story/StoryBrief";
import { StoryCosts } from "../story/StoryCosts";
import { StakeholderExplorer } from "../story/StakeholderExplorer";
import { StoryHook } from "../story/StoryHook";
import { StoryNext } from "../story/StoryNext";
import { StoryProgress } from "../story/StoryProgress";
import "../story/Story.css";

/** Page 1: the comic, the case behind it, the stage we picked, what it costs, who is in it, and into the solution. */
export function Story() {
  return (
    <div className="story-page story">
      <StoryProgress />
      <StoryHook />

      <section id="comic" className="story-section" aria-labelledby="comic-title">
        <SectionHead id="comic-title" kicker={comicIntro.kicker} headline={comicIntro.headline} lead={comicIntro.lead} />
        <ComicStrip />
      </section>

      <StoryBrief />
      <StagePick />
      <StoryCosts />

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
