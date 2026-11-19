import { pipelineSteps, type PipelineStep } from "../../data/architecture";
import { Table, type Column } from "../ui/Table";

const COLUMNS: Column<PipelineStep>[] = [
  { key: "step", header: "Step", render: (s) => `${s.number} ${s.name}` },
  { key: "ai", header: "AI", render: (s) => (s.usesAi ? "Yes" : "No") },
  { key: "by", header: "Done by", render: (s) => s.doneBy },
  { key: "why", header: "Why", render: (s) => s.why },
];

/** Where AI is used and where it is not, and why. */
export function AiTable() {
  return <Table caption="Where AI is used and where it is not" columns={COLUMNS} rows={pipelineSteps} rowKey={(s) => String(s.number)} />;
}
