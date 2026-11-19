import { solution } from "../data/story";
import { Table, type Column } from "../components/ui/Table";
import { AuditTrail } from "../solution/AuditTrail";
import { SolutionDiagram } from "../solution/SolutionDiagram";
import { StoryNext } from "../story/StoryNext";
import "../story/Story.css";
import "../solution/Solution.css";

type RealRow = (typeof solution.real)[number];
const COLUMNS: Column<RealRow>[] = [
  { key: "part", header: "Part", render: (r) => r.part },
  { key: "how", header: "In the prototype", render: (r) => r.how },
];

/** Page 2: the whole product as one diagram, an audit trail, and what in the prototype is real. */
export function Solution() {
  return (
    <div className="story-page solution-page">
      <header className="section-head" data-tour="story-head">
        <p className="story-kicker">{solution.kicker}</p>
        <h1 className="story-headline">{solution.headline}</h1>
        <p className="story-lead">{solution.lead}</p>
      </header>

      <SolutionDiagram />

      <div className="bottom-strip">
        <div className="today" data-tour="solution-today">
          <p className="story-kicker">{solution.today.title}</p>
          <p>{solution.today.line}</p>
        </div>
        <AuditTrail />
      </div>

      <section className="stack" aria-labelledby="real-title" data-tour="solution-real">
        <h2 id="real-title">{solution.realTitle}</h2>
        <Table caption={solution.realTitle} columns={COLUMNS} rows={[...solution.real]} rowKey={(r) => r.part} />
      </section>

      <StoryNext soWhat={solution.soWhat} next={solution.next} />
    </div>
  );
}
