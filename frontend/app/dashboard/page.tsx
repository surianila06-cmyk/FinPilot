"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FinancialCard from "@/components/FinancialCard";
import FinancialCharts from "@/components/FinancialCharts";
import ScoreGauge from "@/components/ScoreGauge";
import InsightBadge from "@/components/InsightBadge";
import {
  CircleDollarSign, Wallet, PiggyBank, Landmark, ShieldCheck,
  Sparkles, TrendingUp, AlertTriangle, Lightbulb, Upload,
  MessageSquareText, Target, Info,
} from "lucide-react";
import type { FinancialProfile } from "@/types/financial";


const FALLBACK_PROFILE: FinancialProfile = {
  monthly_income: 75000,
  monthly_expenses: 28000,
  savings: 350000,
  loans: 150000,
  monthly_emi: 8500,
  insurance: 3000,
};

export default function Dashboard() {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [score, setScore] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setMounted(true);
      try {
        const sp = localStorage.getItem("financialProfile");
        const ss = localStorage.getItem("financialScore");
        if (sp) setProfile(JSON.parse(sp) as FinancialProfile);
        if (ss) {
          const parsed = JSON.parse(ss);
          setScore(typeof parsed === "number" ? parsed : parsed?.score ?? 0);
        } else {
          setScore(0);
        }
      } catch {
        setScore(0);
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const active = profile ?? FALLBACK_PROFILE;
  const healthScore = score;
  const surplus = active.monthly_income - active.monthly_expenses - (active.monthly_emi || 0);
  const reserveMonths = active.monthly_expenses > 0
    ? Math.round(active.savings / active.monthly_expenses)
    : 0;

  const CARDS = [
    {
      title: "Monthly Income",
      value: `₹${active.monthly_income.toLocaleString()}`,
      subtitle: "Gross monthly earnings",
      icon: <CircleDollarSign className="w-5 h-5" />,
      accentColor: "blue" as const,
      trend: { text: "Primary Source", positive: true },
    },
    {
      title: "Liquid Savings",
      value: `₹${active.savings.toLocaleString()}`,
      subtitle: `${reserveMonths} months emergency buffer`,
      icon: <PiggyBank className="w-5 h-5" />,
      accentColor: "emerald" as const,
      trend: { text: reserveMonths >= 6 ? "Optimal Reserve" : "Build to 6 Months", positive: reserveMonths >= 6 },
    },
    {
      title: "Monthly Expenses",
      value: `₹${active.monthly_expenses.toLocaleString()}`,
      subtitle: "Living & recurring costs",
      icon: <Wallet className="w-5 h-5" />,
      accentColor: "amber" as const,
      trend: {
        text: `${((active.monthly_expenses / active.monthly_income) * 100).toFixed(0)}% of income`,
        positive: active.monthly_expenses / active.monthly_income < 0.5,
      },
    },
    {
      title: "Active EMI",
      value: active.monthly_emi ? `₹${active.monthly_emi.toLocaleString()}/mo` : "Zero",
      subtitle: active.loans > 0 ? `${active.loans} active loan${active.loans > 1 ? "s" : ""}` : "No active loans",
      icon: <Landmark className="w-5 h-5" />,
      accentColor: "rose" as const,
      trend: { text: active.loans === 0 ? "Debt Free 🎉" : "Under 35% DTI", positive: active.loans === 0 },
    },
    {
      title: "Monthly Surplus",
      value: `₹${Math.max(0, surplus).toLocaleString()}`,
      subtitle: "After expenses & EMI",
      icon: <TrendingUp className="w-5 h-5" />,
      accentColor: "cyan" as const,
      trend: { text: surplus > 0 ? "Positive Cash Flow" : "Deficit", positive: surplus > 0 },
    },
    {
      title: "Insurance",
      value: active.insurance ? `₹${active.insurance.toLocaleString()}/mo` : "None",
      subtitle: "Risk coverage premium",
      icon: <ShieldCheck className="w-5 h-5" />,
      accentColor: "purple" as const,
      trend: { text: active.insurance ? "Covered" : "Get Insured", positive: !!active.insurance },
    },
  ];

  const INSIGHTS = [
    {
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      badge: "tip" as const,
      badgeLabel: "Investment",
      title: "Start SIP with Your Surplus",
      desc: `Your monthly surplus of ₹${Math.max(0, surplus).toLocaleString()} can power a ₹${Math.max(500, Math.round(Math.max(0, surplus) * 0.5)).toLocaleString()}/month Nifty 50 Index Fund SIP. At 12% CAGR, this becomes substantial wealth over 10 years.`,
    },
    {
      icon: Lightbulb,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      badge: "info" as const,
      badgeLabel: "Emergency Fund",
      title: "Liquidity Buffer Status",
      desc: reserveMonths >= 6
        ? `Your savings of ₹${active.savings.toLocaleString()} cover ${reserveMonths} months of expenses — optimal liquidity! Consider investing any extra surplus.`
        : `You have ${reserveMonths} months reserve. Target 6 months (₹${(active.monthly_expenses * 6).toLocaleString()}) before investing aggressively.`,
    },
    ...(active.loans > 0
      ? [
          {
            icon: AlertTriangle,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            badge: "warning" as const,
            badgeLabel: "Debt Strategy",
            title: "Accelerate Loan Repayment",
            desc: `EMI of ₹${(active.monthly_emi || 0).toLocaleString()}/month across ${active.loans} active loan(s). Prepaying just 5% of principal annually can reduce tenure by ~2 years and save significant interest.`,
          },
        ]
      : [
          {
            icon: Target,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            badge: "success" as const,
            badgeLabel: "Debt Free",
            title: "Zero Debt — Build Wealth",
            desc: "You carry no loans — excellent! Channel your full surplus into SIP investments, gold bonds, and emergency fund growth.",
          },
        ]),
    {
      icon: Info,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      badge: "tip" as const,
      badgeLabel: "Tax Planning",
      title: "Save Up to ₹46,800 in Tax",
      desc: "Invest ₹1.5L in ELSS mutual funds under Section 80C. NPS contributions save additional tax under Section 80CCD. Health insurance premium qualifies under 80D.",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                Financial Overview
              </span>
              {!profile && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                  Sample Data
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-100">Financial Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">AI-generated health breakdown based on your financial profile</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/upload">
              <button className="px-4 py-2.5 rounded-xl glass-card text-xs font-bold text-slate-300 hover:bg-slate-800/60 flex items-center gap-2 border border-slate-800">
                <Upload className="w-4 h-4 text-blue-400" /> Upload Statement
              </button>
            </Link>
            <Link href="/chat">
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2">
                <MessageSquareText className="w-4 h-4" /> Ask Prospera AI
              </button>
            </Link>
          </div>
        </div>

        {/* 6-Card Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {CARDS.map((card) => (
            <FinancialCard key={card.title} {...card} />
          ))}
        </div>

        {/* Charts */}
        <FinancialCharts profile={active} healthScore={healthScore} />

        {/* Bottom: Score + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">

          {/* Score Gauge Panel */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-8 border border-slate-800/60 flex flex-col items-center justify-between gap-6">
            <div className="w-full">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Financial Health Score
              </h3>
              <p className="text-xs text-slate-500">Based on 5 weighted financial indicators</p>
            </div>

            <ScoreGauge score={healthScore} size={200} />

            <div className="w-full space-y-3 pt-4 border-t border-slate-800/60">
              {[
                { label: "Expense Ratio", good: active.monthly_expenses / active.monthly_income < 0.5 },
                { label: "EMI Burden", good: (active.monthly_emi || 0) / active.monthly_income < 0.35 },
                { label: "Emergency Reserve", good: reserveMonths >= 6 },
                { label: "Loan Burden", good: active.loans <= active.monthly_income * 12 },
                { label: "Insurance Coverage", good: !!active.insurance },
              ].map(({ label, good }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{label}</span>
                  <InsightBadge variant={good ? "success" : "warning"} label={good ? "Good" : "Needs Work"} small />
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-8 border border-slate-800/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> Prospera AI Recommendations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Personalised to your financial profile</p>
              </div>
              <InsightBadge variant="tip" label="Personalised" />
            </div>

            <div className="space-y-4">
              {INSIGHTS.map(({ icon: Icon, color, bg, badge, badgeLabel, title, desc }) => (
                <div key={title} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${bg} flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">{title}</h4>
                      <InsightBadge variant={badge} label={badgeLabel} small />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5 mt-5 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-500">Have a question about your finances?</span>
              <Link href="/chat">
                <button className="px-4 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-xs font-bold border border-blue-500/30 transition-all">
                  Chat with Copilot →
                </button>
              </Link>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}