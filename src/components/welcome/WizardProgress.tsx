import "./Welcome.css";

/** Where the wizard is: the step name, and a bar that fills as it goes. */
export function WizardProgress({ step, titles }: { step: number; titles: string[] }) {
  const total = titles.length;
  return (
    <div className="wizard-progress">
      <p className="wizard-progress__text">
        <span className="label">
          Step <span className="num">{step + 1}</span> of <span className="num">{total}</span>
        </span>
        <span>{titles[step]}</span>
      </p>
      <div
        className="wizard-progress__bar"
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step + 1}
        aria-valuetext={`Step ${step + 1} of ${total}, ${titles[step]}`}
      >
        <span style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}
