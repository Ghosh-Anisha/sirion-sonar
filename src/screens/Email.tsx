import { useSearchParams } from "react-router-dom";
import { IncomingMail } from "../components/email/IncomingMail";
import { WeeklyEmail } from "../components/email/WeeklyEmail";
import { Tabs } from "../components/ui/Tabs";
import { useViewer } from "../state/ViewerContext";

const TABS = [
  { id: "weekly", label: "Weekly email" },
  { id: "incoming", label: "Incoming mail" },
];

export function Email() {
  const [params, setParams] = useSearchParams();
  const { viewer } = useViewer();
  const tab = params.get("tab") === "incoming" ? "incoming" : "weekly";

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>Email</h1>
        <p className="muted">
          {tab === "weekly"
            ? `The weekly email ${viewer.name} gets. Use View as in the header to see someone else's.`
            : "The five sample emails in the shared inboxes, and what Sonar does with each one."}
        </p>
      </header>
      <div data-tour="email-tabs">
        <Tabs label="Email" tabs={TABS} selected={tab} onSelect={(id) => setParams({ tab: id }, { replace: true })} />
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "weekly" ? <WeeklyEmail /> : <IncomingMail />}
      </div>
    </div>
  );
}
