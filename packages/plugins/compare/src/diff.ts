import type { Panel } from "./item.js";

export const DIFF_MODES = ["words", "bytes", "lines"] as const;

export type DiffMode = (typeof DIFF_MODES)[number];

export type DiffOptions = {
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
};

export const DEFAULT_DIFF_OPTIONS: DiffOptions = {
  ignoreWhitespace: false,
  ignoreCase: false,
};

export type DiffInput = {
  original: string;
  modified: string;
  mode: DiffMode;
  options?: DiffOptions;
};

export type RowKind = "added" | "deleted" | "modified" | "unchanged";

export type Segment = { text: string; kind: RowKind };

export type Cell = { lineNumber: number; segments: Segment[] };

export type Row = { kind: RowKind } & Record<Panel, Cell | undefined>;

export type DiffSummary = Record<RowKind, number>;

export type DiffResult = {
  mode: DiffMode;
  rows: Row[];
  summary: DiffSummary;
};

const splitLines = (text: string): string[] => text.split(/\r?\n/);

const normalize = (text: string, options: DiffOptions): string => {
  let value = text;
  if (options.ignoreCase) value = value.toLowerCase();
  if (options.ignoreWhitespace) value = value.replace(/\s+/g, "");
  return value;
};

const tokenize = (text: string, mode: DiffMode): string[] => {
  if (mode === "words") return text.split(/(\s+)/).filter((t) => t.length > 0);
  if (mode === "bytes") return Array.from(text);
  return [text];
};

const lcsPairs = (
  a: string[],
  b: string[],
  key: (value: string) => string,
): Array<[number, number]> => {
  const table: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i]![j] =
        key(a[i]!) === key(b[j]!)
          ? table[i + 1]![j + 1]! + 1
          : Math.max(table[i + 1]![j]!, table[i]![j + 1]!);
    }
  }
  const pairs: Array<[number, number]> = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (key(a[i]!) === key(b[j]!)) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if (table[i + 1]![j]! >= table[i]![j + 1]!) {
      i += 1;
    } else {
      j += 1;
    }
  }
  return pairs;
};

const segmentsForPair = (
  original: string,
  modified: string,
  mode: DiffMode,
  options: DiffOptions,
): { original: Segment[]; modified: Segment[] } => {
  if (mode === "lines") {
    return {
      original: [{ text: original, kind: "deleted" }],
      modified: [{ text: modified, kind: "added" }],
    };
  }
  const aTokens = tokenize(original, mode);
  const bTokens = tokenize(modified, mode);
  const pairs = lcsPairs(aTokens, bTokens, (t) => normalize(t, options));
  const usedA = new Set(pairs.map(([i]) => i));
  const usedB = new Set(pairs.map(([, j]) => j));
  return {
    original: aTokens.map((text, i) => ({
      text,
      kind: usedA.has(i) ? "unchanged" : "deleted",
    })),
    modified: bTokens.map((text, i) => ({
      text,
      kind: usedB.has(i) ? "unchanged" : "added",
    })),
  };
};

export const compareTexts = (input: DiffInput): DiffResult => {
  const options = input.options ?? DEFAULT_DIFF_OPTIONS;
  const originalLines = splitLines(input.original);
  const modifiedLines = splitLines(input.modified);
  const pairs = lcsPairs(originalLines, modifiedLines, (line) =>
    normalize(line, options),
  );

  const rows: Row[] = [];
  let i = 0;
  let j = 0;
  let originalNumber = 1;
  let modifiedNumber = 1;

  const pushUnchanged = (indexOriginal: number, indexModified: number) => {
    const text = originalLines[indexOriginal]!;
    const segment: Segment = { text, kind: "unchanged" };
    rows.push({
      kind: "unchanged",
      original: { lineNumber: originalNumber, segments: [segment] },
      modified: { lineNumber: modifiedNumber, segments: [segment] },
    });
    originalNumber += 1;
    modifiedNumber += 1;
  };

  const pushBlock = (deleted: string[], added: string[]) => {
    const shared = Math.min(deleted.length, added.length);
    for (let k = 0; k < shared; k += 1) {
      const segments = segmentsForPair(
        deleted[k]!,
        added[k]!,
        input.mode,
        options,
      );
      rows.push({
        kind: "modified",
        original: { lineNumber: originalNumber, segments: segments.original },
        modified: { lineNumber: modifiedNumber, segments: segments.modified },
      });
      originalNumber += 1;
      modifiedNumber += 1;
    }
    for (let k = shared; k < deleted.length; k += 1) {
      rows.push({
        kind: "deleted",
        original: {
          lineNumber: originalNumber,
          segments: [{ text: deleted[k]!, kind: "deleted" }],
        },
        modified: undefined,
      });
      originalNumber += 1;
    }
    for (let k = shared; k < added.length; k += 1) {
      rows.push({
        kind: "added",
        original: undefined,
        modified: {
          lineNumber: modifiedNumber,
          segments: [{ text: added[k]!, kind: "added" }],
        },
      });
      modifiedNumber += 1;
    }
  };

  for (const [pi, pj] of pairs) {
    const deleted = originalLines.slice(i, pi);
    const added = modifiedLines.slice(j, pj);
    if (deleted.length > 0 || added.length > 0) pushBlock(deleted, added);
    pushUnchanged(pi, pj);
    i = pi + 1;
    j = pj + 1;
  }
  const deleted = originalLines.slice(i);
  const added = modifiedLines.slice(j);
  if (deleted.length > 0 || added.length > 0) pushBlock(deleted, added);

  const summary: DiffSummary = {
    added: 0,
    deleted: 0,
    modified: 0,
    unchanged: 0,
  };
  for (const row of rows) summary[row.kind] += 1;

  return { mode: input.mode, rows, summary };
};
