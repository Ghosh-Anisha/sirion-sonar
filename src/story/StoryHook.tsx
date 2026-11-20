import { hook } from "../data/story";
import { Button } from "../components/ui/Button";
import { scrollToSection } from "./scrollToSection";
import "./Story.css";

/** The opening: one large sentence and a button that scrolls into the brief. */
export function StoryHook() {
  const start = () => scrollToSection("brief");
  return (
    <section className="story-hook" aria-labelledby="hook-title" data-tour="story-hook">
      <h1 id="hook-title" className="story-headline story-headline--hook">
        {hook.headline}
      </h1>
      <p className="story-lead">{hook.subline}</p>
      <Button variant="primary" className="button--big" onClick={start}>
        {hook.start}
      </Button>
    </section>
  );
}
