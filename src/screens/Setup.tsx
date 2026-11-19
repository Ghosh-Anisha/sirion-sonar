import { useCallback, useMemo, useState } from "react";
import { APPROVED_BY, connections } from "../data/connections";
import { contracts } from "../data/contracts";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { AccessLog } from "../components/setup/AccessLog";
import { ConnectionCard } from "../components/setup/ConnectionCard";
import { FirstReadPlayer } from "../components/setup/FirstReadPlayer";
import { Card } from "../components/ui/Card";
import { planFirstRead } from "../logic/firstRead";
import { useClock } from "../state/ClockContext";
import { useDemoState } from "../state/DemoStateContext";
import { personName } from "../state/useNeedsYou";
import { useViewer } from "../state/ViewerContext";
import "../components/setup/Setup.css";

const plan = planFirstRead(vendors, contracts, payments, emails);
const TOTAL = plan.lines.length + plan.steps.length;

/** How many access log entries exist once the read has got this far. */
function accessShown(progress: number): number {
  if (progress === 0) return 0;
  if (progress >= TOTAL) return plan.access.length;
  const read = Math.max(0, progress - plan.lines.length);
  return 1 + plan.steps.slice(0, read).reduce((n, s) => n + Math.max(1, s.files.length), 0);
}

export function Setup() {
  const { state, dispatch } = useDemoState();
  const { today } = useClock();
  const { viewer } = useViewer();
  const [progress, setProgress] = useState(state.firstReadDone ? TOTAL : 0);

  const onProgress = useCallback(
    (next: number) => {
      setProgress(next);
      if (next >= TOTAL) dispatch({ type: "first-read-done", on: today, by: viewer.id });
    },
    [dispatch, today, viewer.id],
  );
  const access = useMemo(() => plan.access.slice(0, accessShown(progress)), [progress]);

  return (
    <div className="setup stack">
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>Setup</h1>
        <p className="muted">
          Connect the three sources once, read-only, then run the first read. After that the list and the weekly email
          take over.
        </p>
      </header>

      <p className="setup__mock" role="note">
        This is a mock consent screen. Nothing is connected and no real files or mail are read. The connections below show
        what Sonar would ask for.
      </p>

      <section className="stack" aria-labelledby="connections-title">
        <h2 id="connections-title">Connections</h2>
        <div className="setup__connections">
          {connections.map((c) => (
            <ConnectionCard key={c.id} connection={c} approvedBy={`${personName.get(APPROVED_BY)}, IT admin`} />
          ))}
        </div>
      </section>

      <Card title="What Sonar can see and what it never does">
        <div className="setup__limits">
          <div>
            <h3>Can see</h3>
            <ul>
              <li>Who the company pays, when and how much.</li>
              <li>Contracts, amendments and invoices in the chosen folders.</li>
              <li>Mail to and from supplier domains in the shared inboxes.</li>
            </ul>
          </div>
          <div>
            <h3>Never does</h3>
            <ul>
              <li>Pays, holds or approves a payment.</li>
              <li>Signs anything, or changes a file in the drive.</li>
              <li>Contacts a supplier without the owner's click.</li>
              <li>Reads mail outside supplier domains, or anyone's own mailbox.</li>
            </ul>
          </div>
        </div>
      </Card>

      <FirstReadPlayer plan={plan} progress={progress} onProgress={onProgress} />
      <AccessLog entries={access} />
    </div>
  );
}
