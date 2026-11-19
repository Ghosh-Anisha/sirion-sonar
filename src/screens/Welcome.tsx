import { useEffect, useRef, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { people } from "../data/people";
import { IT_ADMIN_ID, roles } from "../data/sources";
import { allConnected, type Onboarding } from "../logic/onboarding";
import { skipEvent } from "../logic/skip";
import { Button } from "../components/ui/Button";
import { StepApproval } from "../components/welcome/StepApproval";
import { StepFirstRead } from "../components/welcome/StepFirstRead";
import { StepFound } from "../components/welcome/StepFound";
import { StepOwners } from "../components/welcome/StepOwners";
import { StepRole } from "../components/welcome/StepRole";
import { StepSources } from "../components/welcome/StepSources";
import { StepStart } from "../components/welcome/StepStart";
import { StepWelcome } from "../components/welcome/StepWelcome";
import { useOwnerChoices } from "../components/welcome/OwnerTable";
import { firstReadPlan } from "../state/firstReadPlan";
import { useActor } from "../state/useActor";
import { useOnboarding } from "../state/OnboardingContext";
import { useViewer } from "../state/ViewerContext";
import { WizardProgress } from "../components/welcome/WizardProgress";
import "../components/welcome/Welcome.css";

interface Step {
  title: string;
  heading: string;
  body: ReactNode;
  /** Why Next is not available yet, or null when it is. */
  blocker: (s: Onboarding) => string | null;
  next?: string;
}

const STEPS: Step[] = [
  { title: "Welcome", heading: "Sonar keeps watch over your supplier contracts", body: <StepWelcome />, blocker: () => null, next: "Get started" },
  { title: "Who you are", heading: "Who are you in this demo?", body: <StepRole />, blocker: (s) => (s.role ? null : "Pick a role to go on.") },
  {
    title: "Connect your sources",
    heading: "Connect your sources",
    body: <StepSources />,
    blocker: (s) => (allConnected(s) ? null : "Connect all three sources to go on."),
  },
  {
    title: "IT approval",
    heading: "Get IT to approve the access",
    body: <StepApproval />,
    blocker: (s) => (s.approval.status === "approved" ? null : "The access needs the IT admin's approval first."),
  },
  { title: "Choose where to start", heading: "Choose where to start", body: <StepStart />, blocker: (s) => (s.start ? null : "Pick where to start.") },
  {
    title: "First read",
    heading: "The first read",
    body: <StepFirstRead />,
    blocker: (s) => (s.firstReadDone ? null : s.start === "pilot" && !s.readAll && s.readStage >= 8 ? "Widen to every supplier to see the full result." : "Run the first read to go on."),
  },
  { title: "What we found", heading: "What we found", body: <StepFound />, blocker: () => null, next: "Assign owners" },
  { title: "Assign owners and confirm", heading: "Assign owners and confirm the riskiest dates", body: <StepOwners />, blocker: () => null, next: "Go to Needs you" },
];

const TITLES = STEPS.map((s) => s.title);
const admin = people.find((p) => p.id === IT_ADMIN_ID)!;

/** The onboarding wizard. Its state is kept in local storage, so a refresh lands back on the same step. */
export function Welcome() {
  const { state, dispatch, resetDemo } = useOnboarding();
  const { viewer, setViewerId } = useViewer();
  const actor = useActor();
  const navigate = useNavigate();
  const owners = useOwnerChoices();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const step = STEPS[state.step];
  const blocker = step.blocker(state);
  const last = state.step === STEPS.length - 1;
  const rolePerson = roles.find((r) => r.id === state.role)?.personId;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [state.step]);

  const go = (to: number) => {
    // Leaving the approval step as the IT admin hands the demo back to the role that was picked.
    if (viewer.id === admin.id && rolePerson && rolePerson !== admin.id) setViewerId(rolePerson);
    dispatch({ type: "go", step: to });
  };

  const next = () => {
    if (!last) return go(state.step + 1);
    dispatch({ type: "owners", owners });
    navigate("/home");
  };

  const skip = () => {
    dispatch(skipEvent(state, firstReadPlan, actor, admin.name));
    if (viewer.id === admin.id && rolePerson && rolePerson !== admin.id) setViewerId(rolePerson);
  };

  return (
    <div className="wizard stack">
      <div className="wizard__top">
        <WizardProgress step={state.step} titles={TITLES} />
        <div className="row wizard__links">
          <Link to="/home" onClick={skip}>
            Skip to demo
          </Link>
          <Button variant="quiet" onClick={resetDemo}>
            Start over
          </Button>
        </div>
      </div>

      <section className="wizard__step card" aria-labelledby="wizard-heading">
        <h1 id="wizard-heading" ref={headingRef} tabIndex={-1} className="wizard__heading">
          {step.heading}
        </h1>
        {step.body}
      </section>

      <footer className="wizard__nav">
        <Button onClick={() => go(state.step - 1)} disabled={state.step === 0}>
          Back
        </Button>
        <div className="wizard__next">
          {blocker && <p className="muted">{blocker}</p>}
          <Button variant="primary" onClick={next} disabled={blocker !== null}>
            {step.next ?? "Next"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
