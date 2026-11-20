import { useState } from "react";
import { people } from "../../data/people";
import { afterIntake } from "../../data/architecture";
import { askSirion, type QuestionId } from "../../logic/askSirion";
import { ledgerRows } from "../../logic/ledger";
import { useLedger } from "../../state/useLedger";
import "./Sections.css";

/** A mini AskSirion: three example questions, each answered by code from the sample ledger. Marked illustrative. */
export function AskPanel() {
  const { contracts, vendors, paid, today, items } = useLedger();
  const [asked, setAsked] = useState<QuestionId>("april");
  const answer = askSirion(asked, ledgerRows(contracts, vendors, people, paid, today), items, vendors, today);
  const question = afterIntake.questions.find((q) => q.id === asked)!;

  return (
    <div className="ask" data-tour="solution-ask">
      <p className="ask__title">{afterIntake.askTitle}</p>
      <div className="ask__questions" role="group" aria-label="Example questions">
        {afterIntake.questions.map((q) => (
          <button key={q.id} type="button" className={`chip${q.id === asked ? " chip--on" : ""}`} aria-pressed={q.id === asked} onClick={() => setAsked(q.id as QuestionId)}>
            {q.text}
          </button>
        ))}
      </div>
      <div className="ask__answer" aria-live="polite">
        <p className="ask__q">{question.text}</p>
        <div className="table-wrap">
          <table className="table">
            <caption className="visually-hidden">{question.text}</caption>
            <thead>
              <tr>
                {answer.columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {answer.rows.length === 0 ? (
                <tr>
                  <td colSpan={answer.columns.length}>None on the ledger today.</td>
                </tr>
              ) : (
                answer.rows.map((r) => (
                  <tr key={r.join("|")}>
                    {r.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="ask__note">{afterIntake.askNote}</p>
      </div>
    </div>
  );
}
