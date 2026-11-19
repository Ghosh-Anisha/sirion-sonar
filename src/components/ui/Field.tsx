import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge, type ConfidenceLabel } from "./Badge";
import "./Field.css";

interface FieldProps {
  label: string;
  value: ReactNode;
  confidence?: ConfidenceLabel;
  source?: { text: string; to: string };
}

export function Field({ label, value, confidence, source }: FieldProps) {
  return (
    <div className="field">
      <div className="field__head">
        <span className="label">{label}</span>
        {confidence && <Badge kind={confidence} />}
      </div>
      <div className="field__value num">{value}</div>
      {source && (
        <Link className="field__source" to={source.to}>
          {source.text}
        </Link>
      )}
    </div>
  );
}
