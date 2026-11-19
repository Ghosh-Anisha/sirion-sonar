import { Link } from "react-router-dom";
import type { Trace } from "../../logic/inbound";
import { Button } from "../ui/Button";
import { ThinkingBadge } from "../thinking/ThinkingBadge";
import "./Email.css";

interface StageListProps {
  trace: Trace;
  shown: number;
  onShow: (count: number) => void;
}

const ROUTE_LINK: Record<Trace["route"]["kind"], string | null> = {
  versions: "Open in Versions",
  item: "Open the item",
  filed: "Open the contract",
  unknown: null,
};

/** The six stages for one email, revealed one at a time, each with its result. */
export function StageList({ trace, shown, onShow }: StageListProps) {
  const total = trace.stages.length;
  const route = trace.route;
  const href =
    route.kind === "versions" || route.kind === "item" ? route.to : route.kind === "filed" ? `/contract/${route.contractId}` : null;

  return (
    <div className="stack">
      <ol className="stages">
        {trace.stages.slice(0, shown).map((s, i) => (
          <li key={s.id} className="stages__step">
            <span className="stages__number num" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h4>
                {s.title} <ThinkingBadge at={`email.${s.id}`} />
              </h4>
              <p>{s.result}</p>
            </div>
          </li>
        ))}
      </ol>
      {shown < total ? (
        <div className="row">
          <Button variant="primary" onClick={() => onShow(shown + 1)}>
            {shown === 0 ? "Start" : "Next step"}
          </Button>
          <Button variant="quiet" onClick={() => onShow(total)}>
            Show all steps
          </Button>
          <span className="muted">
            Step <span className="num">{shown}</span> of <span className="num">{total}</span>
          </span>
        </div>
      ) : (
        href && (
          <Link to={href} className="stages__end">
            {ROUTE_LINK[route.kind]}
          </Link>
        )
      )}
    </div>
  );
}
