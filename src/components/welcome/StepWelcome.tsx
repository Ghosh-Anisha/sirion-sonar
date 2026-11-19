import { beats } from "../../data/autoplay";
import { COMPANY_NAME } from "../../data/drafts";
import { storySeconds } from "../../logic/story";
import { useGuide } from "../../state/GuideContext";
import { usePlayDemo } from "../guide/usePlayDemo";
import { Button } from "../ui/Button";
import { Icon, type IconName } from "../ui/Icon";
import "./Welcome.css";

const SECONDS = storySeconds(beats);

const FEATURES: { icon: IconName; tone: string; title: string; line: string }[] = [
  { icon: "find", tone: "find", title: "Finds your supplier contracts", line: "It starts from who the company pays, then looks in the drive and mail for each supplier." },
  { icon: "check", tone: "check", title: "Reads them", line: "Every date and price comes with the sentence it was taken from." },
  { icon: "decide", tone: "decide", title: "Tells the right person", line: "A notice deadline getting close, an invoice above the agreed rate, a supplier paid with no contract." },
];

/** Step 1: what Sonar does, and two ways in: watch the story play, or walk through it yourself. */
export function StepWelcome() {
  const { setOpen, startTour } = useGuide();
  const play = usePlayDemo();

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <ul className="features">
        {FEATURES.map((f) => (
          <li key={f.title} className="feature">
            <span className={`tile tile--${f.tone}`} aria-hidden="true">
              <Icon name={f.icon} size={20} />
            </span>
            <span className="feature__title">{f.title}</span>
            <span className="muted">{f.line}</span>
          </li>
        ))}
      </ul>

      <div className="welcome-ctas">
        <Button variant="primary" className="button--big" onClick={play}>
          Watch the demo, {SECONDS} seconds
        </Button>
        <Button
          className="button--big"
          data-tour="walkthrough"
          onClick={() => {
            setOpen(true);
            startTour("welcome");
          }}
        >
          Walk through it yourself
        </Button>
      </div>

      <p className="wizard-note" role="note">
        This is a sample company, {COMPANY_NAME}, with sample data. Nothing is really connected, and nothing you do here
        leaves your browser.
      </p>
    </div>
  );
}
