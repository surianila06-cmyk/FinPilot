"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatMessage from "@/components/ChatMessage";
import { chatWithAI } from "@/lib/api";
import { 
  Send, 
  Bot, 
  Sparkles, 
  RefreshCw, 
  HelpCircle, 
  Coins, 
  Bike, 
  Home as HomeIcon, 
  PiggyBank,
  UserCheck,
  ChevronRight
} from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Welcome to FinPilot AI! I am your intelligent financial assistant.\n\nAsk me anything about buying vehicles, gold investments, loan EMI eligibility, or optimizing your monthly savings budget.",
      timestamp: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("financialProfile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTimeout(() => setProfile(parsed), 0);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customQuery?: string) => {
    const queryToSend = customQuery || input;
    if (!queryToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInput("");
    setLoading(true);

    try {
      const activeProfile = Object.keys(profile).length > 0 ? profile : {
        monthly_income: 75000,
        monthly_expenses: 28000,
        savings: 350000,
        loans: 150000,
        monthly_emi: 8500
      };

      const res = await chatWithAI(queryToSend, activeProfile);
      const aiResponseText = typeof res === "string" ? res : res.message || JSON.stringify(res, null, 2);

      const aiMsg: Message = {
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠ Unable to connect to the backend server right now. Render backend may be starting up—please try sending your question again in 10 seconds.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const promptChips = [
    { label: "Can I buy a bike?", icon: Bike },
    { label: "Should I invest in gold?", icon: Coins },
    { label: "Can I take a home loan?", icon: HomeIcon },
    { label: "How can I increase my savings?", icon: PiggyBank },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* Left Context Sidebar (Financial Profile Summary) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-400" /> Loaded Context
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>

              <p className="text-xs text-slate-400">
                FinPilot uses this financial profile context when making purchase recommendations.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Monthly Income:</span>
                  <span className="font-bold text-slate-100">
                    ₹{Number(profile.monthly_income || 75000).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Monthly Expenses:</span>
                  <span className="font-bold text-amber-400">
                    ₹{Number(profile.monthly_expenses || 28000).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Liquid Savings:</span>
                  <span className="font-bold text-emerald-400">
                    ₹{Number(profile.savings || 350000).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Active Debt / EMI:</span>
                  <span className="font-bold text-rose-400">
                    ₹{Number(profile.loans || 150000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Tips Panel */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-400" /> Helpful Prompts
              </h4>
              <p className="text-xs text-slate-400">
                Click any suggestion below to test how FinPilot analyzes your purchase affordability:
              </p>
              <div className="space-y-2">
                {promptChips.map((chip, idx) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip.label)}
                      className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-blue-600/10 border border-slate-800 hover:border-blue-500/30 text-left text-xs font-medium text-slate-300 hover:text-blue-300 flex items-center justify-between transition-all group"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                        {chip.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Chat Messaging Interface */}
          <div className="lg:col-span-8 glass-panel rounded-3xl border border-slate-800 flex flex-col h-[650px] shadow-2xl overflow-hidden">
            
            {/* Header bar */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    FinPilot Agentic Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h2>
                  <p className="text-[10px] text-slate-400">Online • Ready for financial queries</p>
                </div>
              </div>

              <button
                onClick={() => setMessages([{
                  sender: "ai",
                  text: "Chat cleared. What financial goal or question can I assist you with now?",
                  timestamp: "Just now",
                }])}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors"
                title="Clear Chat History"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  sender={msg.sender}
                  text={msg.text}
                  timestamp={msg.timestamp}
                />
              ))}

              {loading && (
                <div className="flex items-center gap-3 my-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="glass-card rounded-2xl px-5 py-3 text-xs text-slate-300 flex items-center gap-2">
                    <span>🤖 FinPilot AI is processing financial model rules...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Ask about loans, bike/car purchases, gold, emergency fund..."
                className="flex-1 glass-input rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className={`px-6 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                  !input.trim() || loading
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20"
                }`}
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}