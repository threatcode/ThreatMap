import type { DefinePluginPackageSpec } from "@threatmap/sdk-shared";

import type { API } from "./api.js";
import type { Events } from "./events.js";

export { type Result, ok, err } from "./result.js";

export {
  AppearanceColorsSchema,
  type AppearanceColors,
  ThemeSchema,
  type Theme,
  CreateThemeSchema,
  type CreateTheme,
  UpdateThemeSchema,
  type UpdateTheme,
  BUILTIN_THEMES,
} from "./theme.js";

export type Spec = DefinePluginPackageSpec<{
  manifestId: "themes";
  api: API;
  events: Events;
}>;
