import { useViewer } from "../../state/ViewerContext";

/** Who the demo is being viewed as, the way a signed-in product shows its user. Change it from View as in the demo bar. */
export function ViewerChip() {
  const { viewer } = useViewer();
  const initials = viewer.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <span className="viewer-chip">
      <span className="viewer-chip__avatar" aria-hidden="true">
        {initials}
      </span>
      <span className="viewer-chip__text">
        <span className="viewer-chip__name">{viewer.name}</span>
        <span className="viewer-chip__title">{viewer.title}</span>
      </span>
    </span>
  );
}
