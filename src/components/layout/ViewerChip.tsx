import { ROLE_NAME } from "../../logic/roles";
import { useViewer } from "../../state/ViewerContext";
import { Avatar } from "./Avatar";

/** Who the demo is being viewed as, the way a signed-in product shows its user, with their role as a colored tag. */
export function ViewerChip() {
  const { viewer } = useViewer();
  return (
    <span className="viewer-chip">
      <Avatar person={viewer} />
      <span className="viewer-chip__text">
        <span className="viewer-chip__name">{viewer.name}</span>
        <span className={`role-tag role-tag--${viewer.role}`}>{ROLE_NAME[viewer.role]}</span>
      </span>
    </span>
  );
}
