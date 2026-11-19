import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";

interface PlaceholderProps {
  title: string;
  children?: ReactNode;
}

/** Stands in for a screen that is built in a later step. */
export function Placeholder({ title, children }: PlaceholderProps) {
  const { id } = useParams();
  return (
    <div className="stack">
      <h1>{title}</h1>
      {id && <p className="muted">Record {id}</p>}
      <EmptyState title="Nothing here yet" body="This screen is built in a later step." action={children} />
    </div>
  );
}
