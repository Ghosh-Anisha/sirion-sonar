import { useCallback, useEffect, useMemo, useState } from "react";
import { contracts } from "../../data/contracts";
import { people } from "../../data/people";
import { IT_ADMIN_ID, PILOT_SIZE, sources } from "../../data/sources";
import { readEntries, widenEntry } from "../../logic/accessText";
import { tally } from "../../logic/firstRead";
import { pipelineStages, scopeSteps, stageEntries } from "../../logic/pipeline";
import { firstReadPlan } from "../../state/firstReadPlan";
import { useActor } from "../../state/useActor";
import { useLedger } from "../../state/useLedger";
import { useOnboarding } from "../../state/OnboardingContext";
import { PROCUREMENT_LEAD } from "../../state/ViewerContext";
import { CoverageBar } from "../home/CoverageBar";
import { Button } from "../ui/Button";
import { ClassifierPanel } from "./ClassifierPanel";
import { MaskPreview } from "./MaskPreview";
import { StageRow, type StageStatus } from "./StageRow";
import "../home/CoverageStrip.css";
import "./Welcome.css";

const plan = firstReadPlan;
const TICKS = 10;
const TICK_MS = 120;
const admin = people.find((p) => p.id === IT_ADMIN_ID)!;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Step 6: the eight steps of the first read, played one at a time from the precomputed plan. */
export function StepFirstRead() {
  const { state, dispatch } = useOnboarding();
  const { items, today } = useLedger();
  const actor = useActor();
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);

  const pilot = state.start === "pilot" && !state.readAll;
  const steps = useMemo(() => scopeSteps(plan, pilot, PILOT_SIZE), [pilot]);
  const products = useMemo(
    () => sources.flatMap((s) => state.sources[s.id].scope?.products ?? [s.products[0]]),
    [state.sources],
  );
  const stages = useMemo(
    () => pipelineStages({ plan, steps, products, contracts, items, procurementLeadId: PROCUREMENT_LEAD.id }),
    [steps, products, items],
  );
  const stage = state.readStage;
  const done = stage >= stages.length;

  const finish = useCallback(
    (from: number, to: number) => {
      const entries = stages.slice(from, to).flatMap((s) => readEntries(stageEntries(s.id, plan, steps), today));
      dispatch({ type: "read-stage", stage: to, entries });
      setCount(0);
    },
    [stages, steps, today, dispatch],
  );

  useEffect(() => {
    if (!running || done) return;
    const total = stages[stage].total;
    const timer = window.setTimeout(() => {
      if (count >= total) finish(stage, stage + 1);
      else setCount(Math.min(total, count + Math.max(1, Math.ceil(total / TICKS))));
    }, TICK_MS);
    return () => window.clearTimeout(timer);
  }, [running, done, stage, count, stages, finish]);

  useEffect(() => {
    if (done && !pilot && !state.firstReadDone) dispatch({ type: "read-done" });
    if (done) setRunning(false);
  }, [done, pilot, state.firstReadDone, dispatch]);

  const start = () => (prefersReducedMotion() ? finish(stage, stages.length) : setRunning(true));
  const widen = () => {
    const narrowed = state.approval.status === "approved" && state.approval.scope === "pilot";
    dispatch({ type: "widen", entry: narrowed ? widenEntry(plan.steps.length, { ...actor, by: admin.name }) : null });
    if (!prefersReducedMotion()) setRunning(true);
  };

  const statusOf = (i: number): StageStatus => (i < stage ? "done" : i === stage && running ? "running" : "waiting");
  const countOf = (i: number) => (i < stage ? stages[i].total : i === stage ? count : 0);
  const counts = tally(steps, steps.length);
  const current = stages[stage];

  return (
    <div className="stack">
      <div className="first-read__bar">
        <p>
          {pilot ? `Reading the pilot: the top ${steps.length} suppliers by spend.` : `Reading all ${steps.length} suppliers.`} This
          is a precomputed run on the sample data.
        </p>
        {!done &&
          (running ? (
            <Button variant="quiet" onClick={() => finish(stage, stages.length)}>
              Skip to the end
            </Button>
          ) : (
            <Button variant="primary" onClick={start} data-nudge="run-first-read">
              {stage === 0 ? "Run the first read" : "Carry on"}
            </Button>
          ))}
      </div>
      <p className="visually-hidden" role="status">
        {done ? "The first read is done." : running && current ? `Step ${stage + 1}: ${current.title}` : ""}
      </p>

      <ol className="pipeline">
        {stages.map((s, i) => (
          <StageRow key={s.id} stage={s} number={i + 1} status={statusOf(i)} count={countOf(i)}>
            {s.id === "vendors" && statusOf(i) !== "waiting" && <ClassifierPanel lines={plan.lines} sorted={countOf(i)} />}
            {s.id === "read" && statusOf(i) !== "waiting" && <MaskPreview />}
          </StageRow>
        ))}
      </ol>

      {done && (
        <div className="first-read__done" role="status">
          <h3>
            {plan.steps.length} suppliers: {counts.full} found, {counts.partial} partial, {counts.none} not found
            {pilot ? `, ${plan.steps.length - steps.length} not read yet` : ""}
          </h3>
          <div className="first-read__coverage">
            <CoverageBar full={counts.full} partial={counts.partial} none={counts.none} pending={plan.steps.length - steps.length} />
          </div>
          {pilot ? (
            <>
              <p>
                The pilot read the top {steps.length} suppliers by spend. The other {plan.steps.length - steps.length} wait until
                the access is widened.
                {state.approval.status === "approved" && state.approval.scope === "pilot"
                  ? ` IT approved the pilot only, so widening is logged as ${admin.name} widening it.`
                  : ""}
              </p>
              <Button variant="primary" onClick={widen}>
                Widen to all {plan.steps.length} suppliers
              </Button>
            </>
          ) : (
            <p>The ones not found are suppliers the company pays with no contract on file. That is the finding.</p>
          )}
        </div>
      )}
    </div>
  );
}
