import { z } from "zod";

export const TOR_STATES = [
  "idle",
  "starting",
  "running",
  "stopping",
  "error",
] as const;

export type TorState = (typeof TOR_STATES)[number];

export const TorSettingsSchema = z.object({
  autoStart: z.boolean(),
  autoCheckUpdates: z.boolean(),
  port: z.number().int().min(1).max(65535),
  installedVersion: z.string().optional(),
  binaryPath: z.string().optional(),
  upstreamProxyId: z.string().optional(),
  includeHosts: z.array(z.string()),
  excludeHosts: z.array(z.string()),
});

export type TorSettings = z.infer<typeof TorSettingsSchema>;

export const DEFAULT_SETTINGS: TorSettings = {
  autoStart: false,
  autoCheckUpdates: true,
  port: 9050,
  installedVersion: undefined,
  binaryPath: undefined,
  upstreamProxyId: undefined,
  includeHosts: ["check.torproject.org"],
  excludeHosts: [],
};

export const UpdateTorSettingsSchema = TorSettingsSchema.partial();
export type UpdateTorSettings = z.infer<typeof UpdateTorSettingsSchema>;

export const TorStatusSchema = z.object({
  state: z.enum(TOR_STATES),
  version: z.string().optional(),
  updateAvailable: z.boolean(),
  latestVersion: z.string().optional(),
  error: z.string().optional(),
});

export type TorStatus = z.infer<typeof TorStatusSchema>;

export const TestConnectionResultSchema = z.object({
  isTor: z.boolean(),
  ip: z.string(),
});

export type TestConnectionResult = z.infer<typeof TestConnectionResultSchema>;

export const TorVersionInfoSchema = z.object({
  binary: z.string(),
  version: z.string(),
});

export type TorVersionInfo = z.infer<typeof TorVersionInfoSchema>;
