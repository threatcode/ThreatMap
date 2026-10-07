import { z } from "zod";

export const CHAT_ROLES = ["system", "user", "assistant"] as const;

export type ChatRole = (typeof CHAT_ROLES)[number];

export const TextPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

export const ImagePartSchema = z.object({
  type: z.literal("image"),
  mediaType: z.string(),
  data: z.string(),
});

export const MessagePartSchema = z.discriminatedUnion("type", [
  TextPartSchema,
  ImagePartSchema,
]);

export type MessagePart = z.infer<typeof MessagePartSchema>;

export const ChatMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(CHAT_ROLES),
  parts: z.array(MessagePartSchema).min(1),
  createdAt: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatSessionSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  model: z.string().optional(),
  messages: z.array(ChatMessageSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ChatSession = z.infer<typeof ChatSessionSchema>;

export const CreateSessionSchema = ChatSessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateSession = z.infer<typeof CreateSessionSchema>;

export const SendMessageSchema = z.object({
  sessionId: z.string().min(1),
  text: z.string().min(1),
  model: z.string().optional(),
});

export type SendMessage = z.infer<typeof SendMessageSchema>;
