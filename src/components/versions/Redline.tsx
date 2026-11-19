import type { Part } from "../../logic/redline";

/** A redline: added words underlined in green, removed words struck through in red, each also named for screen readers. */
export function Redline({ parts }: { parts: Part[] }) {
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === "added")
          return (
            <ins key={i} className="redline__added">
              <span className="visually-hidden">Added: </span>
              {p.text}
            </ins>
          );
        if (p.kind === "removed")
          return (
            <del key={i} className="redline__removed">
              <span className="visually-hidden">Removed: </span>
              {p.text}
            </del>
          );
        return <span key={i}>{p.text}</span>;
      })}
    </>
  );
}
