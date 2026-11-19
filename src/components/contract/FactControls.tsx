import { useState } from "react";
import type { Fact } from "../../data/types";
import { parseFactInput } from "../../logic/edits";
import { fieldInputType, fieldLabel } from "../../logic/factFormat";
import { Button } from "../ui/Button";

interface FactControlsProps {
  fact: Fact;
  onConfirm: () => void;
  onCorrect: (value: string | number) => void;
}

/** Confirm a fact as read, or type in the right value. A fact with no value can only be corrected. */
export function FactControls({ fact, onConfirm, onCorrect }: FactControlsProps) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState(fact.value === null ? "" : String(fact.value));
  const [error, setError] = useState<string | null>(null);
  const name = fieldLabel(fact.field).toLowerCase();

  if (editing) {
    const save = () => {
      const parsed = parseFactInput(fact.field, raw);
      if (!parsed.ok) return setError(parsed.error);
      setEditing(false);
      setError(null);
      onCorrect(parsed.value);
    };
    return (
      <form
        className="fact-controls__form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label>
          <span className="visually-hidden">Correct {name}</span>
          <input
            type={fieldInputType(fact.field)}
            step="any"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            aria-invalid={error !== null}
            aria-describedby={error ? `error-${fact.field}` : undefined}
            autoFocus
          />
        </label>
        <Button type="submit" variant="primary">
          Save
        </Button>
        <Button variant="quiet" onClick={() => setEditing(false)}>
          Cancel
        </Button>
        {error && (
          <p id={`error-${fact.field}`} className="fact-controls__error" role="alert">
            {error}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="row">
      {fact.label !== "confirmed" && fact.value !== null && (
        <Button variant="secondary" onClick={onConfirm} aria-label={`Confirm ${name}`}>
          Confirm
        </Button>
      )}
      <Button variant="quiet" onClick={() => setEditing(true)} aria-label={`Correct ${name}`}>
        Correct
      </Button>
    </div>
  );
}
