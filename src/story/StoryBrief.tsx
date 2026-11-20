import { brief } from "../data/story";
import { BRIEF_PDF } from "./briefFile";
import { SectionHead } from "./SectionHead";
import "./StoryBrief.css";

/** The case assignment as a case file: three numbers, the ask, and what keeps going wrong as sticky notes. */
export function StoryBrief() {
  return (
    <section id="brief" className="story-section" aria-labelledby="brief-title">
      <SectionHead id="brief-title" kicker={brief.kicker} headline={brief.headline} />
      <div className="case-file" data-tour="story-brief">
        <span className="case-file__tab">{brief.tab}</span>
        <span className="case-file__stamp" aria-hidden="true">
          {brief.stamp}
        </span>

        <ul className="case-file__stats">
          {brief.stats.map((s) => (
            <li key={s.label}>
              <span className="case-file__number num">{s.number}</span>
              <span>{s.label}</span>
              {s.tags && (
                <span className="case-file__tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="case-file__ask">
          <h3 className="label">{brief.askTitle}</h3>
          <p>{brief.ask}</p>
        </div>

        <div>
          <h3 className="label">{brief.notesTitle}</h3>
          <ul className="case-file__notes">
            {brief.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>

        <p className="case-file__source">
          {brief.sourceLine}{" "}
          <a href={brief.source.href} target="_blank" rel="noreferrer">
            {brief.source.label}
          </a>
          {brief.sourceTail}
          {BRIEF_PDF && (
            <>
              {" "}
              <a href={BRIEF_PDF} target="_blank" rel="noreferrer">
                {brief.original}
              </a>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
