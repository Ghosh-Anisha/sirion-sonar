import type { TokenInfo } from "../../logic/mask";
import "./Privacy.css";

interface TokenTextProps {
  text: string;
  tokens: TokenInfo[];
  /** Show the real value in place of each token, marked so the reader can see what was restored. */
  restoreTokens?: boolean;
}

/** Text with each token marked, or with each restored value marked. */
export function TokenText({ text, tokens, restoreTokens = false }: TokenTextProps) {
  const parts = text.split(/(\[[A-Z]+_\d+\])/g);
  return (
    <p className="token-text">
      {parts.map((part, i) => {
        const info = tokens.find((t) => t.token === part);
        if (!info) return <span key={i}>{part}</span>;
        return (
          <mark key={i} className={restoreTokens ? "token token--restored" : "token"} title={restoreTokens ? info.token : info.kind.toLowerCase()}>
            {restoreTokens ? info.display : part}
          </mark>
        );
      })}
    </p>
  );
}
