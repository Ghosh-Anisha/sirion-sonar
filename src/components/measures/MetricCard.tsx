import type { Metric } from "../../logic/measures";
import "./Measures.css";

const STATUS_TEXT: Record<Metric["status"], string> = {
  "on-track": "Meets the target",
  "off-track": "Short of the target",
  "no-target": "No target",
  "no-data": "Nothing to measure yet",
};

/** The scale a bar is drawn on: percentages to 100, days to three times the target. */
function scaleMax(m: Metric): number | null {
  if (m.unit === "percent") return 100;
  if (m.unit === "days" && m.target !== null) return m.target * 3;
  return null;
}

function display(m: Metric): string {
  if (m.value === null) return "None yet";
  if (m.unit === "percent") return `${m.value}%`;
  if (m.unit === "days") return `${m.value} ${m.value === 1 ? "day" : "days"}`;
  return String(m.value);
}

/** One supporting metric: the value, a bar with the target as a faint marker, and what it means. */
export function MetricCard({ metric }: { metric: Metric }) {
  const max = scaleMax(metric);
  const fill = max !== null && metric.value !== null ? Math.min(100, (metric.value / max) * 100) : 0;
  const marker = max !== null && metric.target !== null ? (metric.target / max) * 100 : null;

  return (
    <section className="metric" aria-labelledby={`metric-${metric.id}`}>
      <h3 id={`metric-${metric.id}`}>{metric.title}</h3>
      <p className="metric__question">{metric.question}</p>
      <p className="metric__value num">{display(metric)}</p>
      {max !== null && (
        <div className="metric__bar" aria-hidden="true">
          <span className="metric__fill" style={{ width: `${fill}%` }} />
          {marker !== null && <span className="metric__target" style={{ left: `${marker}%` }} />}
        </div>
      )}
      <p className="metric__detail">{metric.detail}</p>
      <p className="metric__target-text">
        Target: {metric.targetText}.{" "}
        <span className={`metric__status metric__status--${metric.status}`}>{STATUS_TEXT[metric.status]}.</span>
      </p>
    </section>
  );
}
