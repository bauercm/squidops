import { AgentIcon, CourseIcon, ToolkitIcon } from "@/components/icons";
import type { ProductLine } from "@/lib/types";

export const productLines: Record<
  ProductLine,
  { label: string; plural: string; blurb: string; text: string; Icon: typeof ToolkitIcon }
> = {
  toolkit: {
    label: "Toolkit",
    plural: "Toolkits",
    blurb: "IaC modules, policies, and runbooks you adapt to your tenant.",
    text: "text-toolkit",
    Icon: ToolkitIcon,
  },
  course: {
    label: "Course",
    plural: "Courses",
    blurb: "Self-paced, written deep dives on one topic at a time.",
    text: "text-course",
    Icon: CourseIcon,
  },
  agent: {
    label: "Agent",
    plural: "Agents",
    blurb: "Small AI agents that run in your subscription and do one job well.",
    text: "text-agent",
    Icon: AgentIcon,
  },
};

export function LineBadge({ line }: { line: ProductLine }) {
  const { label, text, Icon } = productLines[line];
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider ${text}`}>
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}
