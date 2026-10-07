import type { MessageInfo } from "./message.js";

export type Events = {
  "message:analyzed": (info: MessageInfo) => void;
  "attack:applied": (attack: string) => void;
};
