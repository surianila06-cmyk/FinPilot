"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreGauge from "@/components/ScoreGauge";
import {
  ArrowRight, FileText, ShieldCheck, PieChart as PieIcon,
  Bot, Sparkles, Coins, Home as HomeIcon,
  BarChart2, Zap, CheckCircle2,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    color: "blue",
    title: "AI Document Parser",
    desc: "Upload salary slips or bank statements. Prospera extracts income, taxes, EMIs, and savings automatically using LLM intelligence.",
  },
  {
    icon: PieIcon,
    color: "emerald",
    title: "Financial Health Index",
    desc: "Get a 0–100 health score based on 5 weighted factors: expense ratio, EMI burden, savings reserve, debt load, and insurance coverage.",
  },
  {
    icon: Bot,
    color: "purple",
    title: "Conversational AI Advisor",
    desc: "Ask anything — vehicle purchases, gold investments, SIP projections, loan eligibility — and receive data-backed, personalised answers.",
  },
  {
    icon: BarChart2,
    color: "amber",
    title: "SIP Wealth Projections",
    desc: "See your money grow. Prospera calculates 5, 10, and 20-year SIP projections using historical Nifty 50 CAGR benchmarks.",
  },
  {
    icon: Coins,
    color: "yellow",
    title: "Gold Strategy Advisor",
    desc: "Get tailored advice on Sovereign Gold Bonds, Gold ETFs, and Digital Gold SIPs aligned with your current savings level.",
  },
  {
    icon: HomeIcon,
    color: "cyan",
    title: "Goal Planning Engine",
    desc: "Planning a bike, car, house, or wedding? Prospera calculates exactly how long it takes and how much to save monthly.",
  },
];

const COLOR_MAP: Record<string, string> = {
  blue:    "bg-blue-500/10 border-blue-500/20 text-blue-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  purple:  "bg-purple-500/10 border-purple-500/20 text-purple-400",
  amber:   "bg-amber-500/10 border-amber-500/20 text-amber-400",
  yellow:  "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  cyan:    "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
};

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "100% Private — no data stored", color: "text-emerald-400" },
  { icon: Zap, label: "Instant AI Analysis", color: "text-blue-400" },
  { icon: CheckCircle2, label: "No login required", color: "text-purple-400" },
];

export default function Home() {
  const [simIncome, setSimIncome] = useState(75000);
  const [simExpenses, setSimExpenses] = useState(25000);
  const [simSavings, setSimSavings] = useState(300000);

  const surplus = simIncome - simExpenses;
  const savingsRatio = simIncome > 0 ? (surplus / simIncome) * 100 : 0;

  const simScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (savingsRatio > 40 ? 50 : savingsRatio * 1.25) +
          (simSavings > simExpenses * 6 ? 40 : (simSavings / (simExpenses * 6 || 1)) * 40) +
          10
      )
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <section className="relative pt-24 pb-20 text-center space-y-8">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/12 to-purple-600/8 rounded-full blur-3xl -z-10 pointer-events-none animate-blob" />

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-xs font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-slate-300">Agentic AI Financial Copilot</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                v2.0 Live
              </span>
            </div>

            <div className="max-w-4xl mx-auto space-y-5">
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-100 leading-tight">
                Your Intelligent
                <br />
                <span className="glow-text-gradient">Financial Copilot</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
                Upload your salary slip or bank statement. Get instant AI-powered health scores,
                SIP projections, loan checks, and personalised investment advice.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/upload"
                id="hero-upload-cta"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-blue-600/20 hover:shadow-blue-600/35 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Upload Statement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/chat"
                id="hero-chat-cta"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-slate-200 font-semibold text-base border border-slate-800/80 hover:border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <Bot className="w-5 h-5 text-blue-400" />
                Try AI Copilot Chat
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500">
              {TRUST_ITEMS.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── LIVE SIMULATOR ───────────────────────────────────────────── */}
          <section className="py-12">
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800/80 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center mb-10">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Live Calculator</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
                  Test Your Financial Health Score
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Adjust the sliders to see how Prospera scores your financial profile in real-time.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Sliders */}
                <div className="lg:col-span-7 space-y-7">
                  {[
                    { label: "Monthly Income", value: simIncome, setter: setSimIncome, min: 20000, max: 300000, step: 5000, color: "accent-blue-500", valColor: "text-blue-400" },
                    { label: "Monthly Expenses", value: simExpenses, setter: setSimExpenses, min: 5000, max: 200000, step: 2500, color: "accent-amber-500", valColor: "text-amber-400" },
                    { label: "Liquid Savings", value: simSavings, setter: setSimSavings, min: 10000, max: 1000000, step: 10000, color: "accent-emerald-500", valColor: "text-emerald-400" },
                  ].map(({ label, value, setter, min, max, step, color, valColor }) => (
                    <div key={label} className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{label}</span>
                        <span className={valColor}>₹{value.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => setter(Number(e.target.value))}
                        className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer ${color}`}
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly Surplus</span>
                      <span className="text-sm font-bold text-emerald-400">₹{surplus.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Savings Rate</span>
                      <span className="text-sm font-bold text-blue-400">{savingsRatio.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Score gauge */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    Live Health Index
                  </span>
                  <ScoreGauge score={simScore} size={180} />
                  <Link
                    href="/upload"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                  >
                    Analyse My Real Document →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── FEATURES GRID ─────────────────────────────────────────────── */}
          <section className="py-16 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">What Prospera Does</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-2">
                Designed for Smarter Financial Decisions
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                Everything you need to understand your finances, plan major purchases, and build long-term wealth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="glass-card rounded-2xl p-7 space-y-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${COLOR_MAP[color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA BANNER ───────────────────────────────────────────────── */}
          <section className="pb-24">
            <div className="relative glass-card rounded-3xl p-8 sm:p-12 border border-blue-500/15 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative">
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
                    Ready to know your financial health?
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Upload your document or chat with the AI copilot directly.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/upload"
                    className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap"
                  >
                    Upload Statement
                  </Link>
                  <Link
                    href="/chat"
                    className="px-7 py-3 rounded-xl glass-card text-slate-200 font-semibold text-sm hover:bg-slate-800/80 transition-all whitespace-nowrap border border-slate-800"
                  >
                    Ask Copilot
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}