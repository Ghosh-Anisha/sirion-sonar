import { pipelineSteps } from "../../data/architecture";
import "./Architecture.css";

interface PipelineDiagramProps {
  selected: number;
  onSelect: (step: number) => void;
}

/** The eight steps in two rows, read left to right then along the second row. Steps 1 to 6 build the ledger, 7 and 8 push. */
export function PipelineDiagram({ selected, onSelect }: PipelineDiagramProps) {
  const rows = [pipelineSteps.slice(0, 4), pipelineSteps.slice(4)];
  return (
    <div className="pipeline-map" data-tour="pipeline-map" role="group" aria-label="The eight step pipeline">
      {rows.map((row, r) => (
        <ol key={r} className="pipeline-map__row" start={r * 4 + 1}>
          {row.map((step) => (
            <li key={step.number} className="pipeline-map__cell">
              <button
                type="button"
                className={`pipeline-map__step${step.number === selected ? " pipeline-map__step--on" : ""}${step.number >= 7 ? " pipeline-map__step--push" : ""}`}
                aria-pressed={step.number === selected}
                onClick={() => onSelect(step.number)}
              >
                <span className="pipeline-map__num num">{step.number}</span>
                <span className="pipeline-map__name">{step.name}</span>
                <span className={`pipeline-map__ai${step.usesAi ? " pipeline-map__ai--yes" : ""}`}>{step.usesAi ? "Uses AI" : "Code only"}</span>
              </button>
            </li>
          ))}
        </ol>
      ))}
      <p className="pipeline-map__legend">
        <span>Steps 1 to 6 build the ledger.</span>
        <span>Steps 7 and 8 make it push.</span>
        <span>4 of the 8 steps use AI.</span>
      </p>
    </div>
  );
}
