import { contracts } from "../../data/contracts";
import { payments } from "../../data/payments";
import { vendors } from "../../data/vendors";
import { coverage } from "../../logic/coverage";
import { useClock } from "../../state/ClockContext";
import "./CoverageStrip.css";

/** How many of the suppliers we pay have a contract record. */
export function CoverageStrip() {
  const { today } = useClock();
  const c = coverage(vendors, contracts, payments, today);
  const withRecord = c.full + c.partial;

  return (
    <section className="coverage" aria-labelledby="coverage-title">
      <div className="coverage__text">
        <h2 id="coverage-title" className="label">
          Coverage
        </h2>
        <p>
          <strong className="num">
            {withRecord} of {c.paid}
          </strong>{" "}
          suppliers we pay have a contract record, covering <span className="num">{c.spendShare}%</span> of what we
          pay them. {c.none} have none on file.
        </p>
      </div>
      <div className="coverage__bar" aria-hidden="true">
        <span className="coverage__full" style={{ flexGrow: c.full }} />
        <span className="coverage__partial" style={{ flexGrow: c.partial }} />
        <span className="coverage__none" style={{ flexGrow: c.none }} />
      </div>
      <ul className="coverage__legend">
        <li>
          <span className="coverage__key coverage__full" aria-hidden="true" />
          <span className="num">{c.full}</span> full
        </li>
        <li>
          <span className="coverage__key coverage__partial" aria-hidden="true" />
          <span className="num">{c.partial}</span> partial
        </li>
        <li>
          <span className="coverage__key coverage__none" aria-hidden="true" />
          <span className="num">{c.none}</span> nothing found
        </li>
      </ul>
    </section>
  );
}
