import { COMPANY_NAME } from "../../data/drafts";
import "./Welcome.css";

/** Step 1: what Sonar does, in three lines, and what this demo is. */
export function StepWelcome() {
  return (
    <div className="stack">
      <ol className="welcome-lines">
        <li>
          <strong>It finds your supplier contracts.</strong> It starts from who the company pays, then looks for each
          supplier's files in the drive and mail.
        </li>
        <li>
          <strong>It reads them.</strong> Every date and price comes with the sentence it was taken from.
        </li>
        <li>
          <strong>It tells the right person when something needs them.</strong> A notice deadline getting close, an invoice
          above the agreed rate, a supplier paid with no contract.
        </li>
      </ol>
      <p className="wizard-note" role="note">
        This is a sample company, {COMPANY_NAME}, with sample data. Nothing is really connected, and nothing you do here
        leaves your browser.
      </p>
    </div>
  );
}
