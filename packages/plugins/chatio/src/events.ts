import type { ChatSession } from "./message.js";

export type Events = {
  "session:created": (session: ChatSession) => void;
  "session:updated": (session: ChatSession) => void;
  "session:deleted": (sessionId: string) => void;
  "message:streamed": (sessionId: string, text: string) => void;
};
