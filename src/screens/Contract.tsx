import { useCallback, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { emails } from "../data/emails";
import { vendors } from "../data/vendors";
import type { Fact } from "../data/types";
import { ContractText } from "../components/contract/ContractText";
import { FactTable } from "../components/contract/FactTable";
import { SirionCard } from "../components/contract/SirionCard";
import { History } from "../components/item/History";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Field } from "../components/ui/Field";
import { Toast } from "../components/ui/Toast";
import { contractDates } from "../logic/dates";
import { fieldLabel, formatFactValue } from "../logic/factFormat";
import { formatDate } from "../logic/format";
import { handoffStatus } from "../logic/sirionHandoff";
import { useDemoState } from "../state/DemoStateContext";
import { useLedger } from "../state/useLedger";
import { useViewer } from "../state/ViewerContext";
import { ThinkingBadge } from "../components/thinking/ThinkingBadge";
import "./Contract.css";

export function Contract() {
  const { id = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const { contracts, paid, today } = useLedger();
  const { state, dispatch } = useDemoState();
  const { viewer } = useViewer();
  const [toast, setToast] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const contract = contracts.find((c) => c.id === id);
  if (!contract) {
    return <EmptyState title="No contract with that name" action={<Link to="/contracts">See all contracts</Link>} />;
  }

  const vendor = vendors.find((v) => v.id === contract.vendorId)!;
  const dates = contractDates(contract.facts, today, (paid.get(vendor.id) ?? []).map((p) => p.date));
  const selected = (params.get("fact") as Fact["field"] | null) ?? null;
  const activeSentence = contract.facts.find((f) => f.field === selected)?.sentence ?? null;
  const hasAmendment = emails.some((e) => e.amendment?.contractId === contract.id);
  const sirion = handoffStatus(contract, state.sirion[contract.id]);
  const canSend = viewer.role === "procurement-lead" || viewer.id === vendor.ownerId;
  const unchecked = contract.facts.filter((f) => f.label !== "confirmed" && f.value !== null);

  const confirmRest = () => {
    for (const fact of unchecked) {
      dispatch({
        type: "edit-fact",
        contractId: contract.id,
        field: fact.field,
        edit: { kind: "confirmed", value: fact.value, by: viewer.id, on: today },
        text: `confirmed the ${fieldLabel(fact.field).toLowerCase()}, ${formatFactValue(fact)}.`,
      });
    }
    setToast(`${unchecked.length} ${unchecked.length === 1 ? "fact" : "facts"} confirmed.`);
  };

  const sendToSirion = () => {
    dispatch({ type: "send-to-sirion", contractId: contract.id, send: { by: viewer.id, on: today }, text: `sent ${contract.title} to Sirion.` });
    setToast(`${contract.title} sent to Sirion.`);
  };

  const edit = (fact: Fact, kind: "confirmed" | "corrected", value: Fact["value"]) => {
    const name = fieldLabel(fact.field).toLowerCase();
    const after = formatFactValue({ ...fact, value });
    const text =
      kind === "confirmed"
        ? `confirmed the ${name}, ${after}.`
        : `corrected the ${name} from ${formatFactValue(fact)} to ${after}.`;
    dispatch({ type: "edit-fact", contractId: contract.id, field: fact.field, edit: { kind, value, by: viewer.id, on: today }, text });
    setParams({ fact: fact.field }, { replace: true });
    setToast(kind === "confirmed" ? `${fieldLabel(fact.field)} confirmed.` : `${fieldLabel(fact.field)} corrected. Dates and the list are updated.`);
  };

  const deadlineValue = dates.noticeDeadline
    ? formatDate(dates.noticeDeadline)
    : dates.earliestDeadline
      ? `Between ${formatDate(dates.earliestDeadline)} and ${formatDate(dates.latestDeadline!)}`
      : "Not known";

  return (
    <div className="contract-screen stack">
      <Link to="/contracts" className="contract-screen__back">
        All contracts
      </Link>
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>{contract.title}</h1>
        <p className="muted">
          {vendor.name}. Check each fact against the sentence it comes from, then confirm it or correct it.
        </p>
      </header>

      {contract.gap && (
        <p className="contract-screen__gap" role="note">
          {contract.gap}
        </p>
      )}

      <Card tour="contract-dates" title="Dates, worked out from the facts" actions={<ThinkingBadge at="contract.dates" />}>
        <div className="contract-screen__dates">
          <Field label="Current term ends" value={dates.endDate ? formatDate(dates.endDate) : "Not known exactly"} confidence={dates.label} />
          <Field label="Last day to give notice" value={deadlineValue} confidence={dates.label} />
          <Field label="Renews on its own" value={dates.autoRenews ? "Yes" : "No"} />
        </div>
        {hasAmendment && (
          <p className="contract-screen__versions">
            <Link to={`/versions/${contract.id}`}>An amendment has arrived. Compare versions.</Link>
          </p>
        )}
      </Card>

      <SirionCard contract={contract} status={sirion} canSend={canSend} onSend={sendToSirion} />

      <div className="row">
        <ThinkingBadge at="contract.facts" />
        <ThinkingBadge at="contract.text" />
        {unchecked.length > 0 && unchecked.length < contract.facts.length && (
          <Button variant="secondary" onClick={confirmRest} data-nudge="confirm-all">
            Confirm the rest ({unchecked.length})
          </Button>
        )}
      </div>
      <div className="contract-screen__grid">
        <FactTable
          facts={contract.facts}
          selected={selected}
          onSelect={(field) => setParams({ fact: field }, { replace: true })}
          onConfirm={(fact) => edit(fact, "confirmed", fact.value)}
          onCorrect={(fact, value) => edit(fact, "corrected", value)}
        />
        <ContractText contract={contract} activeSentence={activeSentence} />
      </div>

      <History entries={state.log.filter((e) => e.contractId === contract.id)} empty="Nobody has checked this contract yet." />
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  );
}
