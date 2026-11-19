import { useMemo } from "react";
import { contracts } from "../data/contracts";
import { DEMO_START } from "../data/demo";
import { moments, type Moment } from "../data/journey";
import { momentsDone, nextAction, type NextAction } from "../logic/journey";
import { useDemoState } from "./DemoStateContext";
import { useGuide } from "./GuideContext";
import { useLedger } from "./useLedger";
import { useOnboarding } from "./OnboardingContext";
import type { MomentId } from "../data/journey";

export interface Journey {
  done: Record<MomentId, boolean>;
  /** The first moment not done yet, or null when all nine are. */
  current: Moment | null;
  next: NextAction | null;
  count: number;
}

/** Where the viewer is in the nine moments, from app state. */
export function useJourney(): Journey {
  const { state: onboarding } = useOnboarding();
  const { state } = useDemoState();
  const { items, today } = useLedger();
  const { visited } = useGuide();

  return useMemo(() => {
    const done = momentsDone({
      onboarding,
      factEdits: state.factEdits,
      actions: state.actions,
      opened: state.opened,
      items,
      contracts,
      visited,
      today,
      demoStart: DEMO_START,
    });
    const current = moments.find((m) => !done[m.id]) ?? null;
    return {
      done,
      current,
      next: current ? nextAction(current.id, { onboarding, contracts, today, demoStart: DEMO_START }) : null,
      count: moments.filter((m) => done[m.id]).length,
    };
  }, [onboarding, state, items, today, visited]);
}
