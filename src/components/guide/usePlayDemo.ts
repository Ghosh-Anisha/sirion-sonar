import { useGuide } from "../../state/GuideContext";
import { useOnboarding } from "../../state/OnboardingContext";
import { resetDemo } from "../../state/resetDemo";
import { useJourney } from "../../state/useJourney";

/** Set before a reload that should start the demo from a clean slate. Session only, so Reset demo does not clear it. */
export const DEMO_FLAG = "sirion-sonar-demo-start";

/** Starts the clickable demo from a clean slate. If anything has been done already, it resets first and starts after the reload. */
export function usePlayDemo(): () => void {
  const { setDemo } = useGuide();
  const { state } = useOnboarding();
  const { count } = useJourney();
  return () => {
    const start = () => setDemo({ index: 0 });
    if (count === 0 && state.log.length === 0 && !state.signedIn) return start();
    try {
      window.sessionStorage.setItem(DEMO_FLAG, "1");
    } catch {
      return start();
    }
    resetDemo();
  };
}
