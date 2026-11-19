import { useState } from "react";
import { conflicts, groups, type GroupId } from "../data/caseStudy";
import { StakeholderMap } from "../components/case/StakeholderMap";
import "./Story.css";

/** The power and interest map with a row of conflict chips. A group shows what it wants; a conflict lights up its two groups. */
export function StakeholderExplorer({ initialConflict = null }: { initialConflict?: string | null }) {
  const [group, setGroup] = useState<GroupId | null>(null);
  const [conflictId, setConflictId] = useState<string | null>(conflicts.some((c) => c.id === initialConflict) ? initialConflict : conflicts[0].id);
  const conflict = conflicts.find((c) => c.id === conflictId) ?? null;
  const picked = groups.find((g) => g.id === group) ?? null;

  return (
    <div className="explorer" data-tour="story-stakeholders">
      <div className="explorer__map">
        <StakeholderMap
          selected={group}
          highlighted={conflict ? conflict.between : []}
          onSelect={(id) => {
            setGroup(id === group ? null : id);
            setConflictId(null);
          }}
        />
      </div>
      <div className="explorer__side" aria-live="polite">
        {picked ? (
          <>
            <p className="story-kicker">What they want</p>
            <p className="explorer__title">{picked.name}</p>
            <p>{picked.wants}</p>
          </>
        ) : conflict ? (
          <>
            <p className="story-kicker">{conflict.betweenText}</p>
            <p className="explorer__title">{conflict.title}</p>
            <p>{conflict.sonar}</p>
          </>
        ) : (
          <p className="muted">Pick a group on the map, or a conflict below.</p>
        )}
      </div>
      <ul className="explorer__chips" aria-label="Conflicts">
        {conflicts.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={`chip${c.id === conflictId ? " chip--on" : ""}`}
              aria-pressed={c.id === conflictId}
              onClick={() => {
                setConflictId(c.id === conflictId ? null : c.id);
                setGroup(null);
              }}
            >
              {c.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
