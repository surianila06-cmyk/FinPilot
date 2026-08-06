import { Bot, User, Sparkles, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import type { MessageItem } from "@/types/financial";

function getBadge(text: string) {
  const t = text.trim();
  if (t.startsWith("✅")) return { type: "success", label: "Approved / Safe", icon: CheckCircle2, colors: "bg-emerald-950/80 text-emerald-400 border-emerald-500/30" };
  if (t.startsWith("❌")) return { type: "danger", label: "Not Recommended", icon: XCircle, colors: "bg-red-950/80 text-red-400 border-red-500/30" };
  if (t.startsWith("⚠")) return { type: "warning", label: "Caution Advised", icon: AlertTriangle, colors: "bg-amber-950/80 text-amber-400 border-amber-500/30" };
  if (t.startsWith("💡")) return { type: "info", label: "AI Insight", icon: Info, colors: "bg-blue-950/80 text-blue-400 border-blue-500/30" };
  // Fallback checks for mid-text icons
  if (text.includes("✅")) return { type: "success", label: "Approved / Safe", icon: CheckCircle2, colors: "bg-emerald-950/80 text-emerald-400 border-emerald-500/30" };
  if (text.includes("❌")) return { type: "danger", label: "Not Recommended", icon: XCircle, colors: "bg-red-950/80 text-red-400 border-red-500/30" };
  if (text.includes("⚠")) return { type: "warning", label: "Caution Advised", icon: AlertTriangle, colors: "bg-amber-950/80 text-amber-400 border-amber-500/30" };
  if (text.includes("💡")) return { type: "info", label: "AI Insight", icon: Info, colors: "bg-blue-950/80 text-blue-400 border-blue-500/30" };
  return null;
}

export default function ChatMessage({ sender, text, timestamp }: MessageItem) {
  const isUser = sender === "user";
  const badge = !isUser ? getBadge(text) : null;

  return (
    <div className={`flex items-start gap-3 my-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
          isUser
            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
            : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-lg border transition-all ${
          isUser
            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-500/30 rounded-tr-sm"
            : "glass-card text-slate-100 border-slate-800/80 rounded-tl-sm"
        }`}
      >
        {/* Badge header for AI messages */}
        {!isUser && badge && (
          <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-slate-800/60">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.colors}`}>
              <badge.icon className="w-3 h-3" />
              {badge.label}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 ml-auto">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Prospera AI
            </span>
          </div>
        )}

        {/* Message text */}
        <div className="text-sm leading-relaxed whitespace-pre-line font-normal">
          {text}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <div className={`mt-1.5 text-[10px] ${isUser ? "text-blue-200 text-right" : "text-slate-600"}`}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
