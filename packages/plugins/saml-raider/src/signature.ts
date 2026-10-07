import { extractBlocks } from "./xml.js";

export type SignatureInfo = {
  referenceUri: string | undefined;
  signatureMethod: string | undefined;
  digestMethod: string | undefined;
  signatureValuePresent: boolean;
  embeddedCertificatePresent: boolean;
};

export const listSignatures = (xml: string): SignatureInfo[] =>
  extractBlocks(xml, "Signature").map((block) => {
    const referenceMatch = /URI="([^"]*)"/.exec(block);
    const signatureMethod =
      /<(?:[\w-]+:)?SignatureMethod[^>]*Algorithm="([^"]*)"/.exec(block)?.[1];
    const digestMethod =
      /<(?:[\w-]+:)?DigestMethod[^>]*Algorithm="([^"]*)"/.exec(block)?.[1];
    return {
      referenceUri: referenceMatch?.[1],
      signatureMethod,
      digestMethod,
      signatureValuePresent:
        /<(?:[\w-]+:)?SignatureValue>[^<]+<\/(?:[\w-]+:)?SignatureValue>/.test(
          block,
        ),
      embeddedCertificatePresent:
        /<(?:[\w-]+:)?X509Certificate>[^<]+<\/(?:[\w-]+:)?X509Certificate>/.test(
          block,
        ),
    };
  });

export const listEmbeddedCertificates = (xml: string): string[] =>
  extractBlocks(xml, "X509Certificate").map((block) =>
    block.replace(/<\/?(?:[\w-]+:)?X509Certificate>/g, "").replace(/\s+/g, ""),
  );

export const removeSignatures = (xml: string): string =>
  xml.replace(
    /<(?:[\w-]+:)?Signature(?:\s[^>]*)?>[\s\S]*?<\/(?:[\w-]+:)?Signature>/g,
    "",
  );

export const verifySignatureShape = (
  xml: string,
): {
  signed: boolean;
  signatures: SignatureInfo[];
} => {
  const signatures = listSignatures(xml);
  return { signed: signatures.length > 0, signatures };
};
