import { useMemo } from "react";
import { DEMO_START } from "../data/demo";
import { payments } from "../data/payments";
import { MetricCard } from "../components/measures/MetricCard";
import { NorthStarCard } from "../components/measures/NorthStarCard";
import { SignalTable } from "../components/measures/SignalTable";
import { measures } from "../logic/measures";
import { useDemoState } from "../state/DemoStateContext";
import { useLedger } from "../state/useLedger";
import { useOnboarding } from "../state/OnboardingContext";
import { PROCUREMENT_LEAD } from "../state/ViewerContext";
import { ThinkingBadge } from "../components/thinking/ThinkingBadge";
import { casePages } from "../data/story";
import { StoryPage } from "../story/StoryPage";
import "../components/measures/Measures.css";

export function Measures() {
  const { items, contracts, paid, today, vendors } = useLedger();
  const { approval, sources } = useOnboarding().state;
  const approved = approval.status === "approved" && approval.scope === "full" && Object.values(sources).every((s) => s.status !== "revoked");
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
        connectionsApproved: approved,
      }),
    [today, items, contracts, paid, state, vendors, approved],
  );

  return (
    <StoryPage copy={casePages.measures}>
      <div className="measures-story">
        <div className="stack" style={{ gap: "var(--space-2)" }} data-tour="north-star">
          <ThinkingBadge at="measures.northStar" />
          <NorthStarCard star={m.northStar} />
        </div>
        <section className="stack" aria-labelledby="metrics-title" data-tour="metrics">
          <h2 id="metrics-title">
            How we know it works <ThinkingBadge at="measures.metrics" />
          </h2>
          <div className="metrics">
            {m.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>
        <details className="measures-story__signals" data-tour="signals">
          <summary>
            What would make us rethink <ThinkingBadge at="measures.signals" />
          </summary>
          <SignalTable signals={m.signals} />
        </details>
      </div>
    </StoryPage>
  );
}
