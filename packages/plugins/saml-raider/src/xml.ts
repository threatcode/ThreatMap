export const firstTagContent = (
  xml: string,
  localName: string,
): string | undefined => {
  const pattern = new RegExp(
    `<(?:[\\w-]+:)?${localName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w-]+:)?${localName}>`,
  );
  const match = pattern.exec(xml);
  return match?.[1];
};

export const firstTagAttributes = (
  xml: string,
  localName: string,
): Record<string, string> => {
  const pattern = new RegExp(`<(?:[\\w-]+:)?${localName}(\\s[^>]*)?>`);
  const match = pattern.exec(xml);
  const attrs = match?.[1] ?? "";
  const attributes: Record<string, string> = {};
  for (const attr of attrs.matchAll(/([\w-]+)="([^"]*)"/g)) {
    attributes[attr[1]!] = attr[2]!;
  }
  return attributes;
};

export const countTag = (xml: string, localName: string): number => {
  const pattern = new RegExp(`<(?:[\\w-]+:)?${localName}(\\s[^>]*)?[/>]`, "g");
  return [...xml.matchAll(pattern)].length;
};

export const extractBlocks = (xml: string, localName: string): string[] => {
  const pattern = new RegExp(
    `<(?:[\\w-]+:)?${localName}(?:\\s[^>]*)?>[\\s\\S]*?<\\/(?:[\\w-]+:)?${localName}>`,
    "g",
  );
  return [...xml.matchAll(pattern)].map((match) => match[0]);
};

export const stripWhitespace = (value: string): string =>
  value.replace(/\s+/g, " ").trim();

export const prettyPrint = (xml: string): string => {
  const tokens = xml
    .replace(/></g, ">\n<")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  let depth = 0;
  const lines: string[] = [];
  for (const token of tokens) {
    if (token.startsWith("</")) depth = Math.max(0, depth - 1);
    lines.push(`${"  ".repeat(depth)}${token}`);
    if (
      token.startsWith("<") &&
      !token.startsWith("</") &&
      !token.startsWith("<?") &&
      !token.startsWith("<!") &&
      !token.endsWith("/>") &&
      !/>\s*[^<]*$/.test(token.slice(token.indexOf(">")))
    ) {
      if (!/</.test(token.slice(token.indexOf(">") + 1))) depth += 1;
    }
  }
  return lines.join("\n");
};
