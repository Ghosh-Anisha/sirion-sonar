import { releaseScores } from "../../data/architecture";
import "./Sections.css";

/**
 * Sample eval scores for three releases, as small grouped bars per eval on a 0 to 100 scale.
 * One hue from light to dark, because releases are in order. Illustrative, not measured.
 */
export function ReleaseChart() {
  const { releases, rows } = releaseScores;
  return (
    <figure className="rchart" data-tour="solution-release-chart" aria-labelledby="rchart-title">
      <figcaption id="rchart-title" className="rchart__title">
        Sample scores across three releases <span className="rchart__tag">Illustrative</span>
      </figcaption>
      <ul className="rchart__legend" aria-label="Releases">
        {releases.map((r, i) => (
          <li key={r}>
            <span className={`rchart__swatch rchart__swatch--${i}`} aria-hidden="true" /> {r}
          </li>
        ))}
      </ul>
      <ul className="rchart__rows">
        {rows.map((row) => (
          <li key={row.name} className="rchart__row">
            <span className="rchart__name">{row.name}</span>
            <span className="rchart__bars">
              {row.scores.map((score, i) => (
                <span key={releases[i]} className="rchart__track" tabIndex={0} aria-label={`${row.name}, ${releases[i]}: ${score} out of 100`}>
                  <span className={`rchart__bar rchart__swatch--${i}`} style={{ width: `${score}%` }} />
                  <span className="rchart__tip" role="tooltip">
                    {releases[i]}: {score}
                  </span>
                  {i === row.scores.length - 1 && <span className="rchart__value num">{score}</span>}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <details className="rchart__table">
        <summary>Show the numbers as a table</summary>
        <div className="table-wrap">
          <table className="table">
            <caption className="visually-hidden">Sample scores across three releases, illustrative</caption>
            <thead>
              <tr>
                <th scope="col">Eval</th>
                {releases.map((r) => (
                  <th key={r} scope="col" className="table__num">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  {row.scores.map((s, i) => (
                    <td key={i} className="table__num">
                      {s}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
