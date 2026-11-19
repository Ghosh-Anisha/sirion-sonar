import { useState } from "react";
import { intakeTests } from "../data/caseStudy";
import { whyStart } from "../data/story";
import "./Story.css";

/** The four intake tests as cards. Pressing one turns it over to show the line of evidence. */
export function FlipCards() {
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const toggle = (name: string) =>
    setFlipped((s) => {
      const next = new Set(s);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  return (
    <ul className="flip-cards" data-tour="story-tests">
      {intakeTests.map((t, i) => {
        const on = flipped.has(t.name);
        return (
          <li key={t.name}>
            <button type="button" className={`flip-card${on ? " flip-card--on" : ""}`} aria-pressed={on} onClick={() => toggle(t.name)}>
              <span className="flip-card__inner">
                <span className="flip-card__face flip-card__front" aria-hidden={on}>
                  <span className="flip-card__number num">{i + 1}</span>
                  <span className="flip-card__name">{t.name}</span>
                  <span className="flip-card__hint">Turn for the evidence</span>
                </span>
                <span className="flip-card__face flip-card__back" aria-hidden={!on}>
                  <span className="story-kicker">{t.name}</span>
                  <span>{whyStart.evidence[t.name]}</span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
