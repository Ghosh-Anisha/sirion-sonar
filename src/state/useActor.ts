import { useClock } from "./ClockContext";
import { useOnboarding } from "./OnboardingContext";
import { useViewer } from "./ViewerContext";

/** Who is doing something right now, for an access log entry: today, the viewer's name, and the log's length. */
export function useActor() {
  const { today } = useClock();
  const { viewer } = useViewer();
  const { state } = useOnboarding();
  return { on: today, by: viewer.name, seq: state.log.length };
}
