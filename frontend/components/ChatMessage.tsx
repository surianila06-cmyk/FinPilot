import { Bot, User, Sparkles, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export interface MessageProps {
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
}

export default function ChatMessage({ sender, text, timestamp }: MessageProps) {
  const isUser = sender === "user";

  // Formatter to render status badges if text contains icons like ✅ or ⚠
  const getBadgeType = (content: string) => {
    const trimmed = content.trim();
    if (trimmed.startsWith("✅")) return { type: "success", label: "Approved / Safe", icon: CheckCircle2 };
    if (trimmed.startsWith("⚠") || trimmed.startsWith("❌")) return { type: "warning", label: "High Caution / Debt Risk", icon: AlertTriangle };
    if (trimmed.startsWith("💡")) return { type: "info", label: "AI Financial Advice", icon: Info };

    if (content.includes("✅")) return { type: "success", label: "Approved / Safe", icon: CheckCircle2 };
    if (content.includes("⚠") || content.includes("❌")) return { type: "warning", label: "High Caution / Debt Risk", icon: AlertTriangle };
    if (content.includes("💡")) return { type: "info", label: "AI Financial Advice", icon: Info };
    return null;
  };

  const badge = !isUser ? getBadgeType(text) : null;

  return (
    <div className={`flex items-start gap-3.5 my-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      
      {/* Avatar Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
        isUser 
          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white" 
          : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20"
      }`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Content Bubble */}
      <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-lg border transition-all ${
        isUser
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/30 rounded-tr-none"
          : "glass-card text-slate-100 border-slate-800 rounded-tl-none"
      }`}>

        {!isUser && badge && (
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/80">
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              badge.type === "success"
                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                : badge.type === "warning"
                ? "bg-amber-950/80 text-amber-400 border border-amber-500/30"
                : "bg-blue-950/80 text-blue-400 border border-blue-500/30"
            }`}>
              <badge.icon className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> FinPilot Agent
            </span>
          </div>
        )}

        {/* Text Body */}
        <div className="text-sm leading-relaxed whitespace-pre-line space-y-2 font-normal">
          {text}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <div className={`mt-2 text-[10px] ${isUser ? "text-blue-200 text-right" : "text-slate-500 text-left"}`}>
            {timestamp}
          </div>
        )}

      </div>
    </div>
  );
}
