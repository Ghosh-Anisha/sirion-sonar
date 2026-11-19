import { useEffect, useRef, useState } from "react";
import { panels } from "../data/story";
import { ButtonLink } from "../components/ui/ButtonLink";
import { Button } from "../components/ui/Button";
import { ComicPanel } from "./ComicPanel";
import "./Story.css";

/**
 * The six panel comic. Panels fade and rise in as they scroll into view (straight in with reduced motion),
 * and pressing one opens it larger with one more line.
 */
export function ComicStrip() {
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<number | null>(null);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return setShown(new Set(panels.map((p) => p.id)));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setShown((s) => new Set(s).add((e.target as HTMLElement).dataset.panel!));
      },
      { threshold: 0.25 },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const current = open !== null ? panels[open] : null;
  return (
    <>
      <ol className="comic" data-tour="story-comic">
        {panels.map((p, i) => (
          <li
            key={p.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-panel={p.id}
            className={`comic__cell${shown.has(p.id) ? " comic__cell--shown" : ""}${p.id === "with-sonar" ? " comic__cell--sonar" : ""}`}
          >
            <button type="button" className="comic__panel" onClick={() => setOpen(i)} aria-label={`Panel ${i + 1}, ${p.when}: ${p.caption} Open it larger.`}>
              <ComicPanel panel={p} number={i + 1} />
            </button>
            {p.id === "with-sonar" && (
              <ButtonLink to="/login" variant="primary" className="comic__try">
                Try it
              </ButtonLink>
            )}
          </li>
        ))}
      </ol>
      <dialog ref={dialog} className="comic__dialog" aria-label={current ? `Panel ${open! + 1}, ${current.when}` : "Panel"} onClose={() => setOpen(null)}>
        {current && (
          <div className="comic__large">
            <ComicPanel panel={current} number={open! + 1} />
            <p className="comic__aside">{current.aside}</p>
            <div className="row">
              <Button onClick={() => setOpen(Math.max(0, open! - 1))} disabled={open === 0}>
                Previous panel
              </Button>
              <Button onClick={() => setOpen(Math.min(panels.length - 1, open! + 1))} disabled={open === panels.length - 1}>
                Next panel
              </Button>
              <Button variant="primary" onClick={() => setOpen(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
