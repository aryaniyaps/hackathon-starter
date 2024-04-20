import { Icons } from "@/components/icons";
import { LucideIcon } from "lucide-react";
import UAParser, { IResult } from "ua-parser-js";

export default function getBrowserOSInfo(result: IResult): string {
  return `${result.browser.name} ${result.browser.version}, ${result.os.name} ${result.os.version}`;
}

export function getDeviceIcon(result: IResult): LucideIcon {
  switch (result.device.type) {
    case "mobile":
      return Icons.smartphone;
    case "tablet":
      return Icons.tablet;
    case "embedded":
      return Icons.cpu;
    case "console":
      return Icons.terminal;
    case "smarttv":
      return Icons.tv;
    case "wearable":
      return Icons.watch;
    default:
      // desktop
      return Icons.monitor;
  }
}
