import { z } from "zod";

export const PANELS = ["original", "modified"] as const;

export type Panel = (typeof PANELS)[number];

export const ITEM_KINDS = ["request", "response", "file", "clipboard"] as const;

export type ItemKind = (typeof ITEM_KINDS)[number];

export const MAX_ITEM_MEGABYTES = 10;

export const MAX_ITEM_BYTES = MAX_ITEM_MEGABYTES * 1024 * 1024;

export const ITEM_TOO_LARGE_MESSAGE = `Items larger than ${MAX_ITEM_MEGABYTES} MB are not supported.`;

export const MAX_REQUESTS_PER_ADD = 25;

export const CompareItemSchema = z.object({
  id: z.number().int().positive(),
  kind: z.enum(ITEM_KINDS),
  source: z.string(),
  data: z.string(),
  createdAt: z.string(),
});

export type CompareItem = z.infer<typeof CompareItemSchema>;

export const AddItemInputSchema = z.object({
  panel: z.enum(PANELS),
  kind: z.enum(ITEM_KINDS),
  source: z.string().min(1),
  data: z.string().min(1, "The item is empty."),
});

export type AddItemInput = z.infer<typeof AddItemInputSchema>;

export const AddFileItemInputSchema = AddItemInputSchema.omit({
  data: true,
}).extend({
  path: z.string().min(1, "The uploaded file has no path."),
});

export type AddFileItemInput = z.infer<typeof AddFileItemInputSchema>;

export const AddRequestsInputSchema = z.object({
  panel: z.enum(PANELS),
  requestIds: z
    .array(z.string())
    .min(1, "Select at least one request.")
    .max(
      MAX_REQUESTS_PER_ADD,
      `Send at most ${MAX_REQUESTS_PER_ADD} requests at once.`,
    ),
});

export type AddRequestsInput = z.infer<typeof AddRequestsInputSchema>;

export const ItemSelectionSchema = z.object({
  panel: z.enum(PANELS),
  ids: z.array(z.number().int().positive()).min(1, "Select at least one item."),
});

export type ItemSelection = z.infer<typeof ItemSelectionSchema>;

export const getOtherPanel = (panel: Panel): Panel =>
  panel === "original" ? "modified" : "original";

export const mapPanels = <T>(build: (panel: Panel) => T): Record<Panel, T> => ({
  original: build("original"),
  modified: build("modified"),
});

const isHighSurrogate = (code: number): boolean =>
  code >= 0xd800 && code <= 0xdbff;

const isLowSurrogate = (code: number): boolean =>
  code >= 0xdc00 && code <= 0xdfff;

const measureCodeUnit = (code: number): number => {
  if (code < 0x80) return 1;
  if (code < 0x800) return 2;
  return 3;
};

export const measureBytes = (text: string): number => {
  let bytes = 0;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    if (isHighSurrogate(code) && isLowSurrogate(text.charCodeAt(index + 1))) {
      bytes += 4;
      index += 1;
      continue;
    }
    bytes += measureCodeUnit(code);
  }
  return bytes;
};
