import { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    text: string;
    positive?: boolean;
  };
  accentColor?: "blue" | "emerald" | "amber" | "rose" | "purple";
};

export default function FinancialCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = "blue",
}: Props) {
  const accentStyles = {
    blue: "border-blue-500/20 bg-blue-500/5 text-blue-400",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-400",
    purple: "border-purple-500/20 bg-purple-500/5 text-purple-400",
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      {/* Background Gradient Accent Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 pt-1 font-medium">{subtitle}</p>
          )}
        </div>

        <div className={`p-3.5 rounded-xl border ${accentStyles[accentColor]} transition-transform duration-300 group-hover:scale-110 shadow-inner`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className={`font-semibold px-2 py-0.5 rounded-md ${
            trend.positive 
              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
              : "bg-amber-950/80 text-amber-400 border border-amber-500/30"
          }`}>
            {trend.text}
          </span>
          <span className="text-slate-500">vs last assessment</span>
        </div>
      )}
    </div>
  );
}