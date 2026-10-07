export type JsonBodyPathSegment = string | number;

export function parseJsonBodyPath(
  path: string,
): readonly JsonBodyPathSegment[] {
  const normalized = path.replace(/^\$\.?/, "");
  const segments: JsonBodyPathSegment[] = [];
  for (const part of normalized.split(".")) {
    if (part.length === 0) continue;
    const match = /^([^[]+)((?:\[\d+\])*)$/.exec(part);
    if (match === null) {
      throw new Error(`Invalid JSON body path segment: ${part}`);
    }
    segments.push(match[1]!);
    for (const index of match[2]!.matchAll(/\[(\d+)\]/g)) {
      segments.push(Number.parseInt(index[1]!, 10));
    }
  }
  if (segments.length === 0) {
    throw new Error("Invalid JSON body path: empty");
  }
  return segments;
}

export function appendJsonBodyPath(
  base: string | undefined,
  segment: string | number,
): string {
  const next = base ?? "";
  if (typeof segment === "number") return `${next}[${segment}]`;
  if (next === "") return segment;
  return `${next}.${segment}`;
}

export function formatJsonBodyPath(
  segments: readonly JsonBodyPathSegment[],
): string {
  return segments
    .map((segment, index) =>
      typeof segment === "number"
        ? `[${segment}]`
        : index === 0
          ? segment
          : `.${segment}`,
    )
    .join("");
}

export function isInjectableJsonBodyPath(
  segments: readonly JsonBodyPathSegment[],
): boolean {
  return segments.length > 0;
}

export function resolveJsonBodyPath(
  body: unknown,
  segments: readonly JsonBodyPathSegment[],
): unknown {
  let current: unknown = body;
  for (const segment of segments) {
    if (current === null || typeof current !== "object") return undefined;
    if (typeof segment === "number") {
      if (!Array.isArray(current)) return undefined;
      current = current[segment];
    } else {
      current = (current as Record<string, unknown>)[segment];
    }
  }
  return current;
}
