import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import type { TourStep } from "../../data/tours";
import { Button } from "../ui/Button";
import "./Guide.css";

const PAD = 8;
const GAP = 12;
const CARD_WIDTH = 320;
const CARD_ROOM = 220;
/** A target taller than this share of the window is lit from its top, so the coach mark still fits beside it. */
const TALL = 0.45;

/** The first element with this data-tour name that is showing. A screen can have one per layout, such as a map and its narrow-screen list. */
function find(target: string): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>(`[data-tour="${target}"]`);
  return Array.from(all).find((el) => el.getClientRects().length > 0) ?? null;
}

function reducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** The bottom of the usable window: above the demo dock, which stays fixed at the bottom. */
function usableBottom(): number {
  const dock = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dock-height")) || 0;
  return window.innerHeight - dock;
}

/** Where the coach mark goes: below the spotlight if there is room, else above, kept clear of the dock. */
function cardPosition(box: Box): { top: number; left: number } {
  const width = Math.min(CARD_WIDTH, window.innerWidth - 32);
  const left = Math.min(Math.max(box.left, 16), window.innerWidth - width - 16);
  const bottom = usableBottom();
  const below = box.top + box.height + PAD + GAP;
  if (bottom - below >= CARD_ROOM) return { top: below, left };
  const above = box.top - PAD - GAP - CARD_ROOM;
  if (above >= 16) return { top: above, left };
  return { top: Math.max(16, bottom - CARD_ROOM - 16), left };
}

interface TourProps {
  steps: TourStep[];
  onClose: () => void;
}

/**
 * A guided tour: the page dims, a spotlight opens around each target, and a coach mark
 * sits beside it. Steps whose target is not on the screen are skipped. Esc closes it.
 */
export function Tour({ steps, onClose }: TourProps) {
  const [shown] = useState(() => steps.filter((s) => find(s.target)));
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<Element | null>(document.activeElement);
  const step = shown[index];

  const measure = useCallback(() => {
    const el = step ? find(step.target) : null;
    if (!el) return setBox(null);
    const r = el.getBoundingClientRect();
    setBox({ top: r.top, left: r.left, width: r.width, height: Math.min(r.height, usableBottom() * TALL) });
  }, [step]);

  useEffect(() => {
    if (shown.length === 0) onClose();
  }, [shown.length, onClose]);

  useLayoutEffect(() => {
    if (!step) return;
    const el = find(step.target);
    if (!el) {
      // The target went away since the tour started, so move past it.
      if (index < shown.length - 1) setIndex(index + 1);
      else onClose();
      return;
    }
    const tall = el.getBoundingClientRect().height > usableBottom() * TALL;
    el.scrollIntoView({ block: tall ? "start" : "center", inline: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
    measure();
    cardRef.current?.focus();
  }, [step, index, shown.length, measure, onClose]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure]);

  useEffect(() => {
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  useEffect(() => {
    const back = returnTo.current;
    return () => {
      if (back instanceof HTMLElement) back.focus();
    };
  }, []);

  if (!step) return null;
  const last = index === shown.length - 1;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    // Keep focus inside the coach mark while the tour is open.
    const focusable = cardRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled)");
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const end = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      end.focus();
    } else if (!e.shiftKey && document.activeElement === end) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="tour" onKeyDown={onKeyDown}>
      <div className="tour__blocker" aria-hidden="true" />
      {box && (
        <div
          className="tour__spot"
          aria-hidden="true"
          style={{ top: box.top - PAD, left: box.left - PAD, width: box.width + PAD * 2, height: box.height + PAD * 2 }}
        />
      )}
      <div
        ref={cardRef}
        className="tour__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-body"
        tabIndex={-1}
        style={box ? cardPosition(box) : { top: 16, left: 16 }}
      >
        <p className="label">
          Step <span className="num">{index + 1}</span> of <span className="num">{shown.length}</span>
        </p>
        <h2 id="tour-title" className="tour__title">
          {step.title}
        </h2>
        <p id="tour-body">{step.body}</p>
        <ol className="tour__dots" aria-hidden="true">
          {shown.map((s, i) => (
            <li key={`${s.target}-${i}`} className={i === index ? "tour__dot tour__dot--on" : "tour__dot"} />
          ))}
        </ol>
        <div className="tour__nav">
          <Button variant="quiet" onClick={onClose}>
            Skip
          </Button>
          <div className="row">
            <Button onClick={() => setIndex(index - 1)} disabled={index === 0}>
              Back
            </Button>
            <Button variant="primary" onClick={() => (last ? onClose() : setIndex(index + 1))}>
              {last ? "Done" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
