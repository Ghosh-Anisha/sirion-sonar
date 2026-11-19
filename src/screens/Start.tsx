import { Navigate } from "react-router-dom";
import { useOnboarding } from "../state/OnboardingContext";

/** The front door: sign-in first, then onboarding. */
export function Start() {
  const { signedIn } = useOnboarding().state;
  return <Navigate to={signedIn ? "/welcome" : "/login"} replace />;
}
