import { assumptions } from "../data/caseStudy";
import { assumptionSettled, casePages } from "../data/story";
import { AssumptionMeters } from "../story/AssumptionMeters";
import { StoryPage } from "../story/StoryPage";

const items = assumptions.map((a, i) => ({ text: a.text, settled: assumptionSettled[i], leastSettled: a.leastSettled, link: a.playsOut }));

/** The case, 4 of 4: every assumption with how settled it is, the access one marked least settled. */
export function Assumptions() {
  return (
    <StoryPage copy={casePages.assumptions}>
      <AssumptionMeters items={items} />
    </StoryPage>
  );
}
