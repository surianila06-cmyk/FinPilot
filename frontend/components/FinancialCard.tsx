import { ReactNode } from "react";

type AccentColor = "blue" | "emerald" | "amber" | "rose" | "purple" | "cyan";

interface FinancialCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: { text: string; positive?: boolean };
  accentColor?: AccentColor;
  highlight?: boolean;
}

const ACCENTS: Record<AccentColor, { border: string; bg: string; icon: string; glow: string }> = {
  blue:    { border: "border-blue-500/20",    bg: "bg-blue-500/8",    icon: "text-blue-400",    glow: "group-hover:shadow-blue-500/10" },
  emerald: { border: "border-emerald-500/20", bg: "bg-emerald-500/8", icon: "text-emerald-400", glow: "group-hover:shadow-emerald-500/10" },
  amber:   { border: "border-amber-500/20",   bg: "bg-amber-500/8",   icon: "text-amber-400",   glow: "group-hover:shadow-amber-500/10" },
  rose:    { border: "border-rose-500/20",    bg: "bg-rose-500/8",    icon: "text-rose-400",    glow: "group-hover:shadow-rose-500/10" },
  purple:  { border: "border-purple-500/20",  bg: "bg-purple-500/8",  icon: "text-purple-400",  glow: "group-hover:shadow-purple-500/10" },
  cyan:    { border: "border-cyan-500/20",    bg: "bg-cyan-500/8",    icon: "text-cyan-400",    glow: "group-hover:shadow-cyan-500/10" },
};

export default function FinancialCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = "blue",
  highlight = false,
}: FinancialCardProps) {
  const accent = ACCENTS[accentColor];

  return (
    <div
      className={`glass-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 ${
        highlight ? "border-blue-500/30 shadow-lg shadow-blue-500/10" : ""
      }`}
    >
      {/* Decorative Glow Blob */}
      <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${accent.bg}`} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight truncate">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 pt-0.5 font-medium">{subtitle}</p>
          )}
        </div>

        <div
          className={`p-3 rounded-xl border ${accent.border} ${accent.bg} ${accent.icon} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs">
          <span
            className={`font-semibold px-2 py-0.5 rounded-md ${
              trend.positive
                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/25"
                : "bg-amber-950/80 text-amber-400 border border-amber-500/25"
            }`}
          >
            {trend.text}
          </span>
          <span className="text-slate-600">vs last assessment</span>
        </div>
      )}
    </div>
  );
}