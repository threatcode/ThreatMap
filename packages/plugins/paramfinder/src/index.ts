import type { DefinePluginPackageSpec } from "@threatmap/sdk-shared";

import type { API } from "./api.js";
import type { DiscoveryEvent } from "./events.js";

export { type Result, ok, err } from "./result.js";

export {
  ATTACK_TYPES,
  REQUEST_CONTEXTS,
  INSPECTABLE_BODY_KINDS,
  MUTABLE_BODY_KINDS,
  PARAMETER_VALUE_TYPES,
  AttackType,
  type AttackType as AttackTypeValue,
  type RequestContext,
  type InspectableBodyKind,
  type MutableBodyKind,
  type ParameterValueType,
  type HeaderMap,
  type EngineRequest,
  type EngineResponse,
  type EngineRequestResponse,
  type Parameter,
  AnomalyType,
  type Anomaly,
  type AnomalyType as AnomalyTypeValue,
  type StatusCodeAnomaly,
  type RedirectAnomaly,
  type HeadersAnomaly,
  type ReflectionCountAnomaly,
  type BodyLengthAnomaly,
  type BodyContentAnomaly,
  type SimilarityAnomaly,
  type Finding,
  type AdditionalChecksResult,
  type StableFactors,
  type BaselineProfile,
  EngineState,
  type EngineState as EngineStateValue,
  EnginePhase,
  type EnginePhase as EnginePhaseValue,
  type LoggerLevel,
  type LoggerFn,
  type RunOptions,
  type EngineLearnInput,
  type EngineDiscoverInput,
  type EngineRunInput,
  type EngineRunResult,
  type EngineRunSummary,
  type RunControl,
} from "./types.js";

export { engineConfigSchema, type EngineConfig } from "./config-schema.js";
export type { EngineConfigInput } from "./config-schema.js";
export {
  parseEngineConfig,
  parseEngineRunInput,
  parseEngineLearnInput,
} from "./config.js";
export { type DiscoveryEvent } from "./events.js";

export {
  getNextChunk,
  splitChunk,
  createParameterValue,
  describeAnomalyReason,
  DEFAULT_HEADER_CHUNK_SIZE,
  type NextChunkInput,
  type NextChunkResult,
} from "./discovery.js";
export {
  detectAnomalies,
  detectReflectionAnomaly,
  similarity,
  type AnomalyOptions,
} from "./detect-anomaly.js";
export {
  parseJsonBodyPath,
  appendJsonBodyPath,
  formatJsonBodyPath,
  isInjectableJsonBodyPath,
  resolveJsonBodyPath,
  type JsonBodyPathSegment,
} from "./json-body-path.js";
export {
  randomString,
  sampleBody,
  splitLines,
  countOccurrences,
  buildFragmentCounts,
  similarityFromFragmentCounts,
  hasHeader,
  headerValuesEqual,
  getHeaderValues,
  getFirstHeaderValue,
} from "./utils.js";

export { anomalyTypeSchema } from "./config-schema.js";

export type {
  SleepFn,
  RandomSource,
  EngineLearnResult,
  EngineDiscoverResult,
  EngineRunSummaryBase,
  EngineCompletedRunResult,
  EngineCanceledRunResult,
  EngineTimeoutRunResult,
  EngineFailedRunResult,
} from "./types.js";

export type Events = {
  "mining:event": (event: DiscoveryEvent) => void;
};

export type Spec = DefinePluginPackageSpec<{
  manifestId: "paramfinder";
  api: API;
  events: Events;
}>;

export type { API } from "./api.js";
export type { SessionDescriptor } from "./api.js";
