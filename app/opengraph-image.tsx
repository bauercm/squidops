import { ogImage, ogSize } from "@/lib/og";
import { site, storeEnabled } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "For Azure + AI engineers",
    title: "Ship Azure and AI systems that hold up in production.",
    footer: storeEnabled ? "Guides · Toolkits · Courses · Agents" : "Free guides · Weekly newsletter",
  });
}
