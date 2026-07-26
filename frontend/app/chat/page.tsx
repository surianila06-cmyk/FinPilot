"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatMessage from "@/components/ChatMessage";
import { chatWithAI } from "@/lib/api";
import type { MessageItem, ChatHistoryItem, FinancialProfile } from "@/types/financial";
import {
  SendHorizontal, MessageSquareText, CircleDollarSign,
  Wallet, PiggyBank, Landmark, Upload, Bot,
  TrendingUp, Coins, Home as HomeIcon, BarChart2, Target,
} from "lucide-react";
import ScoreGauge from "@/components/ScoreGauge";

const PROMPT_CHIPS = [
  { label: "Budget Check", prompt: "Analyse my monthly budget and tell me how to improve it.", icon: Wallet },
  { label: "Gold Strategy", prompt: "Should I invest in gold given my savings?", icon: Coins },
  { label: "Buy a Bike?", prompt: "Can I afford to buy a bike right now?", icon: HomeIcon },
  { label: "SIP Plan", prompt: "How much should I invest in SIPs monthly to build wealth?", icon: TrendingUp },
  { label: "Loan Check", prompt: "How is my current loan burden looking?", icon: Landmark },
  { label: "Goal: House", prompt: "How long will it take for me to save for a house?", icon: Target },
  { label: "Tax Saving", prompt: "How can I save more tax this financial year?", icon: BarChart2 },
  { label: "Emergency Fund", prompt: "Do I have enough emergency fund savings?", icon: CircleDollarSign },
];

const WELCOME_MESSAGE: MessageItem = {
  sender: "ai",
  text:
    "💡 Welcome to FinPilot AI!\n\n" +
    "I'm your intelligent financial copilot. You can ask me anything about:\n" +
    "• Budget optimization & expense analysis\n" +
    "• SIP projections & mutual fund strategy\n" +
    "• Gold investment (SGBs, ETFs, Digital Gold)\n" +
    "• Loan EMI affordability & debt management\n" +
    "• Goal planning (bike, car, house, education)\n" +
    "• Indian tax saving strategies (80C, 80D, NPS)\n\n" +
    "Upload a document first for personalized advice, or ask me anything now! 🚀",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const FALLBACK_PROFILE: FinancialProfile = {
  monthly_income: 75000,
  monthly_expenses: 28000,
  savings: 350000,
  loans: 150000,
  monthly_emi: 8500,
  insurance: 3000,
};

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageItem[]>([WELCOME_MESSAGE]);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [score, setScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setMounted(true);
      try {
        const sp = localStorage.getItem("financialProfile");
        const ss = localStorage.getItem("financialScore");
        if (sp) setProfile(JSON.parse(sp));
        if (ss) {
          const parsed = JSON.parse(ss);
          setScore(typeof parsed === "number" ? parsed : parsed?.score ?? 0);
        }
      } catch { /* silent */ }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: MessageItem = { sender: "user", text: question, timestamp };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const activeProfile = profile ?? FALLBACK_PROFILE;
      const data = await chatWithAI(
        question,
        activeProfile as unknown as Record<string, unknown>,
        history
      );
      const aiText = data.message || "I couldn't generate a response. Please try again.";
      const aiMsg: MessageItem = { sender: "ai", text: aiText, timestamp };
      setMessages((prev) => [...prev, aiMsg]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: aiText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠ Something went wrong. Please try again.", timestamp },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activeProfile = profile ?? FALLBACK_PROFILE;
  const surplus = activeProfile.monthly_income - activeProfile.monthly_expenses - (activeProfile.monthly_emi || 0);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">

          {/* ── Left Sidebar: Profile ─────────────────────────────────── */}
          <aside className="lg:w-72 xl:w-80 flex flex-col gap-4 overflow-auto">

            {/* Profile Card */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/60 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Your Profile</h3>
                {!profile && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/30 font-semibold">
                    Sample
                  </span>
                )}
              </div>

              {/* Score Gauge */}
              <div className="flex justify-center py-3">
                <ScoreGauge score={score || 75} size={140} />
              </div>

              <div className="space-y-2 mt-4">
                {[
                  { label: "Income", value: `₹${activeProfile.monthly_income.toLocaleString()}`, icon: CircleDollarSign, color: "text-blue-400" },
                  { label: "Expenses", value: `₹${activeProfile.monthly_expenses.toLocaleString()}`, icon: Wallet, color: "text-amber-400" },
                  { label: "Savings", value: `₹${activeProfile.savings.toLocaleString()}`, icon: PiggyBank, color: "text-emerald-400" },
                  { label: "Surplus", value: `₹${Math.max(0, surplus).toLocaleString()}`, icon: TrendingUp, color: "text-cyan-400" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />{label}
                    </span>
                    <span className="font-bold text-slate-200">{value}</span>
                  </div>
                ))}
              </div>

              {!profile && (
                <Link href="/upload">
                  <button className="mt-4 w-full py-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center justify-center gap-2 transition-all">
                    <Upload className="w-3.5 h-3.5" /> Upload My Document
                  </button>
                </Link>
              )}
            </div>

            {/* Prompt Chips (desktop) */}
            <div className="hidden lg:block glass-panel rounded-2xl p-5 border border-slate-800/60 flex-1 overflow-auto">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">Quick Prompts</h3>
              <div className="space-y-2">
                {PROMPT_CHIPS.map(({ label, prompt, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main Chat Area ─────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-h-0 glass-panel rounded-2xl border border-slate-800/60 overflow-hidden">

            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">FinPilot AI Copilot</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-500">Online · LLM Powered</span>
                  </div>
                </div>
              </div>
              <MessageSquareText className="w-5 h-5 text-slate-600" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-1">
              {messages.map((msg, i) => (
                <ChatMessage key={i} {...msg} />
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-start gap-3 my-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-800/80">
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="ml-2 text-xs text-slate-500">FinPilot is thinking…</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Mobile Quick Prompts */}
            <div className="lg:hidden px-4 py-2 border-t border-slate-800/60 flex gap-2 overflow-x-auto flex-shrink-0">
              {PROMPT_CHIPS.slice(0, 4).map(({ label, prompt }) => (
                <button
                  key={label}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="px-4 sm:px-6 py-4 border-t border-slate-800/60 flex-shrink-0">
              <div className="flex items-end gap-3">
                <div className="flex-1 glass-input rounded-2xl px-4 py-3 flex items-center gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                    placeholder="Ask about budget, SIPs, gold, loans, goals…"
                    rows={1}
                    disabled={loading}
                    className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 resize-none focus:outline-none min-h-[22px] max-h-32"
                    style={{ scrollbarWidth: "none" }}
                  />
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  id="chat-send-btn"
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all flex-shrink-0 ${
                    !input.trim() || loading
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-blue-500/25"
                  }`}
                >
                  <SendHorizontal className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-700 text-center mt-2">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}