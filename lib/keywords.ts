const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "shall",
  "can",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "we",
  "you",
  "they",
  "them",
  "their",
  "our",
  "your",
  "i",
  "me",
  "my",
  "he",
  "she",
  "his",
  "her",
  "who",
  "whom",
  "which",
  "what",
  "where",
  "when",
  "why",
  "how",
  "all",
  "each",
  "every",
  "both",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "about",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "looking",
  "experience",
  "experiences",
  "required",
  "requirements",
  "preferred",
  "including",
  "include",
  "using",
  "use",
  "used",
  "work",
  "working",
  "role",
  "position",
  "job",
  "team",
  "ability",
  "strong",
  "years",
  "year",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, ""))
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function extractJdKeywords(jobDescription: string): string[] {
  const tokens = tokenize(jobDescription).filter((t) => t.length >= 3);
  const freq = new Map<string, number>();
  for (const t of tokens) {
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 40)
    .map(([word]) => word);
}

export function analyzeKeywords(
  resumeText: string,
  jobDescription: string,
): { matched: string[]; missing: string[] } {
  const resumeTokens = new Set(tokenize(resumeText));
  const keywords = extractJdKeywords(jobDescription);
  const matched: string[] = [];
  const missing: string[] = [];
  for (const kw of keywords) {
    if (resumeTokens.has(kw)) matched.push(kw);
    else missing.push(kw);
  }
  return { matched, missing };
}
