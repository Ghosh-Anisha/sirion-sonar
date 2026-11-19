import { useEffect, useRef, useState } from "react";
import { roleView, ROLE_NAME } from "../../logic/roles";
import { useLedger } from "../../state/useLedger";
import { useViewer } from "../../state/ViewerContext";
import { Avatar } from "./Avatar";

const SHOW_MS = 7000;

/** When the demo switches to another person, says who you are now and what that role sees. */
export function RoleNotice() {
  const { viewer } = useViewer();
  const { items, vendors } = useLedger();
  const [shownFor, setShownFor] = useState<string | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setShownFor(viewer.id);
    const timer = window.setTimeout(() => setShownFor(null), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [viewer.id]);

  if (shownFor !== viewer.id) return null;
  return (
    <div className={`role-notice role-notice--${viewer.role}`} role="status">
      <Avatar person={viewer} size={40} />
      <div className="role-notice__text">
        <p>
          <strong>You are now {viewer.name}</strong>, {viewer.title}. <span className={`role-tag role-tag--${viewer.role}`}>{ROLE_NAME[viewer.role]}</span>
        </p>
        <p>{roleView(viewer, items, vendors)}</p>
      </div>
      <button type="button" className="role-notice__close" onClick={() => setShownFor(null)} aria-label="Close">
        Close
      </button>
    </div>
  );
}
