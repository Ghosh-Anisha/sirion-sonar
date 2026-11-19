import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  /** A data-tour name, for the guided tour. */
  tour?: string;
}

export function Card({ title, actions, children, tour }: CardProps) {
  return (
    <section className="card" data-tour={tour}>
      {(title || actions) && (
        <header className="card__header">
          {title && <h2>{title}</h2>}
          {actions && <div className="row">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
