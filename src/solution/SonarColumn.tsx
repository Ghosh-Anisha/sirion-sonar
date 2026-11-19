import { useState } from "react";
import { stepDoers, type DoerKind } from "../data/architecture";
import { doerNames, solution, solutionAgents, solutionSteps } from "../data/story";
import { Part } from "./Part";

const KINDS: DoerKind[] = ["code", "rules", "model", "agent"];

/**
 * Column 3: the eight steps, each colored and tagged by who does it, the five agents, and the privacy band.
 * The legend is a set of toggles: picking a kind dims every step that does not use it.
 */
export function SonarColumn() {
  const [only, setOnly] = useState<DoerKind | null>(null);
  return (
    <div className="sonar">
      <ol className="sonar__steps" aria-label="The eight steps">
        {solutionSteps.map((s) => {
          const kinds = stepDoers[s.number];
          const tag = kinds.map((k) => doerNames[k]).join(" + ");
          const dim = only !== null && !kinds.includes(only);
          return (
            <li key={s.number} className={dim ? "step-chip--dim" : undefined}>
              <Part id={`step-${s.number}`} thinking={s.thinking} label={`Step ${s.number}, ${s.name}, done by ${tag}`} className={`step-chip step-chip--${kinds[0]}${kinds[1] ? ` step-chip--then-${kinds[1]}` : ""}`}>
                <span className="step-chip__name">
                  <span className="num">{s.number}</span> {s.name}
                </span>
                <span className="step-chip__tag">{tag}</span>
              </Part>
            </li>
          );
        })}
      </ol>
      <div className="sonar__legend" role="group" aria-label="Show only steps done by">
        {KINDS.map((k) => (
          <button key={k} type="button" className={`legend-toggle${only === k ? " legend-toggle--on" : ""}`} aria-pressed={only === k} onClick={() => setOnly(only === k ? null : k)}>
            <span className={`legend-swatch step-chip--${k}`} aria-hidden="true" /> {doerNames[k]}
          </button>
        ))}
      </div>
      <ul className="sonar__agents" aria-label="The five agents">
        {solutionAgents.map((a) => (
          <li key={a.id}>
            <Part id={`agent-${a.id}`} thinking={a.thinking} label={`${a.name}: ${a.job}`} className="agent-badge">
              <span className="agent-badge__dot" aria-hidden="true">
                {a.name[0]}
              </span>
              <span className="agent-badge__text">
                <strong>{a.name}</strong>
                <span>{a.job}</span>
              </span>
            </Part>
          </li>
        ))}
      </ul>
      <Part id="privacy" thinking="contract.facts" label={solution.privacy} className="privacy-band">
        {solution.privacy}
      </Part>
    </div>
  );
}
