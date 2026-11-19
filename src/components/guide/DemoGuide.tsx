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

/** The nine moments as a strip above the demo controls: where you are, one Do this next, and the steps ticked so far. */
export function DemoGuide() {
  const { setOpen } = useGuide();
  const { current, done, count } = useJourney();
  const goNext = useDoNext();
  const person = current ? people.find((p) => p.id === current.personId) : null;

  return (
    <section id="demo-guide" className="demo-guide" aria-labelledby="demo-guide-title">
      <div className="demo-guide__now" role="status">
        <div className="demo-guide__text">
          <p className="label">
            {current ? (
              <>
                Demo guide, moment <span className="num">{moments.indexOf(current) + 1}</span> of <span className="num">{moments.length}</span>
              </>
            ) : (
              "Demo guide, all nine moments done"
            )}
          </p>
          <h2 id="demo-guide-title" className="demo-guide__name">
            {current ? current.name : "That is the whole story"}
          </h2>
          {current && (
            <p>
              {current.todo}
              <span className="muted">
                {" "}
                Do this next takes you there{person ? ` as ${person.name}` : ""}, and the thing to press glows.
              </span>
            </p>
          )}
        </div>
        <div className="row demo-guide__actions">
          <Button variant="primary" onClick={goNext}>
            {current ? "Do this next" : "See the summary"}
          </Button>
          <Button variant="quiet" onClick={() => setOpen(false)} aria-label="Hide the demo guide">
            Hide
          </Button>
        </div>
      </div>

      <ol className="demo-guide__list" aria-label={`${count} of ${moments.length} moments done`}>
        {moments.map((m, i) => {
          const state = done[m.id] ? "done" : m.id === current?.id ? "now" : "todo";
          return (
            <li key={m.id} className={`demo-guide__moment demo-guide__moment--${state}`} aria-current={state === "now" ? "step" : undefined}>
              <span className="demo-guide__tick" aria-hidden="true">
                {state === "done" ? <Icon name="confirmed" size={12} /> : <span className="num">{i + 1}</span>}
              </span>
              <span>{m.name}</span>
              <span className="visually-hidden">{state === "done" ? ", done" : state === "now" ? ", next" : ""}</span>
            </li>
          );
        })}
      </ol>
    </section>
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
