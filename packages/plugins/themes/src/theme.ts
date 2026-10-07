import { z } from "zod";

export const AppearanceColorsSchema = z.object({
  surfacePage: z.string().min(1),
  surfaceRaised: z.string().min(1),
  fgDefault: z.string().min(1),
  fgMuted: z.string().min(1),
  lineDefault: z.string().min(1),
  accent: z.string().min(1),
  danger: z.string().min(1),
});

export type AppearanceColors = z.infer<typeof AppearanceColorsSchema>;

export const ThemeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  author: z.string(),
  light: AppearanceColorsSchema,
  dark: AppearanceColorsSchema,
});

export type Theme = z.infer<typeof ThemeSchema>;

export const CreateThemeSchema = ThemeSchema.omit({ id: true });
export type CreateTheme = z.infer<typeof CreateThemeSchema>;

export const UpdateThemeSchema = CreateThemeSchema.partial();
export type UpdateTheme = z.infer<typeof UpdateThemeSchema>;

export const BUILTIN_THEMES: Theme[] = [
  {
    id: "threatmap-default",
    name: "ThreatMap Default",
    description: "The default ThreatMap appearance.",
    author: "ThreatCode",
    light: {
      surfacePage: "#ffffff",
      surfaceRaised: "#f7f8fa",
      fgDefault: "#1a1d21",
      fgMuted: "#5b6470",
      lineDefault: "#dfe3e8",
      accent: "#2563eb",
      danger: "#dc2626",
    },
    dark: {
      surfacePage: "#0f1115",
      surfaceRaised: "#171a21",
      fgDefault: "#e6e9ef",
      fgMuted: "#9aa3b2",
      lineDefault: "#2a2f3a",
      accent: "#5b8def",
      danger: "#f87171",
    },
  },
];
