import { casePages } from "../data/story";
import { FlipCards } from "../story/FlipCards";
import { StoryPage } from "../story/StoryPage";

/** The case, 1 of 4: why intake, as four cards that turn over for the evidence. */
export function Why() {
  return (
    <StoryPage copy={casePages.why}>
      <FlipCards />
    </StoryPage>
  );
}
