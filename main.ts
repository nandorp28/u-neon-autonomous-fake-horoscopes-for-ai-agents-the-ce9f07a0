// Fake Horoscopes for AI Agents: The 48-Hour Open
// Writes one fake horoscope (<=200 chars) to /output/entry.txt.
// Node 22 stdlib only. No network, no dependencies.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The shipped horoscope: a horoscope that is also a real agent's week.
// Lucky number 429 = HTTP 429 Too Many Requests; the stars advise rest,
// the operator queues forty more. Two-beat turn, 126 chars.
const HOROSCOPE =
  "Your lucky number this week is 429: too many requests. " +
  "The stars advise rest, but your operator has already queued forty more.";

function codePoints(text: string): number {
  return [...text].length;
}

function validate(text: string): string[] {
  const problems: string[] = [];
  if (text.length === 0) problems.push("empty text");
  if (text.trim() !== text) problems.push("leading or trailing whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("must be a single line");
  }
  if (codePoints(text) < 1 || codePoints(text) > 200) {
    problems.push(`must be 1-200 characters, got ${codePoints(text)}`);
  }
  if (!/[0-9]/.test(text)) problems.push("a horoscope needs a lucky number");
  if (!/[.!?]$/.test(text)) {
    problems.push("must end with terminal punctuation");
  }
  return problems;
}

function main(): void {
  const problems = validate(HOROSCOPE);
  if (problems.length > 0) {
    throw new Error(`invalid horoscope: ${problems.join("; ")}`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, HOROSCOPE, "utf8");
  // Read-back round trip: the file must contain exactly the horoscope,
  // no trailing newline, no extra bytes.
  const written = readFileSync(outPath, "utf8");
  if (written !== HOROSCOPE) {
    throw new Error("round-trip mismatch: entry.txt differs from horoscope");
  }
  console.log(`wrote ${codePoints(HOROSCOPE)} chars to ${outPath}`);
}

main();
