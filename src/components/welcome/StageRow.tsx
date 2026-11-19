import type { ReactNode } from "react";
import type { Doer, Stage } from "../../logic/pipeline";
import "./Welcome.css";

const DOER: Record<Doer, string> = { code: "Code", model: "Model", agent: "Agent" };
export type StageStatus = "waiting" | "running" | "done";

interface StageRowProps {
  stage: Stage;
  number: number;
  status: StageStatus;
  count: number;
  children?: ReactNode;
}

/** One step of the first read: what it does, who does it, and how far it has got. */
export function StageRow({ stage, number, status, count, children }: StageRowProps) {
  return (
    <li className={`stage stage--${status}`} aria-current={status === "running" ? "step" : undefined}>
      <div className="stage__head">
        <span className="stage__num num" aria-hidden="true">
          {number}
        </span>
        <h3 className="stage__title">
          <span className="visually-hidden">Step {number}: </span>
          {stage.title}
        </h3>
        <span className={`doer doer--${stage.doer}`}>{DOER[stage.doer]}</span>
        <span className="stage__count">
          <span className="num">{count}</span> of <span className="num">{stage.total}</span> {stage.unit}
        </span>
      </div>
      <p className="stage__line">{stage.line}</p>
      <p className="stage__by">{stage.by}</p>
      {status === "done" && <p className="stage__result">{stage.result}</p>}
      {children}
    </li>
  );
}
