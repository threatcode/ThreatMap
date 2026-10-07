import { z } from "zod";

import {
  countTag,
  firstTagAttributes,
  firstTagContent,
  stripWhitespace,
} from "./xml.js";

export const MESSAGE_KINDS = [
  "AuthnRequest",
  "Response",
  "LogoutRequest",
  "LogoutResponse",
] as const;

export type MessageKind = (typeof MESSAGE_KINDS)[number];

export const MessageInfoSchema = z.object({
  kind: z.enum(MESSAGE_KINDS),
  id: z.string().optional(),
  inResponseTo: z.string().optional(),
  issuer: z.string().optional(),
  nameId: z.string().optional(),
  subjectNameId: z.string().optional(),
  destination: z.string().optional(),
  assertionCount: z.number().int().nonnegative(),
  signatureCount: z.number().int().nonnegative(),
  hasEmbeddedCertificate: z.boolean(),
});

export type MessageInfo = z.infer<typeof MessageInfoSchema>;

export const detectMessageKind = (xml: string): MessageKind | undefined => {
  for (const kind of MESSAGE_KINDS) {
    const pattern = new RegExp(`<(?:[\\w-]+:)?${kind}(\\s|>|/>)`);
    if (pattern.test(xml)) return kind;
  }
  return undefined;
};

export const parseMessageInfo = (xml: string): MessageInfo | undefined => {
  const kind = detectMessageKind(xml);
  if (kind === undefined) return undefined;

  const attributes = firstTagAttributes(xml, kind);
  const issuer = firstTagContent(xml, "Issuer");
  const subject = firstTagContent(xml, "Subject");
  const nameId =
    firstTagContent(xml, "NameID") ?? firstTagContent(subject ?? "", "NameID");

  return {
    kind,
    id: attributes["ID"] ?? attributes["Id"],
    inResponseTo: attributes["InResponseTo"],
    issuer: issuer !== undefined ? stripWhitespace(issuer) : undefined,
    nameId: nameId !== undefined ? stripWhitespace(nameId) : undefined,
    destination: attributes["Destination"],
    assertionCount: countTag(xml, "Assertion"),
    signatureCount: countTag(xml, "Signature"),
    hasEmbeddedCertificate: /<(?:[\w-]+:)?X509Certificate>/.test(xml),
  };
};
