import "./CoverageStrip.css";

interface CoverageBarProps {
  full: number;
  partial: number;
  none: number;
  /** Suppliers not read yet, while the first read runs. */
  pending?: number;
}

/** A bar of suppliers by how much of a contract was found, with a text legend so color is never the only cue. */
export function CoverageBar({ full, partial, none, pending = 0 }: CoverageBarProps) {
  return (
    <>
      <div className="coverage__bar" aria-hidden="true">
        <span className="coverage__full" style={{ flexGrow: full }} />
        <span className="coverage__partial" style={{ flexGrow: partial }} />
        <span className="coverage__none" style={{ flexGrow: none }} />
        <span className="coverage__pending" style={{ flexGrow: pending }} />
      </div>
      <ul className="coverage__legend">
        <li>
          <span className="coverage__key coverage__full" aria-hidden="true" />
          <span className="num">{full}</span> found
        </li>
        <li>
          <span className="coverage__key coverage__partial" aria-hidden="true" />
          <span className="num">{partial}</span> partial
        </li>
        <li>
          <span className="coverage__key coverage__none" aria-hidden="true" />
          <span className="num">{none}</span> not found
        </li>
        {pending > 0 && (
          <li>
            <span className="num">{pending}</span> still to read
          </li>
        )}
      </ul>
    </>
  );
}
