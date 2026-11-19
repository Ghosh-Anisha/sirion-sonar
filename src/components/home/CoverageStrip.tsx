import { contracts } from "../../data/contracts";
import { payments } from "../../data/payments";
import { vendors } from "../../data/vendors";
import { coverage } from "../../logic/coverage";
import { useClock } from "../../state/ClockContext";
import { CoverageBar } from "./CoverageBar";
import { ThinkingBadge } from "../thinking/ThinkingBadge";
import "./CoverageStrip.css";

/** How many of the suppliers we pay have a contract record. */
export function CoverageStrip() {
  const { today } = useClock();
  const c = coverage(vendors, contracts, payments, today);
  const withRecord = c.full + c.partial;

  return (
    <section className="coverage" aria-labelledby="coverage-title">
      <div className="coverage__text">
        <div className="row">
          <h2 id="coverage-title" className="label">
            Coverage
          </h2>
          <ThinkingBadge at="home.coverage" />
        </div>
        <p>
          <strong className="num">
            {withRecord} of {c.paid}
          </strong>{" "}
          suppliers we pay have a contract record, covering <span className="num">{c.spendShare}%</span> of what we
          pay them. {c.none} have none on file.
        </p>
      </div>
      <CoverageBar full={c.full} partial={c.partial} none={c.none} />
    </section>
  );
}
