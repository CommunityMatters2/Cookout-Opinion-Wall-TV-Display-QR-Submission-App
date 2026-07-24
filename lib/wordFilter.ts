// Substring blocklist with normalization against common evasion patterns
// (spacing/punctuation between letters, leetspeak substitutions, repeated
// characters) — enough to keep a family cookout wall clean without pulling
// in a dependency. Add more words as needed; keep them lowercase.
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

const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "8": "b",
  "@": "a",
  "$": "s",
};

const LEET_PATTERN = new RegExp(
  Object.keys(LEET_MAP)
    .map((ch) => ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "g"
);

// Unicode combining-diacritical-marks block (U+0300 to U+036F).
const COMBINING_MARKS_PATTERN = /[\u0300-\u036f]/g;

function collapseRepeats(text: string): string {
  return text.replace(/([a-z])\1+/g, "$1");
}

// Lowercases, strips diacritics, undoes leetspeak substitutions, drops every
// non-letter character (so "f.u.c.k" / "f_u_c_k" / "f u c k" all collapse to
// "fuck"), then collapses runs of the same letter (so "fuuuuck" also matches).
function normalizeForFilter(text: string): string {
  const lowered = text.toLowerCase().normalize("NFKD").replace(COMBINING_MARKS_PATTERN, "");
  const deLeeted = lowered.replace(LEET_PATTERN, (ch) => LEET_MAP[ch] ?? ch);
  const lettersOnly = deLeeted.replace(/[^a-z]/g, "");
  return collapseRepeats(lettersOnly);
}

const NORMALIZED_BLOCKLIST = BLOCKLIST.map((word) => collapseRepeats(word));

export function containsBlockedWord(text: string): boolean {
  const normalized = normalizeForFilter(text);
  return NORMALIZED_BLOCKLIST.some((word) => normalized.includes(word));
}
