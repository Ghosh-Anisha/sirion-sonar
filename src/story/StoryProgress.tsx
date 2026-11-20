import { useEffect, useState } from "react";
import "./Story.css";

/** A thin bar that fills as the story is read. */
export function StoryProgress() {
  const [share, setShare] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShare(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      className="story-progress"
      role="progressbar"
      aria-label="How far through the story"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(share * 100)}
    >
      <span style={{ transform: `scaleX(${share})` }} />
    </div>
  );
}
