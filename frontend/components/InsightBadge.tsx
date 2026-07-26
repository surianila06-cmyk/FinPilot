import { CheckCircle2, AlertTriangle, Info, XCircle, TrendingUp } from "lucide-react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "tip";

interface InsightBadgeProps {
  variant: BadgeVariant;
  label: string;
  small?: boolean;
}

const CONFIG: Record<BadgeVariant, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-950/80",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-950/80",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  danger: {
    icon: XCircle,
    bg: "bg-red-950/80",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  info: {
    icon: Info,
    bg: "bg-blue-950/80",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  tip: {
    icon: TrendingUp,
    bg: "bg-purple-950/80",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
};

export default function InsightBadge({ variant, label, small = false }: InsightBadgeProps) {
  const { icon: Icon, bg, text, border } = CONFIG[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"} rounded-full font-semibold border ${bg} ${text} ${border}`}
    >
      <Icon className={small ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {label}
    </span>
  );
}
