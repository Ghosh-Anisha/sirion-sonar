import { casePages, whyStart } from "../data/story";
import { CostTiles } from "../story/CostTiles";
import { ProblemMatrix } from "../story/ProblemMatrix";
import { StoryPage } from "../story/StoryPage";

/** The case, 2 of 4: what the problem costs, how much evidence there is, and where the money is. */
export function Problem() {
  return (
    <StoryPage copy={casePages.problem}>
      <CostTiles />
      <ProblemMatrix />
      <p className="story-line">{whyStart.matrixLine}</p>
    </StoryPage>
  );
}
