import { deflateRawSync, inflateRawSync, inflateSync } from "node:zlib";

import { err, ok, type Result } from "./result.js";

export type SamlBinding = "redirect" | "post";

export const isXml = (value: string): boolean =>
  value.trimStart().startsWith("<");

const tryBase64Decode = (value: string): string | undefined => {
  try {
    const normalized = value.replace(/\s+/g, "");
    const decoded = Buffer.from(normalized, "base64").toString("utf-8");
    return decoded;
  } catch {
    return undefined;
  }
};

export const decodeMessage = (input: string): Result<string> => {
  const trimmed = input.trim();
  if (trimmed.length === 0) return err("The message is empty.");
  if (isXml(trimmed)) return ok(trimmed);

  const decoded = tryBase64Decode(trimmed);
  if (decoded === undefined) return err("The message is not valid base64.");

  if (isXml(decoded)) return ok(decoded);

  const asBuffer = Buffer.from(trimmed.replace(/\s+/g, ""), "base64");
  try {
    const inflated = inflateRawSync(asBuffer).toString("utf-8");
    if (isXml(inflated)) return ok(inflated);
  } catch {
    // fall through to plain zlib inflate
  }
  try {
    const inflated = inflateSync(asBuffer).toString("utf-8");
    if (isXml(inflated)) return ok(inflated);
  } catch {
    return err("The message could not be decoded as SAML.");
  }
  return err("The message could not be decoded as SAML.");
};

export const encodeMessage = (
  xml: string,
  binding: SamlBinding = "redirect",
): Result<string> => {
  if (xml.trim().length === 0) return err("The message is empty.");
  try {
    if (binding === "redirect") {
      return ok(deflateRawSync(Buffer.from(xml, "utf-8")).toString("base64"));
    }
    return ok(Buffer.from(xml, "utf-8").toString("base64"));
  } catch {
    return err("The message could not be encoded.");
  }
};
