import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { beats, type Act } from "../../data/autoplay";
import { useClock } from "../../state/ClockContext";
import { useGuide } from "../../state/GuideContext";
import { useViewer } from "../../state/ViewerContext";

/** Set before a reload that should start the story from a clean demo. Session only, so Reset demo does not clear it. */
export const AUTOPLAY_FLAG = "sirion-sonar-autoplay-start";
const FIND_WITHIN_MS = 2500;

const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

function showing(el: Element): el is HTMLElement {
  return el instanceof HTMLElement && el.getClientRects().length > 0 && !(el as HTMLButtonElement).disabled;
}

/** Waits for the first showing element that matches, as screens render after a route change. */
async function waitFor(match: () => HTMLElement | undefined, cancelled: () => boolean): Promise<HTMLElement | undefined> {
  const until = Date.now() + FIND_WITHIN_MS;
  while (Date.now() < until && !cancelled()) {
    const el = match();
    if (el) return el;
    await sleep(100);
  }
  return undefined;
}

const bySelector = (selector: string) => () => Array.from(document.querySelectorAll(selector)).find(showing);
const byText = (text: string) => () =>
  Array.from(document.querySelectorAll("main button, main a")).find((el): el is HTMLElement => showing(el) && el.textContent?.trim() === text);

/** Plays the autoplay story: for each beat it sets the scene, presses what a person would press, holds, then moves on. */
export function Director() {
  const { autoplay, setAutoplay } = useGuide();
  const navigate = useNavigate();
  const { setToday } = useClock();
  const { setViewerId } = useViewer();
  const index = autoplay?.index ?? null;
  const playing = autoplay?.playing ?? false;
  const replay = autoplay?.replay ?? false;

  // Start from a clean demo when the story was asked for before a reset.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(AUTOPLAY_FLAG)) {
        window.sessionStorage.removeItem(AUTOPLAY_FLAG);
        setAutoplay({ index: 0, playing: true, replay: false });
      }
    } catch {
      // Session storage can be blocked. The story then waits for Play.
    }
  }, [setAutoplay]);

  useEffect(() => {
    if (index === null) return;
    let cancelled = false;
    const isCancelled = () => cancelled;
    const beat = beats[index];

    const run = async (act: Act) => {
      if ("go" in act) navigate(act.go);
      else if ("clock" in act) setToday(act.clock);
      else if ("viewer" in act) setViewerId(act.viewer);
      else if ("wait" in act) await sleep(replay ? 0 : act.wait);
      else if (!replay) {
        const el = await waitFor("click" in act ? bySelector(act.click) : byText(act.press), isCancelled);
        if (el && !cancelled) el.click();
        await sleep(300);
      }
    };

    (async () => {
      for (const act of beat.acts) {
        if (cancelled) return;
        await run(act);
      }
      if (beat.focus) {
        const el = await waitFor(bySelector(beat.focus), isCancelled);
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    })();
    return () => {
      cancelled = true;
    };
    // The scene is set once per beat, so playing or pausing does not run it again.
  }, [index, replay]);

  useEffect(() => {
    if (index === null || !playing) return;
    const beat = beats[index];
    if (index === beats.length - 1) {
      setAutoplay({ index, playing: false, replay: false });
      return;
    }
    const wait = beat.acts.reduce((ms, a) => ms + ("wait" in a ? a.wait : 0), 0) + beat.hold;
    const timer = window.setTimeout(() => setAutoplay({ index: index + 1, playing: true, replay: false }), wait);
    return () => window.clearTimeout(timer);
  }, [index, playing, setAutoplay]);

  return null;
}
