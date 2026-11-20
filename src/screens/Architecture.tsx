import { useSearchParams } from "react-router-dom";
import { pipelineSteps } from "../data/architecture";
import { AgentMap } from "../components/architecture/AgentMap";
import { AiTable } from "../components/architecture/AiTable";
import { DataMap } from "../components/architecture/DataMap";
import { PipelineDiagram } from "../components/architecture/PipelineDiagram";
import { PushTable } from "../components/architecture/PushTable";
import { StepDetail } from "../components/architecture/StepDetail";
import "../components/architecture/Architecture.css";

/** How it works: the pipeline, the agents, where AI is used, where data lives, and how it pushes. */
export function Architecture() {
  const [params, setParams] = useSearchParams();
  const asked = Number(params.get("step"));
  const step = pipelineSteps.find((s) => s.number === asked) ?? pipelineSteps[0];

  return (
    <div className="stack architecture">
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>How it works</h1>
        <p className="muted">
          Sonar builds a ledger of the company's supplier contracts by finding them itself, then watches it and tells the right
          person when something needs them. Code does most of the work. A model is used in four of the eight steps, through a model call or an agent.
        </p>
      </header>

      <section className="stack" aria-labelledby="pipeline-title">
        <h2 id="pipeline-title">The pipeline</h2>
        <p className="muted">Pick a step to see what it does.</p>
        <PipelineDiagram selected={step.number} onSelect={(n) => setParams({ step: String(n) }, { replace: true })} />
        <StepDetail step={step} />
      </section>

      <section className="stack" aria-labelledby="agents-title">
        <h2 id="agents-title">The five agents</h2>
        <p className="muted">An agent is a model that picks its own next step in a loop, with read-only tools, a step limit and a log. Each has one job.</p>
        <AgentMap />
      </section>

      <section className="stack" aria-labelledby="ai-title">
        <h2 id="ai-title">Where AI is used and where it is not</h2>
        <AiTable />
      </section>

      <section className="stack" aria-labelledby="data-title">
        <h2 id="data-title">Where data lives</h2>
        <DataMap />
      </section>

      <section className="stack" aria-labelledby="push-title">
        <h2 id="push-title">How it pushes</h2>
        <p className="muted">
          Built to reach people who never open it, because a company that does not know what to look for cannot ask. An item
          with no owner goes straight to the procurement lead.
        </p>
        <PushTable />
      </section>
    </div>
  );
}
