import { useMemo } from "react";
import { DEMO_START } from "../data/demo";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { MetricCard } from "../components/measures/MetricCard";
import { NorthStarCard } from "../components/measures/NorthStarCard";
import { SignalTable } from "../components/measures/SignalTable";
import { measures } from "../logic/measures";
import { useDemoState } from "../state/DemoStateContext";
import { useLedger } from "../state/useLedger";
import { PROCUREMENT_LEAD } from "../state/ViewerContext";
import "../components/measures/Measures.css";

export function Measures() {
  const { items, contracts, paid, today } = useLedger();
  const { state } = useDemoState();
  const m = useMemo(
    () =>
      measures({
        today,
        firstReadOn: DEMO_START,
        items,
        contracts,
        vendors,
        payments,
        paid,
        actions: state.actions,
        factEdits: state.factEdits,
        opened: state.opened,
        procurementLeadId: PROCUREMENT_LEAD.id,
        connectionsApproved: true,
      }),
    [today, items, contracts, paid, state],
  );

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>Measures</h1>
        <p className="muted">Worked out live from the sample data and what has been done in this demo. Decide an item and these numbers move.</p>
      </header>

      <p className="no-baseline" role="note">
        There is no baseline. The company never tracked how many renewals it missed, so the first month sets the starting
        figures and no saving is claimed. Money is counted only where an invoice or a cap breach proves it.
      </p>

      <NorthStarCard star={m.northStar} />

      <section className="stack" aria-labelledby="metrics-title">
        <h2 id="metrics-title">How we know it works</h2>
        <p className="muted">The faint line on each bar is the starting target.</p>
        <div className="metrics">
          {m.metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <section className="stack" aria-labelledby="signals-title">
        <h2 id="signals-title">What would make us rethink</h2>
        <SignalTable signals={m.signals} />
      </section>
    </div>
  );
}
