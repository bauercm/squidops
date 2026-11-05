import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "For Azure + AI engineers",
    title: "Ship Azure and AI systems that hold up in production.",
    footer: "Guides · Toolkits · Courses · Agents",
  });
}
