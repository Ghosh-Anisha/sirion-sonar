import { people } from "../../data/people";
import { useViewer } from "../../state/ViewerContext";

/** Lets the demo show the list as each person sees it. */
export function ViewAsSwitcher() {
  const { viewer, setViewerId } = useViewer();
  return (
    <label className="view-as" data-tour="view-as">
      <span className="label">View as</span>
      <select value={viewer.id} onChange={(e) => setViewerId(e.target.value)}>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}, {p.title}
          </option>
        ))}
      </select>
    </label>
  );
}
