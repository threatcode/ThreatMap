import { err, ok, type Result } from "../result.js";
import { firstTagContent } from "../xml.js";

export const replaceNameId = (xml: string, value: string): Result<string> => {
  if (value.length === 0) return err("The replacement value is empty.");
  const nameId = firstTagContent(xml, "NameID");
  if (nameId === undefined) return err("No NameID element found.");
  return ok(xml.replace(nameId, value));
};

export const replaceIssuer = (xml: string, value: string): Result<string> => {
  if (value.length === 0) return err("The replacement value is empty.");
  const issuer = firstTagContent(xml, "Issuer");
  if (issuer === undefined) return err("No Issuer element found.");
  return ok(xml.replace(issuer, value));
};
