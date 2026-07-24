// Defense-in-depth only: React already auto-escapes message content on every
// render path in this app (no dangerouslySetInnerHTML is used anywhere), so
// this isn't the thing preventing XSS today. It protects any future
// non-React consumer of this data (a CSV export, the moderator view, an
// email digest) that might not auto-escape.
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}
