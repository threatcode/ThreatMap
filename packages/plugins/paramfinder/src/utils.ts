const SAMPLE_BODY_LENGTH = 64 * 1024;

export const randomString = (
  length: number,
  random: () => number = Math.random,
): string => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(random() * alphabet.length)]!;
  }
  return out;
};

export const sampleBody = (body: string): string =>
  body.length > SAMPLE_BODY_LENGTH ? body.slice(0, SAMPLE_BODY_LENGTH) : body;

export const splitLines = (text: string): string[] =>
  text.replace(/\r\n/g, "\n").split("\n");

export const countOccurrences = (haystack: string, needle: string): number => {
  if (needle.length === 0) return 0;
  let count = 0;
  let index = 0;
  while ((index = haystack.indexOf(needle, index)) !== -1) {
    count += 1;
    index += needle.length;
  }
  return count;
};

export const buildFragmentCounts = (text: string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (let i = 0; i < text.length; i += 1) {
    const fragment = text.slice(i, i + 4);
    counts.set(fragment, (counts.get(fragment) ?? 0) + 1);
  }
  return counts;
};

export const similarityFromFragmentCounts = (
  referenceCounts: Map<string, number>,
  referenceLength: number,
  candidate: string,
): number => {
  if (referenceLength === 0 && candidate.length === 0) return 1;
  const candidateCounts = buildFragmentCounts(candidate.toLowerCase());
  let overlap = 0;
  for (const [fragment, count] of candidateCounts) {
    overlap += Math.min(count, referenceCounts.get(fragment) ?? 0);
  }
  const total = Math.max(referenceLength, candidate.length);
  return total === 0 ? 1 : overlap / total;
};

export const getFirstHeaderValue = (
  headers: Record<string, string[]>,
  name: string,
): string | undefined => {
  const values = headers[normalizeHeaderName(name)] ?? headers[name];
  return values?.[0];
};

export const hasHeader = (
  headers: Record<string, string[]>,
  name: string,
): boolean => getFirstHeaderValue(headers, name) !== undefined;

export const getHeaderValues = (
  headers: Record<string, string[]>,
  name: string,
): string[] => headers[normalizeHeaderName(name)] ?? headers[name] ?? [];

export const headerValuesEqual = (
  a: string[] | undefined,
  b: string[] | undefined,
): boolean =>
  a !== undefined &&
  b !== undefined &&
  a.length === b.length &&
  a.every((value, index) => value === b[index]);

export const normalizeHeaderName = (name: string): string => name.toLowerCase();
