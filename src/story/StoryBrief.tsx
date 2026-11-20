import { Link } from "react-router-dom";
import { brief } from "../data/story";
import { Icon } from "../components/ui/Icon";
import { useVisits } from "../state/useVisits";
import { BRIEF_PDF } from "./briefFile";
import "./StoryBrief.css";

/** The case assignment this prototype answers: the company, its symptoms, the task and what has to be in it. */
export function StoryBrief() {
  const visited = useVisits();
  return (
    <section id="brief" className="story-section" aria-labelledby="brief-title">
      <div className="brief" data-tour="story-brief">
        <header>
          <p className="story-kicker">{brief.kicker}</p>
          <h2 id="brief-title" className="story-headline story-headline--section">
            {brief.title}
          </h2>
        </header>

        <div className="brief__grid">
          <div className="brief__block">
            <h3 className="label">{brief.companyTitle}</h3>
            {brief.company.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <h3 className="label">{brief.symptomsTitle}</h3>
            <ul className="brief__chips">
              {brief.symptoms.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h3 className="label">{brief.taskTitle}</h3>
            <p className="brief__task">{brief.task}</p>
          </div>

          <div className="brief__block">
            <h3 className="label" id="brief-checklist">
              {brief.checklistTitle}
            </h3>
            <p className="brief__hint">{brief.checklistHint}</p>
            <ol className="brief__checklist" aria-labelledby="brief-checklist">
              {brief.checklist.map((item) => {
                const done = visited.includes(item.to);
                return (
                  <li key={item.to} className={done ? "brief__check brief__check--done" : "brief__check"}>
                    <span className="brief__tick" aria-hidden="true">
                      {done && <Icon name="confirmed" size={12} />}
                    </span>
                    <Link to={item.to}>{item.label}</Link>
                    <span className="visually-hidden">{done ? brief.visited : brief.notYet}</span>
                  </li>
                );
              })}
            </ol>

            <h3 className="label">{brief.sourceTitle}</h3>
            <p>
              <a href={brief.source.href} target="_blank" rel="noreferrer">
                {brief.source.label}
              </a>
              . {brief.sourceNote}
            </p>
            {BRIEF_PDF && (
              <p>
                <a href={BRIEF_PDF} target="_blank" rel="noreferrer">
                  {brief.original}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
