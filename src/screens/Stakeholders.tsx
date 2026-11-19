import { useSearchParams } from "react-router-dom";
import { casePages } from "../data/story";
import { StakeholderExplorer } from "../story/StakeholderExplorer";
import { StoryPage } from "../story/StoryPage";

/** The case, 3 of 4: the power and interest map and the conflicts. A link can open a conflict, as in ?conflict=renewal. */
export function Stakeholders() {
  const [params] = useSearchParams();
  return (
    <StoryPage copy={casePages.stakeholders}>
      <StakeholderExplorer initialConflict={params.get("conflict")} />
    </StoryPage>
  );
}
