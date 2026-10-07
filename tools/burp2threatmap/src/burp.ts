import { readFileSync } from "node:fs";

export type BurpItem = {
  time: string;
  url: string;
  host: string;
  port: number;
  protocol: string;
  method: string;
  path: string;
  extension: string;
  request: string;
  requestBase64: boolean;
  status: number;
  responseLength: number;
  mimeType: string;
  response: string;
  responseBase64: boolean;
  comment: string;
};

const fieldValue = (block: string, tag: string): string => {
  const pattern = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`);
  const match = pattern.exec(block);
  if (match === null) return "";
  return stripCdata(match[1]!.trim());
};

const fieldIsBase64 = (block: string, tag: string): boolean => {
  const pattern = new RegExp(`<${tag}([^>]*)>`);
  const match = pattern.exec(block);
  return match !== null && /base64="true"/.test(match[1]!);
};

const parseIntOrZero = (value: string): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const stripCdata = (value: string): string =>
  value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");

const parseBurpXml = (xml: string): BurpItem[] => {
  const items: BurpItem[] = [];
  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = match[1]!;
    const item: BurpItem = {
      time: fieldValue(block, "time"),
      url: fieldValue(block, "url"),
      host: fieldValue(block, "host"),
      port: parseIntOrZero(fieldValue(block, "port")),
      protocol: fieldValue(block, "protocol"),
      method: fieldValue(block, "method"),
      path: fieldValue(block, "path"),
      extension: fieldValue(block, "extension"),
      request: fieldValue(block, "request"),
      requestBase64: fieldIsBase64(block, "request"),
      status: parseIntOrZero(fieldValue(block, "status")),
      responseLength: parseIntOrZero(fieldValue(block, "responselength")),
      mimeType: fieldValue(block, "mimetype"),
      response: fieldValue(block, "response"),
      responseBase64: fieldIsBase64(block, "response"),
      comment: fieldValue(block, "comment"),
    };
    items.push(item);
  }
  return items;
};

export const parseBurpFile = (path: string): BurpItem[] =>
  parseBurpXml(readFileSync(path, "utf-8"));

const TZ_OFFSETS: Record<string, number> = {
  UTC: 0,
  GMT: 0,
  EST: -5,
  EDT: -4,
  CST: -6,
  CDT: -5,
  MST: -7,
  MDT: -6,
  PST: -8,
  PDT: -7,
};

const BURP_TIME_PATTERN =
  /^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}) (\d{2}:\d{2}:\d{2}) ([A-Z]{2,5}) (\d{4})$/;

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export const parseBurpTime = (value: string): number => {
  const match = BURP_TIME_PATTERN.exec(value.trim());
  if (match === null) {
    const fallback = Date.parse(value);
    if (Number.isNaN(fallback)) {
      throw new Error(`Failed to parse Burp timestamp: ${value}`);
    }
    return fallback;
  }
  const [, month, day, clock, tz, year] = match;
  const [hours, minutes, seconds] = clock!.split(":").map(Number);
  const offsetHours = TZ_OFFSETS[tz!] ?? 0;
  return (
    Date.UTC(
      Number(year),
      MONTHS[month!],
      Number(day),
      hours,
      minutes,
      seconds,
    ) -
    offsetHours * 3_600_000
  );
};

export const decodeBody = (value: string, base64: boolean): Uint8Array =>
  base64
    ? new Uint8Array(Buffer.from(value.replace(/\s+/g, ""), "base64"))
    : new TextEncoder().encode(value);
