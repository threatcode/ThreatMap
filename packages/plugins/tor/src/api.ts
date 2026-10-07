import type { Result } from "./result.js";
import type {
  TestConnectionResult,
  TorSettings,
  TorStatus,
  TorVersionInfo,
} from "./types.js";

export type API = {
  getSettings: () => Promise<TorSettings>;
  updateSettings: (
    settings: Partial<TorSettings>,
  ) => Promise<Result<TorSettings>>;

  getStatus: () => Promise<TorStatus>;
  start: () => Promise<Result<TorStatus>>;
  stop: () => Promise<Result<TorStatus>>;
  reload: () => Promise<Result<TorStatus>>;

  testConnection: () => Promise<Result<TestConnectionResult>>;
  checkForUpdates: () => Promise<
    Result<{ updateAvailable: boolean; latestVersion?: string }>
  >;
  downloadBinary: (version?: string) => Promise<Result<TorVersionInfo>>;
};
