import "./Story.css";

/** A story section's kicker, one-sentence headline and short lead. */
export function SectionHead({ id, kicker, headline, lead }: { id: string; kicker: string; headline: string; lead?: string }) {
  return (
    <header className="section-head">
      <p className="story-kicker">{kicker}</p>
      <h2 id={id} className="story-headline story-headline--section">
        {headline}
      </h2>
      {lead && <p className="story-lead">{lead}</p>}
    </header>
  );
}
