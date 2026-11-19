import { useGuide } from "../../state/GuideContext";
import { useOnboarding } from "../../state/OnboardingContext";
import { resetDemo } from "../../state/resetDemo";
import { useJourney } from "../../state/useJourney";
import { AUTOPLAY_FLAG } from "./Director";

/** Starts the autoplay story from a clean demo. If anything has been done already, it resets first and starts after the reload. */
export function usePlayDemo(): () => void {
  const { setAutoplay } = useGuide();
  const { state } = useOnboarding();
  const { count } = useJourney();
  return () => {
    const start = () => setAutoplay({ index: 0, playing: true, replay: false });
    if (count === 0 && state.log.length === 0) return start();
    try {
      window.sessionStorage.setItem(AUTOPLAY_FLAG, "1");
    } catch {
      return start();
    }
    resetDemo();
  };
}
