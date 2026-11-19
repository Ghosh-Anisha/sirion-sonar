import type { Fact } from "../../data/types";
import { clauseRef, fieldLabel, formatFactValue } from "../../logic/factFormat";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Table, type Column } from "../ui/Table";
import { FactControls } from "./FactControls";
import "./FactTable.css";

interface FactTableProps {
  facts: Fact[];
  selected: Fact["field"] | null;
  onSelect: (field: Fact["field"]) => void;
  onConfirm: (fact: Fact) => void;
  onCorrect: (fact: Fact, value: string | number) => void;
}

/** Each fact read from the contract, how far to trust it, where it comes from, and the owner's controls. */
export function FactTable({ facts, selected, onSelect, onConfirm, onCorrect }: FactTableProps) {
  const columns: Column<Fact>[] = [
    {
      key: "field",
      header: "Field",
      render: (f) => (
        <div className="fact-table__field">
          <span className={f.field === selected ? "fact-table__selected" : undefined}>{fieldLabel(f.field)}</span>
          <Button variant="quiet" onClick={() => onSelect(f.field)} aria-pressed={f.field === selected}>
            {clauseRef(f)}
          </Button>
        </div>
      ),
    },
    { key: "value", header: "Value", render: (f) => <span className="num">{formatFactValue(f)}</span> },
    { key: "label", header: "Label", render: (f) => <Badge kind={f.label} /> },
    {
      key: "check",
      header: "Check",
      render: (f) => (
        <FactControls
          key={`${f.field}-${String(f.value)}`}
          fact={f}
          onConfirm={() => onConfirm(f)}
          onCorrect={(value) => onCorrect(f, value)}
        />
      ),
    },
  ];
  return <Table tour="fact-table" caption="Facts read from this contract" columns={columns} rows={facts} rowKey={(f) => f.field} />;
}
