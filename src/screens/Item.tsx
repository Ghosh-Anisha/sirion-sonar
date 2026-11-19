import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { emails } from "../data/emails";
import { payments } from "../data/payments";
import { vendors } from "../data/vendors";
import { ItemHeader } from "../components/item/ItemHeader";
import { DraftReply } from "../components/item/DraftReply";
import { EvidenceList } from "../components/item/EvidenceList";
import { History } from "../components/item/History";
import { ItemActions } from "../components/item/ItemActions";
import { PaymentsTable } from "../components/item/PaymentsTable";
import { ButtonLink } from "../components/ui/ButtonLink";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Toast } from "../components/ui/Toast";
import { actionOptions, actionPastTense } from "../logic/actions";
import { draftFor } from "../logic/drafts";
import { itemEvidence } from "../logic/evidence";
import { itemRefs, type ActionKind } from "../logic/items";
import { useDemoState } from "../state/DemoStateContext";
import { useLedger } from "../state/useLedger";
import { toRow } from "../state/useNeedsYou";
import { useViewer } from "../state/ViewerContext";
import { ThinkingBadge } from "../components/thinking/ThinkingBadge";
import "./Item.css";

const DECISIONS: ActionKind[] = ["renew", "renegotiate", "end"];

export function Item() {
  const { id = "" } = useParams();
  const { items, contracts, today } = useLedger();
  const { state, dispatch } = useDemoState();
  const { viewer } = useViewer();
  const [toast, setToast] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const item = items.find((i) => i.id === id);
  const foundId = item?.id;
  useEffect(() => {
    if (foundId) dispatch({ type: "open-item", itemId: foundId, on: today });
  }, [foundId, today, dispatch]);

  if (!item) {
    return (
      <EmptyState
        title="This item is not on the list today"
        body="Its date may have moved, or the clock is set before it appeared."
        action={<Link to="/home">Back to Needs you</Link>}
      />
    );
  }

  const vendor = vendors.find((v) => v.id === item.vendorId)!;
  const refs = itemRefs(item);
  const contract = contracts.find((c) => c.id === refs.contractId);
  const email = emails.find((e) => e.id === refs.emailId);
  const decision = item.action && DECISIONS.includes(item.action.kind) ? item.action.kind : null;
  const draft = draftFor(item, decision, { vendor, contract, email, sender: `${viewer.name}, ${viewer.title}` });
  const sent = state.sent[item.id];
  const row = toRow(item, today);

  const act = (kind: ActionKind) => {
    const label = actionOptions(item).find((o) => o.kind === kind)?.label ?? kind;
    dispatch({ type: "act", itemId: item.id, action: { kind, on: today, by: viewer.id }, text: `${actionPastTense(kind)}.` });
    setToast(`${label}: saved.`);
  };

  const send = () => {
    if (!draft) return;
    dispatch({
      type: "send",
      itemId: item.id,
      message: { ...draft, on: today, by: viewer.id },
      markDone: item.status === "open",
      text: `sent "${draft.subject}" to ${draft.to}.`,
    });
    setToast(`Sent to ${draft.to}.`);
  };

  return (
    <div className="item-screen stack">
      <Link to="/home" className="item-screen__back">
        Back to Needs you
      </Link>
      <ItemHeader row={row} vendorName={vendor.name} />

      <div className="item-screen__grid">
        <Card title="Why this is here" actions={<ThinkingBadge at="item.evidence" />}>
          <EvidenceList evidence={itemEvidence(item, contract)} />
          {refs.paymentIds.length > 0 && <PaymentsTable lines={payments.filter((p) => refs.paymentIds.includes(p.id))} />}
        </Card>

        <Card title="What to do" actions={<ThinkingBadge at="item.draft" />}>
          <div className="stack">
            <ItemActions item={item} onAct={act} />
            {item.type === "decide" && !decision && (
              <p className="muted">Choose one and Sonar drafts the reply for you to read before anything is sent.</p>
            )}
            {item.detail.kind === "amendment" && (
              <>
                <p>Compare the amendment with the current text, then accept or reject it on the Versions page.</p>
                <ButtonLink to={`/versions/${item.detail.contractId}`} variant="primary">
                  Open versions
                </ButtonLink>
              </>
            )}
            {draft && <DraftReply draft={draft} sent={sent} onSend={send} />}
            {contract && <Link to={`/contract/${contract.id}`}>Open the contract</Link>}
          </div>
        </Card>
      </div>

      <History entries={state.log.filter((e) => e.itemId === item.id)} empty="Nobody has acted on this yet." />
      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  );
}
