import { type FlatConfigItem } from "../types";

export const ignore = (): FlatConfigItem[] => {
  return [
    {
      name: "threatmap/ignore",
      ignores: ["**/coverage", "**/dist"],
    },
  ];
};
