import { useState } from "react";
import { stagePick } from "../data/story";
import { Icon } from "../components/ui/Icon";
import { FlipCards } from "./FlipCards";
import { SectionHead } from "./SectionHead";
import "./StagePick.css";

/** The three lifecycle stages, then the four tests intake passes. The dimmed stages open to say why not, and never change the pick. */
export function StagePick() {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const { picked, others } = stagePick;
  return (
    <section id="stage" className="story-section" aria-labelledby="stage-title">
      <SectionHead id="stage-title" kicker={stagePick.kicker} headline={stagePick.headline} lead={stagePick.lead} />
      <ul className="stages" data-tour="story-stages">
        <li className="stage stage--picked">
          <span className="stage__badge">
            <Icon name="confirmed" />
            {stagePick.pickedBadge}
          </span>
          <h3 className="stage__name">{picked.name}</h3>
          <p>{picked.means}</p>
        </li>
        {others.map((s) => {
          const on = open.has(s.id);
          return (
            <li key={s.id} className="stage stage--dimmed">
              <button type="button" className="stage__button" aria-expanded={on} aria-controls={`stage-why-${s.id}`} onClick={() => toggle(s.id)}>
                <span className="stage__badge stage__badge--quiet">{stagePick.notPickedBadge}</span>
                <span className="stage__name">{s.name}</span>
                <span>{s.short}</span>
                <span className="stage__more">{on ? stagePick.hideWhy : stagePick.showWhy}</span>
              </button>
              <p id={`stage-why-${s.id}`} className="stage__why" hidden={!on}>
                {s.why}
              </p>
            </li>
          );
        })}
      </ul>
      <FlipCards />
    </section>
  );
}
