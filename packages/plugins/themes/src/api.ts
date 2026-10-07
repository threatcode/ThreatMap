import type { Result } from "./result.js";
import type { CreateTheme, Theme, UpdateTheme } from "./theme.js";

export type API = {
  getThemes: () => Result<Theme[]>;
  getTheme: (themeId: string) => Result<Theme>;
  addTheme: (input: CreateTheme) => Promise<Result<Theme>>;
  updateTheme: (
    themeId: string,
    updates: UpdateTheme,
  ) => Promise<Result<Theme>>;
  removeTheme: (themeId: string) => Promise<Result<void>>;
  resetThemes: () => Promise<Result<Theme[]>>;

  getActiveThemeId: () => Result<string | undefined>;
  setActiveTheme: (themeId: string | undefined) => Result<void>;
};
