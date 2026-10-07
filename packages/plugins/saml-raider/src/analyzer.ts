import { type MessageInfo, parseMessageInfo } from "./message.js";
import { err, ok, type Result } from "./result.js";

export const analyzeMessage = (xml: string): Result<MessageInfo> => {
  if (xml.trim().length === 0) return err("The message is empty.");
  const info = parseMessageInfo(xml);
  if (info === undefined) return err("The message is not a SAML message.");
  return ok(info);
};
