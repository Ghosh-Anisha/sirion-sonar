import type { PipelineStep } from "../../data/architecture";
import "./Architecture.css";

function tables(names: string[]): string {
  return names.length === 0 ? "None" : names.join(", ");
}

/** One step of the pipeline in full. */
export function StepDetail({ step }: { step: PipelineStep }) {
  return (
    <section className="step-detail" data-tour="step-detail" aria-live="polite" aria-labelledby="step-detail-title">
      <p className="label">Step {step.number} of 8</p>
      <h3 id="step-detail-title">{step.name}</h3>
      <p>{step.job}</p>
      <dl className="step-detail__list">
        <dt className="label">Done by</dt>
        <dd>
          {step.doneBy}. {step.why}
        </dd>
        <dt className="label">Goes in</dt>
        <dd>{step.input}</dd>
        <dt className="label">Comes out</dt>
        <dd>{step.output}</dd>
        <dt className="label">Reads</dt>
        <dd>{tables(step.reads)}</dd>
        <dt className="label">Writes</dt>
        <dd>{tables(step.writes)}</dd>
        <dt className="label">Access</dt>
        <dd>{step.access}</dd>
        <dt className="label">Never</dt>
        <dd>{step.never}</dd>
      </dl>
    </section>
  );
}
