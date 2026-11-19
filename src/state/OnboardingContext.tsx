import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { INITIAL_ONBOARDING, parseOnboarding, reduceOnboarding, type Onboarding, type OnboardingEvent } from "../logic/onboarding";

const STORAGE_KEY = "sirion-sonar.onboarding.v2";

function load(): Onboarding {
  try {
    return parseOnboarding(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return INITIAL_ONBOARDING;
  }
}

function save(state: Onboarding) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be blocked. The wizard still works, it just starts over on reload.
  }
}

interface OnboardingValue {
  state: Onboarding;
  dispatch: (event: OnboardingEvent) => void;
}

const OnboardingContext = createContext<OnboardingValue | null>(null);

/** The onboarding wizard and the access log. Kept in local storage, so a refresh does not lose them. */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceOnboarding, undefined, load);
  useEffect(() => save(state), [state]);
  const value = useMemo<OnboardingValue>(() => ({ state, dispatch }), [state]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingValue {
  const value = useContext(OnboardingContext);
  if (!value) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return value;
}
