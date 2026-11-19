import { useEffect, useMemo, useState, type ReactNode } from "react";
import { people } from "../data/people";
import { solution } from "../data/story";
import type { ThinkingKey } from "../data/thinking";
import { vendors } from "../data/vendors";
import { invoicePlay } from "../logic/solutionPlay";
import { useLedger } from "../state/useLedger";
import { useThinking } from "../state/ThinkingContext";
import { Button } from "../components/ui/Button";
import { CockpitColumn } from "./CockpitColumn";
import { EventsColumn } from "./EventsColumn";
import { FlowArrow } from "./FlowArrow";
import { LedgerColumn } from "./LedgerColumn";
import { LitContext } from "./LitContext";
import { PeopleColumn } from "./PeopleColumn";
import { SonarColumn } from "./SonarColumn";
import { SourcesColumn } from "./SourcesColumn";
import "./Solution.css";

const STEP_MS = 2000;
const name = (id: string) => people.find((p) => p.id === id)?.name ?? id;

const COLUMNS: { id: keyof typeof solution.columns; thinking: ThinkingKey; body: ReactNode }[] = [
  { id: "events", thinking: "home.decide", body: <EventsColumn /> },
  { id: "sources", thinking: "welcome.sources", body: <SourcesColumn /> },
  { id: "sonar", thinking: "welcome.first-read", body: <SonarColumn /> },
  { id: "record", thinking: "contract.dates", body: <LedgerColumn /> },
  { id: "cockpit", thinking: "item.routing", body: <CockpitColumn /> },
  { id: "people", thinking: "email.weekly", body: <PeopleColumn /> },
];

/**
 * The whole product, left to right. Play follows one Brightline invoice through it in about 12 seconds,
 * lighting each part it touches with a one line caption. Pause, Back and Next step through it by hand.
 */
export function SolutionDiagram() {
  const { items } = useLedger();
  const { show } = useThinking();
  const invoice = items.find((i) => i.id === "check:brightline-invoice");
  const owner = invoice ? vendors.find((v) => v.id === invoice.vendorId)?.ownerId : null;
  const steps = useMemo(() => invoicePlay(invoice, "Brightline Logistics", owner ? name(owner) : "the owner", name("arjun")), [invoice, owner]);
  const [at, setAt] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || at === null) return;
    if (at >= steps.length - 1) return setPlaying(false);
    const timer = window.setTimeout(() => setAt(at + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, at, steps.length]);

  const lit = useMemo(() => new Set(at === null ? [] : steps[at].lit), [at, steps]);
  const play = () => {
    if (at === null || at >= steps.length - 1) setAt(0);
    setPlaying(true);
  };

  return (
    <LitContext.Provider value={lit}>
      <div className="play" data-tour="solution-play">
        <div className="row play__controls">
          <Button variant="primary" onClick={playing ? () => setPlaying(false) : play}>
            {playing ? "Pause" : at === null ? "Play one invoice through it" : "Play"}
          </Button>
          <Button onClick={() => setAt(Math.max(0, (at ?? 0) - 1))} disabled={at === null || at === 0}>
            Back
          </Button>
          <Button onClick={() => setAt(at === null ? 0 : Math.min(steps.length - 1, at + 1))} disabled={at === steps.length - 1}>
            Next step
          </Button>
        </div>
        <p className="play__caption" aria-live="polite">
          {at === null ? (
            "Press Play to follow one invoice from the supplier's email to the people who act on it."
          ) : (
            <>
              <span className="story-kicker">
                Step <span className="num">{at + 1}</span> of <span className="num">{steps.length}</span>
              </span>
              {steps[at].caption}
            </>
          )}
        </p>
      </div>

      <div className="diagram" data-tour="solution-diagram">
        {COLUMNS.map((c, i) => (
          <div key={c.id} className="diagram__cell">
            <section className={`sol-col sol-col--${c.id}`} aria-labelledby={`col-${c.id}`}>
              <h2 id={`col-${c.id}`} className="sol-col__title">
                <button type="button" onClick={() => show(c.thinking)} aria-label={`${solution.columns[c.id]}. Open under the hood.`}>
                  <span className="num">{i + 1}</span> {solution.columns[c.id]}
                </button>
              </h2>
              {c.body}
            </section>
            {i < COLUMNS.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>
    </LitContext.Provider>
  );
}
