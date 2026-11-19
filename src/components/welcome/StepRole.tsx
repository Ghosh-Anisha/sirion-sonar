import { people } from "../../data/people";
import { roles } from "../../data/sources";
import { useOnboarding } from "../../state/OnboardingContext";
import { useViewer } from "../../state/ViewerContext";
import { Avatar } from "../layout/Avatar";
import "./Welcome.css";

/** Step 2: pick a role. It sets who the rest of the demo is viewed as. */
export function StepRole() {
  const { state, dispatch } = useOnboarding();
  const { setViewerId } = useViewer();

  return (
    <div className="stack">
      <fieldset className="choices">
        <legend className="visually-hidden">Your role</legend>
        {roles.map((role) => {
          const person = people.find((p) => p.id === role.personId)!;
          return (
            <label key={role.id} className={`choice${state.role === role.id ? " choice--on" : ""}`}>
              <input
                type="radio"
                name="role"
                value={role.id}
                checked={state.role === role.id}
                onChange={() => {
                  dispatch({ type: "role", role: role.id });
                  setViewerId(person.id);
                }}
              />
              <Avatar person={person} size={36} />
              <span className="choice__body">
                <span className="choice__title">
                  {role.title} <span className={`role-tag role-tag--${person.role}`}>{person.name}</span>
                </span>
                <span className="choice__line">
                  {role.line}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>
      <p className="muted">This sets who you are for the rest of the demo. You can switch at any time from View as in the demo bar at the bottom.</p>
    </div>
  );
}
