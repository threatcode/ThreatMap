import type { TorStatus } from "./types.js";

export type Events = {
  "status:changed": (status: TorStatus) => void;
  "config:changed": () => void;
};
