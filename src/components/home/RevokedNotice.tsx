import { Link } from "react-router-dom";
import { sources } from "../../data/sources";
import { formatDate } from "../../logic/format";
import { useOnboarding } from "../../state/OnboardingContext";

/** Says which sources have been disconnected, so nobody reads a quiet list as an all clear. */
export function RevokedNotice() {
  const { state } = useOnboarding();
  const revoked = sources.filter((s) => state.sources[s.id].status === "revoked");
  if (revoked.length === 0) return null;
  return (
    <div className="revoked-notice" role="status">
      {revoked.map((s) => {
        const info = state.sources[s.id].revoked!;
        return (
          <p key={s.id}>
            {s.name} was disconnected by {info.by} on {formatDate(info.on)}. {s.stops[0]}
          </p>
        );
      })}
      <Link to="/access">See the access log</Link>
    </div>
  );
}
