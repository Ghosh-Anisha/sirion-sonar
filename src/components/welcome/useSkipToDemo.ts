import { people } from "../../data/people";
import { IT_ADMIN_ID, roles } from "../../data/sources";
import { skipEvent } from "../../logic/skip";
import { firstReadPlan } from "../../state/firstReadPlan";
import { useActor } from "../../state/useActor";
import { useOnboarding } from "../../state/OnboardingContext";
import { PROCUREMENT_LEAD, useViewer } from "../../state/ViewerContext";

const admin = people.find((p) => p.id === IT_ADMIN_ID)!;

/** Skip to demo: signs in, connects and reads with the defaults, and hands the view back to the role picked. */
export function useSkipToDemo(): () => void {
  const { state, dispatch } = useOnboarding();
  const { viewer, setViewerId } = useViewer();
  const actor = useActor();
  const rolePerson = roles.find((r) => r.id === state.role)?.personId;
  return () => {
    dispatch(skipEvent(state, firstReadPlan, actor, admin.name, PROCUREMENT_LEAD.email));
    if (viewer.id === admin.id && rolePerson && rolePerson !== admin.id) setViewerId(rolePerson);
  };
}
