import { people } from "../../data/people";
import { IT_ADMIN_ID, roles } from "../../data/sources";
import { accessRequest, requestEntry } from "../../logic/accessText";
import { formatDate } from "../../logic/format";
import { needsApproval } from "../../logic/onboarding";
import { useActor } from "../../state/useActor";
import { useOnboarding } from "../../state/OnboardingContext";
import { useViewer } from "../../state/ViewerContext";
import { Button } from "../ui/Button";
import { AccessReview } from "./AccessReview";
import { AccessConflict } from "./AccessConflict";
import "./Welcome.css";

const admin = people.find((p) => p.id === IT_ADMIN_ID)!;

/** Step 4: the company access goes to the IT admin, who approves it as asked or narrows it to a pilot. */
export function StepApproval() {
  const { state, dispatch } = useOnboarding();
  const { viewer, setViewerId } = useViewer();
  const actor = useActor();
  const role = roles.find((r) => r.id === state.role) ?? roles[0];
  const requester = people.find((p) => p.id === role.personId)!;
  const asAdmin = viewer.id === admin.id;
  const { approval } = state;
  const request = accessRequest(state, { name: requester.name, title: role.title }, { name: admin.name, title: admin.title });

  if (!needsApproval(state)) {
    return (
      <div className="stack">
        <AccessConflict />
        <p>You are the IT admin, so you approve the access yourself. You can take it as set up, or limit it to a pilot.</p>
        <AccessReview request={request.slice(4, -1)} />
      </div>
    );
  }

  return (
    <div className="stack">
      <AccessConflict />
      {approval.status === "none" ? (
        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <p>
            Your Allow covers your own sign-in. Read access across the company needs {admin.name}, the IT admin, to approve
            it. This is the request Sonar sends:
          </p>
          <RequestText lines={request} />
          <div>
            <Button variant="primary" onClick={() => dispatch({ type: "request", entry: requestEntry({ name: admin.name, title: admin.title }, actor) })}>
              Send the request to {admin.name}
            </Button>
          </div>
        </div>
      ) : (
        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <p className="request-sent" role="status">
            {approval.status === "requested"
              ? `Request sent to ${admin.name} on ${formatDate(approval.on)}. Waiting for an answer.`
              : `${approval.by} approved it on ${formatDate(approval.on)}${approval.scope === "pilot" ? ", for a pilot on the top suppliers by spend" : ", as asked"}.`}
          </p>
          <RequestText lines={request} />
          {asAdmin ? (
            <>
              <AccessReview request={request.slice(4, -1)} />
              <div>
                <Button onClick={() => setViewerId(requester.id)}>Switch back to {requester.name}</Button>
              </div>
            </>
          ) : (
            approval.status === "requested" && (
              <div className="stack" style={{ gap: "var(--space-2)" }}>
                <p className="muted">In a real company this waits for IT. In the demo you can play the IT admin.</p>
                <div>
                  <Button variant="primary" onClick={() => setViewerId(admin.id)}>
                    Switch to the IT admin view
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function RequestText({ lines }: { lines: string[] }) {
  return (
    <div className="request-text" aria-label="The request text">
      {lines.map((line, i) => (
        <p key={i} className={i < 3 ? "request-text__meta" : undefined}>
          {line}
        </p>
      ))}
    </div>
  );
}
