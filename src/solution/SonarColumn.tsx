import { doerNames, solution, solutionAgents, solutionSteps } from "../data/story";
import { Part } from "./Part";

/** Column 3: the eight steps colored by who does them, the five agents, and the privacy band. */
export function SonarColumn() {
  return (
    <div className="sonar">
      <ol className="sonar__steps" aria-label="The eight steps">
        {solutionSteps.map((s) => (
          <li key={s.number}>
            <Part id={`step-${s.number}`} thinking={s.thinking} label={`Step ${s.number}, ${s.name}, done by ${doerNames[s.kind]}`} className={`step-chip step-chip--${s.kind}`}>
              <span className="num">{s.number}</span> {s.name}
            </Part>
          </li>
        ))}
      </ol>
      <ul className="sonar__legend" aria-label="Who does each step">
        {(["code", "rules", "model", "agent"] as const).map((k) => (
          <li key={k}>
            <span className={`legend-swatch step-chip--${k}`} aria-hidden="true" /> {doerNames[k]}
          </li>
        ))}
      </ul>
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
