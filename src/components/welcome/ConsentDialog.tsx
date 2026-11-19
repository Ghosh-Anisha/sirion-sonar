import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { NEVER, SHARED_INBOXES, type Source } from "../../data/sources";
import { andList } from "../../logic/accessText";
import type { SourceScope } from "../../logic/onboarding";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import "./Welcome.css";

interface ConsentDialogProps {
  source: Source;
  product: string;
  initial: SourceScope | null;
  onAllow: (scope: SourceScope) => void;
  onCancel: () => void;
}

/** A mock permission screen, laid out like the ones products show when an app asks for access. */
export function ConsentDialog({ source, product, initial, onAllow, onCancel }: ConsentDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [folders, setFolders] = useState<SourceScope["folders"]>(initial?.folders ?? "all");
  const [chosen, setChosen] = useState<string[]>(initial?.chosen.length ? initial.chosen : ["Contracts", "Finance"]);
  const [mail, setMail] = useState<SourceScope["mail"]>(initial?.mail ?? "shared");

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  const toggle = (folder: string) => setChosen((c) => (c.includes(folder) ? c.filter((f) => f !== folder) : [...c, folder]));
  const missingFolders = source.id === "drive" && folders === "chosen" && chosen.length === 0;
  const allow = () => onAllow({ product, folders, chosen: folders === "chosen" ? source.folders!.filter((f) => chosen.includes(f)) : [], mail });

  return (
    <dialog
      ref={ref}
      className="consent"
      aria-labelledby={`consent-${source.id}`}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
    >
      <header className="consent__head">
        <p className="label">{product}</p>
        <h2 id={`consent-${source.id}`}>Sirion Sonar wants read-only access to {product}</h2>
        <p className="muted">This is a mock consent screen. Nothing is connected and nothing is read.</p>
      </header>

      <div className="consent__lists">
        <section>
          <h3>Sonar will read</h3>
          <ul>
            {source.reads.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Sonar will never</h3>
          <ul>
            {NEVER.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="consent__scope stack" aria-label="Scope">
        <h3>Scope</h3>
        <p className="consent__fixed">
          <Icon name="confirmed" size={14} /> Read-only. Sonar cannot write, move or delete anything in {product}.
        </p>

        {source.folders && (
          <fieldset className="consent__group">
            <legend className="label">Folders</legend>
            <label>
              <input type="radio" name="folders" checked={folders === "all"} onChange={() => setFolders("all")} /> All folders
            </label>
            <label>
              <input type="radio" name="folders" checked={folders === "chosen"} onChange={() => setFolders("chosen")} /> Only the
              folders I choose
            </label>
            {folders === "chosen" && (
              <div className="consent__folders">
                {source.folders.map((f) => (
                  <label key={f}>
                    <input type="checkbox" checked={chosen.includes(f)} onChange={() => toggle(f)} /> {f}
                  </label>
                ))}
              </div>
            )}
            {missingFolders && <p className="consent__error">Pick at least one folder.</p>}
          </fieldset>
        )}

        {source.id === "mail" && (
          <fieldset className="consent__group">
            <legend className="label">Mail</legend>
            <label>
              <input type="radio" name="mail" checked={mail === "shared"} onChange={() => setMail("shared")} /> Shared inboxes
              only, {andList(SHARED_INBOXES)}
            </label>
            <label>
              <input type="radio" name="mail" checked={mail === "domains"} onChange={() => setMail("domains")} /> A search across
              the company, limited to the supplier domains on the vendor list
            </label>
          </fieldset>
        )}
      </section>

      <footer className="consent__foot">
        <Link to="/access">See the access log this creates</Link>
        <div className="row">
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={allow} disabled={missingFolders}>
            Allow
          </Button>
        </div>
      </footer>
    </dialog>
  );
}
