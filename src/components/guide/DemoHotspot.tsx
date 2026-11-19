import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Guide.css";

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 6;

/**
 * A pulsing ring and a label on the one thing to press, such as "Click Renegotiate".
 * It never blocks the click. Inside a dialog it is drawn in the dialog, which sits above everything else.
 */
export function DemoHotspot({ target, label }: { target: HTMLElement; label: string }) {
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    const place = () => {
      const r = target.getBoundingClientRect();
      setBox(r.width > 0 ? { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 } : null);
    };
    place();
    const timer = window.setInterval(place, 200);
    window.addEventListener("scroll", place, true);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", place, true);
    };
  }, [target]);

  if (!box) return null;
  const below = box.top < 80;
  return createPortal(
    <span className="hotspot" aria-hidden="true" style={box}>
      <span className="hotspot__dot" />
      <span className={`hotspot__label${below ? " hotspot__label--below" : ""}`}>{label}</span>
    </span>,
    target.closest("dialog") ?? document.body,
  );
}
