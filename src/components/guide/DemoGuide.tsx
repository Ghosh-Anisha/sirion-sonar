import { useNavigate } from "react-router-dom";
import { moments } from "../../data/journey";
import { people } from "../../data/people";
import { useClock } from "../../state/ClockContext";
import { useGuide } from "../../state/GuideContext";
import { useJourney } from "../../state/useJourney";
import { useViewer } from "../../state/ViewerContext";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import "./Guide.css";

/** The nine moments of the story as a checklist, with the current one and a single Do this next. */
export function DemoGuide() {
  const { open, setOpen } = useGuide();
  const journey = useJourney();
  const goNext = useDoNext();
  if (!open) return null;
  const { current, done, count } = journey;
  const person = current ? people.find((p) => p.id === current.personId) : null;

  return (
    <aside id="demo-guide" className="demo-guide" aria-labelledby="demo-guide-title">
      <header className="demo-guide__head">
        <h2 id="demo-guide-title">Demo guide</h2>
        <Button variant="quiet" onClick={() => setOpen(false)} aria-label="Collapse the demo guide">
          Hide
        </Button>
      </header>

      <div className="demo-guide__now" role="status">
        {current ? (
          <>
            <p className="label">
              Moment <span className="num">{moments.indexOf(current) + 1}</span> of <span className="num">{moments.length}</span>
            </p>
            <h3>{current.name}</h3>
            <p>{current.todo}</p>
            {person && <p className="muted">You will be viewing as {person.name}, {person.title}.</p>}
          </>
        ) : (
          <>
            <p className="label">All nine moments done</p>
            <h3>That is the whole story</h3>
          </>
        )}
        <Button variant="primary" onClick={goNext}>
          {current ? "Do this next" : "See the summary"}
        </Button>
      </div>

      <ol className="demo-guide__list" aria-label={`${count} of ${moments.length} moments done`}>
        {moments.map((m, i) => (
          <li key={m.id} className={`demo-guide__moment${done[m.id] ? " demo-guide__moment--done" : ""}${m.id === current?.id ? " demo-guide__moment--now" : ""}`}>
            <span className="demo-guide__tick" aria-hidden="true">
              {done[m.id] ? <Icon name="confirmed" size={12} /> : <span className="num">{i + 1}</span>}
            </span>
            <span>{m.name}</span>
            <span className="visually-hidden">{done[m.id] ? ", done" : m.id === current?.id ? ", next" : ""}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/** Takes the viewer to the next moment: the right person, the right day on the clock, the right screen. */
export function useDoNext(): () => void {
  const navigate = useNavigate();
  const { setToday } = useClock();
  const { setViewerId } = useViewer();
  const { current, next } = useJourney();
  return () => {
    if (!current || !next) return navigate("/summary");
    setViewerId(current.personId);
    if (next.clock) setToday(next.clock);
    navigate(next.to);
  };
}
