import { useEffect, useRef, type ReactNode } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { people } from "../data/people";
import { IT_ADMIN_ID, roles } from "../data/sources";
import { allConnected, type Onboarding } from "../logic/onboarding";
import type { ThinkingKey } from "../data/thinking";
import { ThinkingBadge } from "../components/thinking/ThinkingBadge";
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
import { useOnboarding } from "../state/OnboardingContext";
import { useViewer } from "../state/ViewerContext";
import { useSkipToDemo } from "../components/welcome/useSkipToDemo";
import { WizardProgress } from "../components/welcome/WizardProgress";
import "../components/welcome/Welcome.css";

interface Step {
  note: ThinkingKey;
  title: string;
  heading: string;
  body: ReactNode;
  /** Why Next is not available yet, or null when it is. */
  blocker: (s: Onboarding) => string | null;
  next?: string;
}

const STEPS: Step[] = [
  { note: "welcome.welcome", title: "Welcome", heading: "Sonar keeps watch over your supplier contracts", body: <StepWelcome />, blocker: () => null, next: "Get started" },
  { note: "welcome.role", title: "Who you are", heading: "Who are you in this demo?", body: <StepRole />, blocker: (s) => (s.role ? null : "Pick a role to go on.") },
  {
    note: "welcome.sources",
    title: "Connect your sources",
    heading: "Connect your sources",
    body: <StepSources />,
    blocker: (s) => (allConnected(s) ? null : "Connect all three sources to go on."),
  },
  {
    note: "welcome.approval",
    title: "IT approval",
    heading: "Get IT to approve the access",
    body: <StepApproval />,
    blocker: (s) => (s.approval.status === "approved" ? null : "The access needs the IT admin's approval first."),
  },
  { note: "welcome.start", title: "Choose where to start", heading: "Choose where to start", body: <StepStart />, blocker: (s) => (s.start ? null : "Pick where to start.") },
  {
    note: "welcome.first-read",
    title: "First read",
    heading: "The first read",
    body: <StepFirstRead />,
    blocker: (s) => (s.firstReadDone ? null : s.start === "pilot" && !s.readAll && s.readStage >= 8 ? "Widen to every supplier to see the full result." : "Run the first read to go on."),
  },
  { note: "welcome.found", title: "What we found", heading: "What we found", body: <StepFound />, blocker: () => null, next: "Assign owners" },
  { note: "welcome.owners", title: "Assign owners and confirm", heading: "Assign owners and confirm the riskiest dates", body: <StepOwners />, blocker: () => null, next: "Go to Needs you" },
];

const TITLES = STEPS.map((s) => s.title);
const admin = people.find((p) => p.id === IT_ADMIN_ID)!;

/** The onboarding wizard. Its state is kept in local storage, so a refresh lands back on the same step. */
export function Welcome() {
  const { state, dispatch } = useOnboarding();
  const { viewer, setViewerId } = useViewer();
  const navigate = useNavigate();
  const owners = useOwnerChoices();
  const [params, setParams] = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const step = STEPS[state.step];
  const blocker = step.blocker(state);
  const last = state.step === STEPS.length - 1;
  const rolePerson = roles.find((r) => r.id === state.role)?.personId;

  // A link such as /welcome?step=4 opens that step, then the address goes back to plain /welcome.
  const askedStep = Number(params.get("step"));
  useEffect(() => {
    if (!askedStep) return;
    dispatch({ type: "go", step: askedStep - 1 });
    setParams({}, { replace: true });
  }, [askedStep, dispatch, setParams]);

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

  const skip = useSkipToDemo();

  // Onboarding starts at sign-in. Coming back here before that sends the viewer there first.
  if (!state.signedIn) return <Navigate to="/login" replace />;

  return (
    <div className="wizard stack">
      <div className="wizard__top">
        <WizardProgress step={state.step} titles={TITLES} />
        <div className="row wizard__links">
          <Link to="/home" onClick={skip} data-tour="wizard-skip">
            Skip to demo
          </Link>
        </div>
      </div>

      <section className="wizard__step card" aria-labelledby="wizard-heading">
        <div className="wizard__heading-row">
          <h1 id="wizard-heading" ref={headingRef} tabIndex={-1} className="wizard__heading">
            {step.heading}
          </h1>
          <ThinkingBadge at={step.note} />
        </div>
        {step.body}
      </section>

      <footer className="wizard__nav">
        <Button onClick={() => go(state.step - 1)} disabled={state.step === 0}>
          Back
        </Button>
        <div className="wizard__next">
          {blocker && <p className="muted">{blocker}</p>}
          <Button variant="primary" onClick={next} disabled={blocker !== null} data-nudge="wizard-next">
            {step.next ?? "Next"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
