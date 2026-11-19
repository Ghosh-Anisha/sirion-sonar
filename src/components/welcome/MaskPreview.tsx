import { Link } from "react-router-dom";
import { people } from "../../data/people";
import { privacyDocument } from "../../data/privacySample";
import { vendors } from "../../data/vendors";
import { buildDictionary } from "../../logic/dictionary";
import { mask } from "../../logic/mask";
import { TokenText } from "../privacy/TokenText";
import "./Welcome.css";

/** The notice clause, the one with names, an email and a phone number in it. */
const PARAGRAPH = 2;
const masked = mask(privacyDocument.text, buildDictionary(vendors, people, privacyDocument.recognisedNames));
const original = privacyDocument.text.split("\n\n")[PARAGRAPH];
const maskedText = masked.text.split("\n\n")[PARAGRAPH];

/** One clause of one document, masked before the model sees it and restored after. */
export function MaskPreview() {
  return (
    <div className="mask-preview">
      <p className="mask-preview__file">
        <span className="label">One document on its way to the model</span> {privacyDocument.fileName}
      </p>
      <div className="mask-preview__panes">
        <div>
          <p className="label">In our cloud</p>
          <p className="token-text">{original}</p>
        </div>
        <div>
          <p className="label">What the model sees</p>
          <TokenText text={maskedText} tokens={masked.tokens} />
        </div>
        <div>
          <p className="label">Restored in our cloud</p>
          <TokenText text={maskedText} tokens={masked.tokens} restoreTokens />
        </div>
      </div>
      <Link to="/privacy">See the whole document on the Privacy screen</Link>
    </div>
  );
}
