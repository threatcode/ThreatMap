import type { APIResult } from "./index.js";

export type API = {
  ping: () => APIResult<string>;
};
