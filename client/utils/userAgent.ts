import { UAParser } from "ua-parser-js";

export default function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return `${result.browser.name} ${result.browser.version}, ${result.os.name} ${result.os.version}`;
}
