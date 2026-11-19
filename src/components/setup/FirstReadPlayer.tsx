import { useEffect, useState } from "react";
import type { FirstRead } from "../../logic/firstRead";
import { tally } from "../../logic/firstRead";
import { CoverageBar } from "../home/CoverageBar";
import { Button } from "../ui/Button";
import { ButtonLink } from "../ui/ButtonLink";
import { Card } from "../ui/Card";
import { ClassifierPanel } from "./ClassifierPanel";
import { ReadList } from "./ReadList";
import "./Setup.css";

const SORT_MS = 40;
const READ_MS = 220;

interface FirstReadPlayerProps {
  plan: FirstRead;
  /** How far the read has got: payment lines sorted, then suppliers read. */
  progress: number;
  onProgress: (next: number) => void;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Plays the precomputed first read: sort the payments, build the vendor list, then search and read each supplier. */
export function FirstReadPlayer({ plan, progress, onProgress }: FirstReadPlayerProps) {
  const [running, setRunning] = useState(false);
  const sortTotal = plan.lines.length;
  const total = sortTotal + plan.steps.length;
  const sorted = Math.min(progress, sortTotal);
  const read = Math.max(0, progress - sortTotal);
  const done = progress >= total;

  useEffect(() => {
    if (!running || done) return;
    const timer = window.setTimeout(() => onProgress(progress + 1), progress < sortTotal ? SORT_MS : READ_MS);
    return () => window.clearTimeout(timer);
  }, [running, done, progress, sortTotal, onProgress]);

  const start = () => (prefersReducedMotion() ? onProgress(total) : setRunning(true));
  const counts = tally(plan.steps, read);

  return (
    <Card
      title="First read"
      actions={
        progress === 0 ? (
          <Button variant="primary" onClick={start}>
            Run first read
          </Button>
        ) : !done ? (
          <Button variant="quiet" onClick={() => onProgress(total)}>
            Skip to the end
          </Button>
        ) : undefined
      }
    >
      {progress === 0 ? (
        <p className="muted">
          Sonar builds the vendor list from the payments, then searches the drive and mail for each supplier and reads
          what it finds, starting with the ones paid most. This is a precomputed run on the sample data.
        </p>
      ) : (
        <div className="stack first-read">
          <section className="stack">
            <h3>1. Sort the payments</h3>
            <ClassifierPanel lines={plan.lines} sorted={sorted} />
          </section>

          {sorted === sortTotal && (
            <section className="stack">
              <h3>2. Build the vendor list</h3>
              <p>
                The kept lines merge into <strong className="num">{plan.steps.length}</strong> suppliers.{" "}
                {plan.unsureNames.map(([a, b]) => `"${a}" and "${b}"`).join(", and ")} look like the same supplier, so a
                person is asked to settle {plan.unsureNames.length === 1 ? "it" : "them"}.
              </p>
            </section>
          )}

          {read > 0 && (
            <section className="stack">
              <h3>3. Search and read each supplier</h3>
              <p>
                Read <strong className="num">{read}</strong> of <span className="num">{plan.steps.length}</span> suppliers.
              </p>
              <CoverageBar full={counts.full} partial={counts.partial} none={counts.none} pending={plan.steps.length - read} />
              <ReadList steps={plan.steps.slice(0, read)} />
            </section>
          )}

          {done && (
            <div className="first-read__done" role="status">
              <p>
                The first read is done. <span className="num">{counts.full}</span> found,{" "}
                <span className="num">{counts.partial}</span> partial and <span className="num">{counts.none}</span> not found
                out of <span className="num">{plan.steps.length}</span>. The ones not found are suppliers the company pays with
                no contract on file.
              </p>
              <ButtonLink to="/home" variant="primary">
                Go to Needs you
              </ButtonLink>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
