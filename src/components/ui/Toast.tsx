import { useEffect } from "react";
import "./Toast.css";

interface ToastProps {
  message: string;
  onClose: () => void;
  durationMs?: number;
}

/** A short status message in the bottom corner. Closes itself after a few seconds. */
export function Toast({ message, onClose, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [onClose, durationMs]);

  return (
    <div className="toast" role="status">
      <span>{message}</span>
      <button type="button" className="toast__close" onClick={onClose} aria-label="Close message">
        Close
      </button>
    </div>
  );
}
