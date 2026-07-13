// Basic substring blocklist — enough to keep a family cookout wall clean without
// pulling in a dependency. Add more words as needed; keep them lowercase.
const BLOCKLIST = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "cunt",
  "dick",
  "piss",
  "nigger",
  "faggot",
  "retard",
  "whore",
  "slut",
];

export function containsBlockedWord(text: string): boolean {
  const normalized = text.toLowerCase();
  return BLOCKLIST.some((word) => normalized.includes(word));
}
