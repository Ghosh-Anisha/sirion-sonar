import { Link } from "react-router-dom";
import type { UrgencyGroup } from "../logic/alerts";
import { CoverageStrip } from "../components/home/CoverageStrip";
import { ItemGroup } from "../components/home/ItemGroup";
import { NextUp } from "../components/home/NextUp";
import { StatTiles } from "../components/home/StatTiles";
import { EmptyState } from "../components/ui/EmptyState";
import { RevokedNotice } from "../components/home/RevokedNotice";
import { useOnboarding } from "../state/OnboardingContext";
import { ROLE_NAME, roleView } from "../logic/roles";
import { useLedger } from "../state/useLedger";
import { useNeedsYou } from "../state/useNeedsYou";
import { useViewer } from "../state/ViewerContext";
import "./Home.css";

const GROUPS: { id: UrgencyGroup; title: string; hint: string }[] = [
  { id: "urgent", title: "Urgent", hint: "Due within 7 days or already past." },
  { id: "month", title: "This month", hint: "Due within 30 days." },
  { id: "later", title: "Later", hint: "Due after that." },
];

function summary(firstName: string, open: number, urgent: number): string {
  if (open === 0) return `${firstName}, nothing needs you today.`;
  const things = open === 1 ? "1 thing needs you" : `${open} things need you`;
  return urgent === 0 ? `${firstName}, ${things}.` : `${firstName}, ${things}, and ${urgent} of them ${urgent === 1 ? "is" : "are"} urgent.`;
}

export function Home() {
  const rows = useNeedsYou();
  const { viewer } = useViewer();
  const { firstReadDone } = useOnboarding().state;
  const { items, vendors } = useLedger();
  const firstName = viewer.name.split(" ")[0];
  const urgent = rows.filter((r) => r.group === "urgent").length;

  return (
    <div className="home stack">
      <p className="home__why">
        Why this exists: contracts renew, overcharge and slip past their dates because nobody is told.{" "}
        <Link to="/why">Read the case</Link>
      </p>
      <header className="home__header hero">
        <p className="hero__eyebrow label">Needs you</p>
        <h1>What needs you today</h1>
        <p className="hero__lead">{summary(firstName, rows.length, urgent)}</p>
        <p className="hero__role">
          <span className={`role-tag role-tag--${viewer.role}`}>{ROLE_NAME[viewer.role]}</span> {roleView(viewer, items, vendors)}
        </p>
        {viewer.role !== "it-admin" && <StatTiles rows={rows} />}
        {!firstReadDone && (
          <p className="home__setup">
            <Link to="/welcome">Start here: connect the sources and run the first read</Link>
          </p>
        )}
      </header>

      <RevokedNotice />
      {viewer.role !== "it-admin" && rows.length > 0 && <NextUp row={rows[0]} urgentCount={urgent} />}
      <CoverageStrip />

      {viewer.role === "it-admin" ? (
        <EmptyState
          title="Nothing on this list is for IT"
          body="IT admins see the connections and the access log, not contract contents."
          action={<Link to="/access">Open the access log</Link>}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="Nothing needs you today"
          body="New items show up here when a date gets close or a supplier sends something. Move the clock forward to see what comes next."
        />
      ) : (
        <div className="stack home__list" data-tour="needs-you-list">
          {GROUPS.map((g) => (
            <ItemGroup key={g.id} id={g.id} title={g.title} hint={g.hint} rows={rows.filter((r) => r.group === g.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
