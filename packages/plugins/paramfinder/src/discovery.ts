import type {
  Anomaly,
  AttackType,
  Parameter,
  ParameterValueType,
} from "./types.js";
import { AnomalyType } from "./types.js";
import { randomString } from "./utils.js";

export const DEFAULT_HEADER_CHUNK_SIZE = 20;
const DEFAULT_QUERY_CHUNK_BYTES = 2048;
const PARAMETER_VALUE_LENGTH = 8;

export type NextChunkInput = {
  words: string[];
  startIndex: number;
  attackType: AttackType;
  maxSize?: number;
  customValue?: string;
  customValueType?: ParameterValueType;
  random?: () => number;
};

export type NextChunkResult = {
  parameters: Parameter[];
  nextIndex: number;
};

export function getNextChunk(input: NextChunkInput): NextChunkResult {
  const random = input.random ?? Math.random;
  switch (input.attackType) {
    case "headers":
      return chunkHeaders(input, random);
    case "query":
      return chunkQuery(input, random);
    case "body":
      return chunkBody(input, random);
  }
}

const buildParameters = (names: string[], value: string): Parameter[] =>
  names.map((name) => ({ name, value }));

function chunkHeaders(
  input: NextChunkInput,
  random: () => number,
): NextChunkResult {
  const value = createParameterValue(
    input.customValue,
    input.customValueType,
    random,
  );
  const slice = input.words.slice(
    input.startIndex,
    input.startIndex + DEFAULT_HEADER_CHUNK_SIZE,
  );
  return {
    parameters: buildParameters(slice, value),
    nextIndex: input.startIndex + slice.length,
  };
}

function chunkQuery(
  input: NextChunkInput,
  random: () => number,
): NextChunkResult {
  const budget = input.maxSize ?? DEFAULT_QUERY_CHUNK_BYTES;
  const parameters: Parameter[] = [];
  let used = 0;
  let index = input.startIndex;
  while (index < input.words.length) {
    const value = createParameterValue(
      input.customValue,
      input.customValueType,
      random,
    );
    const entry = `${input.words[index]}=${encodeURIComponent(value)}&`;
    if (used + entry.length > budget && parameters.length > 0) break;
    parameters.push({ name: input.words[index]!, value });
    used += entry.length;
    index += 1;
  }
  return { parameters, nextIndex: index };
}

function chunkBody(
  input: NextChunkInput,
  random: () => number,
): NextChunkResult {
  const budget = input.maxSize ?? DEFAULT_QUERY_CHUNK_BYTES;
  const parameters: Parameter[] = [];
  let used = 0;
  let index = input.startIndex;
  while (index < input.words.length) {
    const value = createParameterValue(
      input.customValue,
      input.customValueType,
      random,
    );
    const entry = `${input.words[index]}=${encodeURIComponent(value)}&`;
    if (used + entry.length > budget && parameters.length > 0) break;
    parameters.push({ name: input.words[index]!, value });
    used += entry.length;
    index += 1;
  }
  return { parameters, nextIndex: index };
}

export function splitChunk(
  parameters: Parameter[],
): [Parameter[], Parameter[]] {
  const middle = Math.floor(parameters.length / 2);
  return [parameters.slice(0, middle), parameters.slice(middle)];
}

export function createParameterValue(
  customValue: string | undefined,
  customValueType: ParameterValueType | undefined,
  random: () => number = Math.random,
): string {
  if (customValueType === "integer") {
    return String(Math.floor(random() * 10_000_000) + 1);
  }
  const suffix = randomString(PARAMETER_VALUE_LENGTH, random);
  return customValue !== undefined ? `${customValue}${suffix}` : suffix;
}

export function describeAnomalyReason(anomaly: Anomaly): string {
  switch (anomaly.type) {
    case AnomalyType.Body:
      return "response body changed";
    case AnomalyType.Headers:
      return "response headers changed";
    case AnomalyType.StatusCode:
      return "status code changed";
    case AnomalyType.Redirect:
      return "redirect target changed";
    case AnomalyType.ReflectionCount:
      return "parameter reflection count changed";
    case AnomalyType.Similarity:
      return "response similarity dropped";
  }
}
