import { useRef, type KeyboardEvent } from "react";
import "./Tabs.css";

export interface TabSpec {
  id: string;
  label: string;
}

interface TabsProps {
  label: string;
  tabs: TabSpec[];
  selected: string;
  onSelect: (id: string) => void;
}

/** A row of tabs. Arrow keys move between them. Each panel uses id `panel-{id}` and is labelled by `tab-{id}`. */
export function Tabs({ label, tabs, selected, onSelect }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + tabs.length) % tabs.length;
    onSelect(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`tab-${t.id}`}
          aria-selected={t.id === selected}
          aria-controls={`panel-${t.id}`}
          tabIndex={t.id === selected ? 0 : -1}
          className="tabs__tab"
          onClick={() => onSelect(t.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
