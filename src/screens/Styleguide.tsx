import { useCallback, useState } from "react";
import { Badge, type BadgeKind } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Field } from "../components/ui/Field";
import { Table, type Column } from "../components/ui/Table";
import { Toast } from "../components/ui/Toast";
import { formatDate, formatMoney } from "../logic/format";

const TYPE_BADGES: BadgeKind[] = ["decide", "check", "fix", "find"];
const LABEL_BADGES: BadgeKind[] = ["confirmed", "derived", "bounded", "unknown"];

const SWATCHES = [
  "--bg", "--surface", "--ink", "--ink-2", "--line", "--brand", "--brand-soft", "--urgent",
];

interface SampleRow {
  supplier: string;
  endDate: string;
  amount: number;
}

const ROWS: SampleRow[] = [
  { supplier: "Cloudmetric", endDate: "2027-04-30", amount: 1440000 },
  { supplier: "Brightline", endDate: "2027-06-30", amount: 120000 },
  { supplier: "Orbis", endDate: "2027-01-31", amount: 865500.5 },
];

const COLUMNS: Column<SampleRow>[] = [
  { key: "supplier", header: "Supplier", render: (r) => r.supplier },
  { key: "end", header: "End date", render: (r) => formatDate(r.endDate) },
  { key: "amount", header: "Yearly value", render: (r) => formatMoney(r.amount), numeric: true },
];

/** Hidden page that renders every shared component and variant. Not in the nav. */
export function Styleguide() {
  const [toast, setToast] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  return (
    <div className="stack">
      <h1>Styleguide</h1>

      <Card title="Type">
        <div className="stack">
          <h1>Page title, 28 semibold</h1>
          <h2>Section title, 20 semibold</h2>
          <p style={{ fontSize: "var(--text-16)" }}>Large body, 16</p>
          <p>Body, 14. Cloudmetric renews on 30 Apr 2027 unless you tell them by 1 Mar.</p>
          <span className="label">Label, 12 medium uppercase</span>
          <p className="num">Tabular figures: {formatMoney(120000)} and {formatMoney(9999999)}</p>
        </div>
      </Card>

      <Card title="Colors">
        <div className="row">
          {SWATCHES.map((name) => (
            <div key={name} className="stack" style={{ gap: "var(--space-1)", width: 96 }}>
              <div
                style={{
                  height: 48,
                  background: `var(${name})`,
                  border: "var(--border)",
                  borderRadius: "var(--radius-card)",
                }}
              />
              <span className="label">{name}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Badges">
        <div className="stack">
          <div className="row">
            {TYPE_BADGES.map((kind) => <Badge key={kind} kind={kind} />)}
          </div>
          <div className="row">
            {LABEL_BADGES.map((kind) => <Badge key={kind} kind={kind} />)}
          </div>
          <div className="row">
            <Badge kind="urgent" />
          </div>
        </div>
      </Card>

      <Card title="Buttons">
        <div className="row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Card>

      <Card title="Card with actions" actions={<Button variant="quiet">Action</Button>}>
        <p>Cards are white on the grey page, with a 1px border and radius 8.</p>
      </Card>

      <Card title="Fields">
        <div className="row" style={{ gap: "var(--space-8)", alignItems: "flex-start" }}>
          <Field
            label="End date"
            value={formatDate("2027-04-30")}
            confidence="confirmed"
            source={{ text: "Clause 3.1, page 2", to: "/contract/cloudmetric" }}
          />
          <Field label="Notice deadline" value={formatDate("2027-03-01")} confidence="derived" />
          <Field label="Next deadline" value="Between 1 Jan and 31 Mar 2027" confidence="bounded" />
          <Field label="Term" value="Not on file" confidence="unknown" />
          <Field label="Agreed rate" value={formatMoney(120000)} />
        </div>
      </Card>

      <section className="stack">
        <h2>Table</h2>
        <Table caption="Sample suppliers" columns={COLUMNS} rows={ROWS} rowKey={(r) => r.supplier} />
      </section>

      <section className="stack">
        <h2>Empty state</h2>
        <EmptyState
          title="Nothing needs you today"
          body="New items show up here when a date gets close or a supplier sends something."
          action={<Button variant="secondary">Move the clock forward</Button>}
        />
      </section>

      <Card title="Toast">
        <Button variant="secondary" onClick={() => setToast("Reply sent to Cloudmetric.")}>
          Show a toast
        </Button>
      </Card>

      {toast && <Toast message={toast} onClose={closeToast} />}
    </div>
  );
}
