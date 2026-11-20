/*
 * The original brief, if public/brief.pdf is in the project. The glob finds nothing when the file
 * is absent, so the page then leaves the link out rather than showing a broken one.
 */
const found = Object.keys(import.meta.glob("/public/brief.pdf"));

export const BRIEF_PDF: string | null = found.length > 0 ? "brief.pdf" : null;
