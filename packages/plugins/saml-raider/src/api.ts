import type { CvePayload } from "./attacks/cve.js";
import type { XswVariant } from "./attacks/xsw.js";
import type { SamlBinding } from "./codec.js";
import type { MessageInfo } from "./message.js";
import type { Result } from "./result.js";
import type { SignatureInfo } from "./signature.js";

export type API = {
  decodeMessage: (input: string) => Result<string>;
  encodeMessage: (xml: string, binding?: SamlBinding) => Result<string>;
  analyzeMessage: (xml: string) => Result<MessageInfo>;
  renderMessage: (xml: string) => Result<string>;

  listSignatures: (xml: string) => Result<SignatureInfo[]>;
  listEmbeddedCertificates: (xml: string) => Result<string[]>;
  removeSignatures: (xml: string) => Result<string>;

  applyXsw: (xml: string, variant: XswVariant) => Result<string>;
  applyCvePayload: (xml: string, id: CvePayload["id"]) => Result<string>;
  replaceNameId: (xml: string, value: string) => Result<string>;
  replaceIssuer: (xml: string, value: string) => Result<string>;
};
