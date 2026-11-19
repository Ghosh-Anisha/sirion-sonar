import { useSearchParams } from "react-router-dom";
import { conflicts, groups, type GroupId } from "../data/caseStudy";
import { ConflictTable } from "../components/case/ConflictTable";
import { PlaysOutLink } from "../components/case/PlaysOutLink";
import { StakeholderMap } from "../components/case/StakeholderMap";
import "../components/case/Case.css";

/** The stakeholder map and the conflicts between the groups on it. The choice is kept in the URL, so it can be linked to. */
export function Stakeholders() {
  const [params, setParams] = useSearchParams();
  const conflict = conflicts.find((c) => c.id === params.get("conflict")) ?? null;
  const group = groups.find((g) => g.id === params.get("group")) ?? null;
  const highlighted: GroupId[] = conflict ? conflict.between : [];

  const pickGroup = (id: GroupId) => setParams(group?.id === id ? {} : { group: id }, { replace: true });
  const pickConflict = (id: string) => setParams(conflict?.id === id ? {} : { conflict: id }, { replace: true });

  return (
    <div className="stack case">
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <p className="label">Case</p>
        <h1>Stakeholders</h1>
        <p className="muted">
          Eight groups care how a supplier contract is renewed, paid and reviewed. The procurement and finance leads are where
          most conflicts meet. The contract owner has less power, but is the one who has to act, so the product is built around
          them.
        </p>
      </header>

      <section className="stack" aria-labelledby="map-title">
        <h2 id="map-title">Power and interest</h2>
        <div className="stakeholders">
          <StakeholderMap selected={group?.id ?? null} highlighted={highlighted} onSelect={pickGroup} />
          <div className="stakeholders__side" aria-live="polite" data-tour="stakeholders-side">
            {group ? (
              <div className="case-card">
                <p className="label">What they want</p>
                <h3>{group.name}</h3>
                <p>{group.wants}</p>
                <PlaysOutLink to={group.playsOut} />
              </div>
            ) : conflict ? (
              <div className="case-card">
                <p className="label">Conflict shown on the map</p>
                <h3>{conflict.title}</h3>
                <p>{conflict.betweenText}</p>
              </div>
            ) : (
              <p className="muted">Pick a group on the map to see what it wants, or a conflict below to see who it is between.</p>
            )}
          </div>
        </div>
        <p className="case-source">Placements are read from the text of the spec, where the map itself is a picture.</p>
      </section>

      <section className="stack" aria-labelledby="conflicts-title">
        <h2 id="conflicts-title">Where they conflict</h2>
        <ConflictTable selected={conflict?.id ?? null} onSelect={pickConflict} />
      </section>
    </div>
  );
}
