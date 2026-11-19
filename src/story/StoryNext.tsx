import type { NextLink } from "../data/story";
import { ButtonLink } from "../components/ui/ButtonLink";
import "./Story.css";

/** The end of every story page: one line on why it matters, and a big button into the next page. */
export function StoryNext({ soWhat, next }: { soWhat: string; next: NextLink }) {
  return (
    <footer className="story-next" data-tour="story-next">
      <p className="story-next__so-what">
        <span className="story-kicker">So what</span>
        {soWhat}
      </p>
      <ButtonLink to={next.to} variant="primary" className="button--big story-next__button">
        {next.label}
      </ButtonLink>
    </footer>
  );
}
