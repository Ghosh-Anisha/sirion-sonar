import { casePages } from "../data/story";
import { CostTiles } from "../story/CostTiles";
import { StoryPage } from "../story/StoryPage";

/** The case, 2 of 4: what the problem costs, and how much evidence there is. */
export function Problem() {
  return (
    <StoryPage copy={casePages.problem}>
      <CostTiles />
    </StoryPage>
  );
}
