import {
  accessRules,
  accessSoWhat,
  afterIntake,
  agentsSoWhat,
  backend,
  dataControls,
  dataControlsSoWhat,
  evalLoop,
  evalRule,
  evals,
  evalsIntro,
  evalsSoWhat,
  overviewSoWhat,
  roleAccess,
  sourceAccess,
  stepPermissions,
} from "../data/architecture";
import { solution } from "../data/story";
import { AuditTrail } from "../solution/AuditTrail";
import { SolutionDiagram } from "../solution/SolutionDiagram";
import { AfterIntake } from "../solution/sections/AfterIntake";
import { AgentLadder } from "../solution/sections/AgentLadder";
import { BackendDiagram } from "../solution/sections/BackendDiagram";
import { DocControlsPanel } from "../solution/sections/DocControlsPanel";
import { ReleaseChart } from "../solution/sections/ReleaseChart";
import { RoleTryIt } from "../solution/sections/RoleTryIt";
import { SimpleTable } from "../solution/sections/SimpleTable";
import { SolutionNav } from "../solution/sections/SolutionNav";
import { SolutionSection } from "../solution/sections/SolutionSection";
import { StepReasons } from "../solution/sections/StepReasons";
import { StoryNext } from "../story/StoryNext";
import "../story/Story.css";
import "../solution/Solution.css";

/** Page 2: the whole architecture, from the intake diagram to what happens after it, the backend, the controls and the evals. */
export function Solution() {
  return (
    <div className="story-page solution-page">
      <header className="section-head" data-tour="story-head">
        <p className="story-kicker">{solution.kicker}</p>
        <h1 className="story-headline">{solution.headline}</h1>
        <p className="story-lead">{solution.lead}</p>
      </header>
      <SolutionNav />

      <SolutionSection id="overview" kicker="Overview" title="From what happens in the company to the person who acts." soWhat={overviewSoWhat} thinking="welcome.first-read">
        <SolutionDiagram />
        <div className="bottom-strip">
          <div className="today" data-tour="solution-today">
            <p className="story-kicker">{solution.today.title}</p>
            <p>{solution.today.line}</p>
          </div>
          <AuditTrail />
        </div>
        <section className="stack" aria-labelledby="real-title" data-tour="solution-real">
          <h3 id="real-title">{solution.realTitle}</h3>
          <SimpleTable caption={solution.realTitle} columns={["Part", "In the prototype"]} rows={solution.real.map((r) => [r.part, r.how])} />
        </section>
      </SolutionSection>

      <SolutionSection id="after-intake" kicker="After intake" title="Where Sirion picks up." soWhat={afterIntake.soWhat}>
        <AfterIntake />
      </SolutionSection>

      <SolutionSection id="agents" kicker="Agents and where not" title="Where we use agents, and where we do not." lead="Reach for the lightest tool that works." soWhat={agentsSoWhat} thinking="contract.facts">
        <AgentLadder />
        <StepReasons />
      </SolutionSection>

      <SolutionSection id="backend" kicker="Backend" title={backend.title + "."} soWhat={backend.soWhat} thinking="welcome.first-read">
        <BackendDiagram />
      </SolutionSection>

      <SolutionSection id="data-controls" kicker="Data controls" title="What happens to the data, and why." soWhat={dataControlsSoWhat} thinking="contract.text">
        <SimpleTable caption="Data controls" columns={["Control", "What we do", "Why"]} rows={dataControls.map((c) => [c.control, c.what, c.why])} tour="solution-data-table" />
        <DocControlsPanel />
      </SolutionSection>

      <SolutionSection id="access-controls" kicker="Access controls" title="Who can see and do what, people and agents alike." soWhat={accessSoWhat} thinking="welcome.approval">
        <h3>People</h3>
        <SimpleTable caption="What each role sees and can do" columns={["Role", "Sees", "Can do", "Does not see"]} rows={roleAccess.map((r) => [r.role, r.sees, r.canDo, r.doesNotSee])} />
        <RoleTryIt />
        <h3>Sources</h3>
        <SimpleTable caption="What each source is allowed" columns={["Source", "Access"]} rows={sourceAccess.map((r) => [r.source, r.scope])} />
        <h3>Each step and agent</h3>
        <SimpleTable caption="What each step and agent can and cannot touch" columns={["Step or agent", "Can", "Cannot"]} rows={stepPermissions.map((r) => [r.who, r.can, r.cannot])} />
        <ul className="rules-list">
          {accessRules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </SolutionSection>

      <SolutionSection id="evals" kicker="Evals" title="How we know the AI parts work." lead={evalsIntro} soWhat={evalsSoWhat} thinking="contract.facts">
        <SimpleTable caption="Evals" columns={["Eval", "What it measures", "How it is scored", "Starting bar"]} rows={evals.map((e) => [e.name, e.measures, e.scored, e.bar])} tour="solution-evals-table" />
        <p className="eval-rule" role="note">
          <strong>The rule.</strong> {evalRule} {evalLoop}
        </p>
        <ReleaseChart />
      </SolutionSection>

      <StoryNext soWhat={solution.soWhat} next={solution.next} />
    </div>
  );
}
