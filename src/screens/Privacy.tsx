import { Link } from "react-router-dom";
import { contracts } from "../data/contracts";
import { people } from "../data/people";
import { modelReply, privacyDocument } from "../data/privacySample";
import { vendors } from "../data/vendors";
import { TokenText } from "../components/privacy/TokenText";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { contractDates } from "../logic/dates";
import { buildDictionary } from "../logic/dictionary";
import { formatFactValue } from "../logic/factFormat";
import { findFact } from "../logic/facts";
import { formatDate } from "../logic/format";
import { leakCheck, mask } from "../logic/mask";
import { useClock } from "../state/ClockContext";
import "../components/privacy/Privacy.css";

const dictionary = buildDictionary(vendors, people, privacyDocument.recognisedNames);
const masked = mask(privacyDocument.text, dictionary);
const leaks = leakCheck(masked.text, dictionary);
const contract = contracts.find((c) => c.id === privacyDocument.contractId)!;

export function Privacy() {
  const { today } = useClock();
  const dates = contractDates(contract.facts, today);
  const fee = findFact(contract.facts, "annualFee");

  return (
    <div className="stack" style={{ gap: "var(--space-6)" }}>
      <header className="stack" style={{ gap: "var(--space-1)" }}>
        <h1>Privacy</h1>
        <p className="muted">
          Files are read inside our own cloud. Before any text goes to the language model, names, people, contact details
          and bank details are swapped for tokens. The real values go back in only after the reply comes back.
        </p>
      </header>

      <p className="privacy-sample" role="note">
        This is a sample, not a live model call. The masking and the leak check below really run on this text in your
        browser. The model's reply is precomputed, and nothing is sent anywhere.
      </p>

      <div className="panes">
        <section className="pane" aria-labelledby="pane-original" data-tour="privacy-original">
          <p className="pane__step">1. In our cloud</p>
          <h2 id="pane-original">The original text</h2>
          <p className="label" style={{ textTransform: "none", letterSpacing: 0 }}>
            {privacyDocument.fileName}
          </p>
          <p className="token-text">{privacyDocument.text}</p>
        </section>

        <section className="pane" aria-labelledby="pane-masked" data-tour="privacy-masked">
          <p className="pane__step">2. What the model would see</p>
          <h2 id="pane-masked">The masked text</h2>
          <TokenText text={masked.text} tokens={masked.tokens} />
          <p className={`leak-check ${leaks.length === 0 ? "leak-check--pass" : "leak-check--fail"}`} role="status">
            {leaks.length === 0
              ? `Leak check passed. None of the ${dictionary.length} known names, and no email, phone or account number, is left.`
              : `Leak check failed: ${leaks.join(", ")}. This text would not be sent.`}
          </p>
          <h3>The model's reply</h3>
          <p className="muted">Tokens only, plus the exact sentence it relied on.</p>
          <TokenText text={modelReply} tokens={masked.tokens} />
        </section>

        <section className="pane" aria-labelledby="pane-restored" data-tour="privacy-restored">
          <p className="pane__step">3. Back in our cloud</p>
          <h2 id="pane-restored">The restored result</h2>
          <TokenText text={modelReply} tokens={masked.tokens} restoreTokens />
          <p className="muted">Real values go back in from a separate vault that never leaves our cloud.</p>
        </section>
      </div>

      <Card tour="privacy-computed" title="Dates and amounts are computed in code">
        <p className="muted" style={{ marginBottom: "var(--space-4)" }}>
          The model never supplies a date or an amount. It returns the sentence, and code works the numbers out from the
          facts. For this contract, today:
        </p>
        <div className="computed">
          <Field label="Current term ends" value={dates.endDate ? formatDate(dates.endDate) : "Not known"} confidence={dates.label} />
          <Field label="Last day to give notice" value={dates.noticeDeadline ? formatDate(dates.noticeDeadline) : "Not known"} confidence={dates.label} />
          {fee && <Field label="Yearly fee" value={formatFactValue(fee)} confidence={fee.label} />}
        </div>
        <p style={{ marginTop: "var(--space-4)" }}>
          <Link to={`/contract/${contract.id}`}>See every fact and its sentence on the contract</Link>
        </p>
      </Card>
    </div>
  );
}
