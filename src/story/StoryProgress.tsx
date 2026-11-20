import { useEffect, useRef, useState } from "react";
import { storyChapters } from "../data/story";
import { scrollToSection } from "./scrollToSection";
import "./Story.css";

/** A section counts as the one being read once its top passes this share of the window height. */
const READING_LINE = 0.35;

/** A sticky bar that fills as the story is read, with a link to each section and the current one marked. */
export function StoryProgress() {
  const [share, setShare] = useState(0);
  const [current, setCurrent] = useState<string | null>(null);
  const row = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShare(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      const passed = storyChapters.filter((c) => (document.getElementById(c.id)?.getBoundingClientRect().top ?? Infinity) <= window.innerHeight * READING_LINE);
      setCurrent(passed.length > 0 ? passed[passed.length - 1].id : null);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  // At phone width the row scrolls sideways, so keep the current section's link in view.
  useEffect(() => {
    const list = row.current;
    const link = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !link) return;
    if (link.offsetLeft < list.scrollLeft || link.offsetLeft + link.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollLeft = link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2;
    }
  }, [current]);
  return (
    <div className="story-progress">
      <div
        className="story-progress__bar"
        role="progressbar"
        aria-label="How far through the story"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(share * 100)}
      >
        <span style={{ transform: `scaleX(${share})` }} />
      </div>
      <nav aria-label="Story sections">
        <ol className="story-progress__chapters" ref={row}>
          {storyChapters.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="story-progress__chapter"
                aria-current={current === c.id ? "true" : undefined}
                onClick={() => scrollToSection(c.id)}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
