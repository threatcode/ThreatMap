import type { DefinePluginPackageSpec } from "@threatmap/sdk-shared";

import type { API } from "./api.js";
import type { Events } from "./events.js";

export { type Result, ok, err } from "./result.js";

export {
  PANELS,
  type Panel,
  ITEM_KINDS,
  type ItemKind,
  MAX_ITEM_MEGABYTES,
  MAX_ITEM_BYTES,
  ITEM_TOO_LARGE_MESSAGE,
  MAX_REQUESTS_PER_ADD,
  CompareItemSchema,
  type CompareItem,
  AddItemInputSchema,
  type AddItemInput,
  AddFileItemInputSchema,
  type AddFileItemInput,
  AddRequestsInputSchema,
  type AddRequestsInput,
  ItemSelectionSchema,
  type ItemSelection,
  getOtherPanel,
  mapPanels,
  measureBytes,
} from "./item.js";

export {
  DIFF_MODES,
  type DiffMode,
  type DiffOptions,
  DEFAULT_DIFF_OPTIONS,
  type DiffInput,
  type RowKind,
  type Segment,
  type Cell,
  type Row,
  type DiffSummary,
  type DiffResult,
  compareTexts,
} from "./diff.js";

export type Spec = DefinePluginPackageSpec<{
  manifestId: "compare";
  api: API;
  events: Events;
}>;

export type { API } from "./api.js";
export type { Events } from "./events.js";
