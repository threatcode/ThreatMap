import type { Anomaly, EngineResponse, Parameter } from "./types.js";
import { AnomalyType } from "./types.js";
import {
  buildFragmentCounts,
  countOccurrences,
  getFirstHeaderValue,
  getHeaderValues,
  normalizeHeaderName,
  sampleBody,
  similarityFromFragmentCounts,
} from "./utils.js";

export type AnomalyOptions = {
  similarityThreshold?: number;
  bodyLengthDeltaRatio?: number;
  parameterValue?: string;
};

const DEFAULT_SIMILARITY_THRESHOLD = 0.9;
const DEFAULT_BODY_LENGTH_DELTA_RATIO = 0.2;

export function similarity(a: EngineResponse, bBody: string): number {
  if (a.body === bBody) return 1;
  const reference = sampleBody(a.body).toLowerCase();
  return similarityFromFragmentCounts(
    buildFragmentCounts(reference),
    reference.length,
    sampleBody(bBody),
  );
}

export function detectAnomalies(
  reference: EngineResponse,
  response: EngineResponse,
  options: AnomalyOptions = {},
): Anomaly[] {
  const anomalies: Anomaly[] = [];

  if (response.status !== reference.status) {
    anomalies.push({
      type: AnomalyType.StatusCode,
      from: reference.status,
      to: response.status,
    });
  }

  const referenceLocation = getFirstHeaderValue(reference.headers, "location");
  const responseLocation = getFirstHeaderValue(response.headers, "location");
  if (referenceLocation !== responseLocation) {
    anomalies.push({
      type: AnomalyType.Redirect,
      from: referenceLocation,
      to: responseLocation,
    });
  }

  if (options.parameterValue !== undefined) {
    const from = countOccurrences(reference.body, options.parameterValue);
    const to = countOccurrences(response.body, options.parameterValue);
    if (from !== to) {
      anomalies.push({
        type: AnomalyType.ReflectionCount,
        parameterName: "unknown",
        from,
        to,
      });
    }
  }

  const headerNames = new Set([
    ...Object.keys(reference.headers).map(normalizeHeaderName),
    ...Object.keys(response.headers).map(normalizeHeaderName),
  ]);
  for (const name of headerNames) {
    const from = getHeaderValues(reference.headers, name);
    const to = getHeaderValues(response.headers, name);
    if (from.join("\n") !== to.join("\n")) {
      anomalies.push({
        type: AnomalyType.Headers,
        headerName: name,
        from: from.length > 0 ? from : undefined,
        to: to.length > 0 ? to : undefined,
      });
    }
  }

  const lengthDeltaRatio =
    reference.body.length === 0
      ? response.body.length > 0
        ? 1
        : 0
      : Math.abs(response.body.length - reference.body.length) /
        reference.body.length;
  if (
    lengthDeltaRatio >
    (options.bodyLengthDeltaRatio ?? DEFAULT_BODY_LENGTH_DELTA_RATIO)
  ) {
    anomalies.push({
      type: AnomalyType.Body,
      check: "length",
      from: reference.body.length,
      to: response.body.length,
    });
  }

  const score = similarity(reference, response.body);
  const threshold = options.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;
  if (score < threshold) {
    anomalies.push({
      type: AnomalyType.Similarity,
      similarity: score,
      threshold,
    });
  }

  return anomalies;
}

export function detectReflectionAnomaly(
  reference: EngineResponse,
  parameter: Parameter,
  response: EngineResponse,
): Anomaly | undefined {
  const from = countOccurrences(reference.body, parameter.value);
  const to = countOccurrences(response.body, parameter.value);
  if (from === to) return undefined;
  return {
    type: AnomalyType.ReflectionCount,
    parameterName: parameter.name,
    from,
    to,
  };
}
