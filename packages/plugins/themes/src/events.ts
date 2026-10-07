import type { Theme } from "./theme.js";

export type Events = {
  "theme:created": (theme: Theme) => void;
  "theme:updated": (theme: Theme) => void;
  "theme:deleted": (themeId: string) => void;
  "themes:reset": (themes: Theme[]) => void;
  "theme:activated": (themeId: string | undefined) => void;
};
