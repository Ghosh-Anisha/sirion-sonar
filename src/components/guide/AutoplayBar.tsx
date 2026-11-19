import { beats } from "../../data/autoplay";
import { moments } from "../../data/journey";
import { useGuide } from "../../state/GuideContext";
import { Button } from "../ui/Button";
import "./Guide.css";

/** The caption for the beat on screen, and the controls to pause, step or take over. */
export function AutoplayBar() {
  const { autoplay, setAutoplay } = useGuide();
  if (!autoplay) return null;
  const { index, playing } = autoplay;
  const beat = beats[index];
  const moment = moments.find((m) => m.id === beat.moment);
  const last = index === beats.length - 1;
  const go = (to: number, replay = false) => setAutoplay({ index: to, playing, replay });

  return (
    <section className="autoplay" aria-labelledby="autoplay-caption">
      <div className="autoplay__progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / beats.length) * 100}%` }} />
      </div>
      <div className="autoplay__body">
        <div className="autoplay__text">
          <p className="label">
            {moment ? moment.name : "Sirion Sonar"}, <span className="num">{index + 1}</span> of <span className="num">{beats.length}</span>
          </p>
          <p key={index} id="autoplay-caption" className="autoplay__caption" aria-live="polite">
            {beat.caption}
          </p>
        </div>
        <div className="row autoplay__controls">
          <Button onClick={() => go(index - 1, true)} disabled={index === 0}>
            Back
          </Button>
          {!last && (
            <Button variant="primary" onClick={() => setAutoplay({ index, playing: !playing, replay: false })}>
              {playing ? "Pause" : "Play"}
            </Button>
          )}
          {!last && <Button onClick={() => go(index + 1)}>Next</Button>}
          <Button variant="quiet" onClick={() => setAutoplay(null)}>
            {last ? "Close" : "Take over"}
          </Button>
        </div>
      </div>
    </section>
  );
}
