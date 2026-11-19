import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { thinkingNote } from "../../data/thinking";
import { doerLabel, stepsLabel } from "../../logic/thinkingText";
import { useThinking } from "../../state/ThinkingContext";
import "./Thinking.css";

/** The side drawer for one part of the screen: its step, who does it, what goes in and out, and what a model sees. */
export function UnderTheHood() {
  const { open, close } = useThinking();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const note = open ? thinkingNote(open) : null;
  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="drawer-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {note && (
        <div className="drawer__body">
          <header className="drawer__head">
            <div>
              <p className="label">Under the hood</p>
              <h2 id="drawer-title">{note.title}</h2>
            </div>
            <button type="button" className="drawer__close" onClick={close} aria-label="Close Under the hood">
              Close
            </button>
          </header>

          <dl className="drawer__list">
            <dt className="label">Pipeline step</dt>
            <dd>
              {stepsLabel(note.steps)} of 8. <Link to="/architecture" onClick={close}>See the pipeline</Link>
            </dd>

            <dt className="label">Who does it</dt>
            <dd>
              <ul className="drawer__doers">
                {note.doers.map((d) => (
                  <li key={doerLabel(d)}>{doerLabel(d)}</li>
                ))}
              </ul>
              <p>{note.why}</p>
            </dd>

            <dt className="label">Goes in</dt>
            <dd>{note.input}</dd>
            <dt className="label">Comes out</dt>
            <dd>{note.output}</dd>

            <dt className="label">Tables</dt>
            <dd>
              <p>Reads: {note.reads.length ? <TableNames names={note.reads} /> : "none"}</p>
              <p>Writes: {note.writes.length ? <TableNames names={note.writes} /> : "none"}</p>
            </dd>

            <dt className="label">What the model sees</dt>
            <dd>{note.modelSees ?? "No model takes part in this."}</dd>
            <dt className="label">What it never sees</dt>
            <dd>{note.neverSees}</dd>

            <dt className="label">Confidence label</dt>
            <dd>{note.label ? `${note.label.which} ${note.label.how}` : "No label is involved here."}</dd>
          </dl>
        </div>
      )}
    </dialog>
  );
}

function TableNames({ names }: { names: string[] }) {
  return (
    <>
      {names.map((n, i) => (
        <span key={n}>
          {i > 0 && ", "}
          <code className="drawer__table">{n}</code>
        </span>
      ))}
    </>
  );
}
