import type { DefinePluginPackageSpec } from "@threatmap/sdk-shared";

import type { API } from "./api.js";
import type { Events } from "./events.js";

export { type Result, ok, err } from "./result.js";

export {
  type SamlBinding,
  isXml,
  decodeMessage,
  encodeMessage,
} from "./codec.js";

export {
  MESSAGE_KINDS,
  type MessageKind,
  MessageInfoSchema,
  type MessageInfo,
  detectMessageKind,
  parseMessageInfo,
} from "./message.js";

export { analyzeMessage } from "./analyzer.js";

export {
  type SignatureInfo,
  listSignatures,
  listEmbeddedCertificates,
  removeSignatures,
  verifySignatureShape,
} from "./signature.js";

export {
  firstTagContent,
  firstTagAttributes,
  countTag,
  extractBlocks,
  stripWhitespace,
  prettyPrint,
} from "./xml.js";

export {
  XSW_VARIANTS,
  type XswVariant,
  XswVariantSchema,
  applyXsw,
  listXswVariants,
} from "./attacks/xsw.js";
export {
  CVE_PAYLOADS,
  type CvePayload,
  applyCvePayload,
} from "./attacks/cve.js";
export { replaceNameId, replaceIssuer } from "./attacks/replace.js";

export type Spec = DefinePluginPackageSpec<{
  manifestId: "saml-raider";
  api: API;
  events: Events;
}>;

export type { API } from "./api.js";
export type { Events } from "./events.js";
