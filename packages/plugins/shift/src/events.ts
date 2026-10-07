export type Events = {
  "agent:created": (id: string) => void;
  "agent:deleted": (id: string) => void;
  "settings:updated": () => void;
  "models:updated": () => void;
};
