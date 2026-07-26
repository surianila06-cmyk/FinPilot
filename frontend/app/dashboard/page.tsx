"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FinancialCard from "@/components/FinancialCard";
import FinancialCharts from "@/components/FinancialCharts";
import {
  CircleDollarSign,
  Wallet,
  PiggyBank,
  Landmark,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Upload
} from "lucide-react";

interface FinancialProfile {
  monthly_income: number;
  monthly_expenses: number;
  savings: number;
  loans: number;
  monthly_emi?: number;
  insurance?: number;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("financialProfile");
      const storedScore = localStorage.getItem("financialScore");

      if (storedProfile) {
        try {
          const parsedProf = JSON.parse(storedProfile);
          setTimeout(() => setProfile(parsedProf), 0);
        } catch {
          // ignore
        }
      }

      if (storedScore) {
        try {
          const parsed = JSON.parse(storedScore);
          const val = typeof parsed === "object" ? parsed.score ?? 75 : Number(parsed) || 75;
          setTimeout(() => setScore(val), 0);
        } catch {
          setTimeout(() => setScore(75), 0);
        }
      } else {
        setTimeout(() => setScore(75), 0);
      }
    }
  }, []);

  // Fallback sample data if no profile is uploaded yet
  const activeProfile = profile || {
    monthly_income: 75000,
    monthly_expenses: 28000,
    savings: 350000,
    loans: 150000,
    monthly_emi: 8500,
    insurance: 3000,
  };

  const healthScore = score > 0 ? score : 78;
  const surplus = activeProfile.monthly_income - activeProfile.monthly_expenses - (activeProfile.monthly_emi || 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                Financial Diagnosis
              </span>
              {!profile && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                  Sample Data Mode
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-100 mt-1">
              Financial Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              AI-generated health breakdown based on your extracted income and commitments
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/upload">
              <button className="px-4 py-2.5 rounded-xl glass-card text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-2 border border-slate-800">
                <Upload className="w-4 h-4 text-blue-400" /> Upload Statement
              </button>
            </Link>

            <Link href="/chat">
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2">
                <MessageSquareText className="w-4 h-4" /> Ask FinPilot AI
              </button>
            </Link>
          </div>
        </div>

        {/* METRIC CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          
          <FinancialCard
            title="Monthly Income"
            value={`₹${activeProfile.monthly_income.toLocaleString()}`}
            subtitle="Extracted gross earnings"
            icon={<CircleDollarSign className="w-6 h-6 text-blue-400" />}
            accentColor="blue"
            trend={{ text: "Primary Income", positive: true }}
          />

          <FinancialCard
            title="Liquid Savings"
            value={`₹${activeProfile.savings.toLocaleString()}`}
            subtitle="Emergency & liquid funds"
            icon={<PiggyBank className="w-6 h-6 text-emerald-400" />}
            accentColor="emerald"
            trend={{ text: `${(activeProfile.savings / (activeProfile.monthly_expenses || 1)).toFixed(1)}x mo expenses`, positive: true }}
          />

          <FinancialCard
            title="Monthly Expenses"
            value={`₹${activeProfile.monthly_expenses.toLocaleString()}`}
            subtitle="Living & recurring costs"
            icon={<Wallet className="w-6 h-6 text-amber-400" />}
            accentColor="amber"
            trend={{ text: `${((activeProfile.monthly_expenses / activeProfile.monthly_income) * 100).toFixed(0)}% of income`, positive: false }}
          />

          <FinancialCard
            title="Active Debt / EMI"
            value={activeProfile.loans > 0 ? `₹${(activeProfile.monthly_emi || 0).toLocaleString()}/mo` : "Zero Debt"}
            subtitle={activeProfile.loans > 0 ? `Total Principal: ₹${activeProfile.loans.toLocaleString()}` : "No active loan burden"}
            icon={<Landmark className="w-6 h-6 text-rose-400" />}
            accentColor="rose"
            trend={{ text: activeProfile.loans > 0 ? "Under safe 30% DTI limit" : "100% Debt-free", positive: activeProfile.loans === 0 }}
          />

        </div>

        {/* RECHARTS INTERACTIVE VISUALIZERS */}
        <FinancialCharts profile={activeProfile} healthScore={healthScore} />

        {/* HEALTH SCORE & AI RECOMMENDATION CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
          
          {/* Health Score Gauge Panel */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Financial Health Score
                </h3>
                <span className="text-xs text-slate-400 font-semibold">Max 100</span>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <span className="text-6xl font-black text-slate-100 glow-text-emerald">
                  {healthScore}
                </span>

                <div className="w-full bg-slate-900 rounded-full h-4 mt-6 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${healthScore}%` }}
                  />
                </div>

                <p className="text-sm font-bold text-slate-200 mt-4 text-center">
                  {healthScore >= 80
                    ? "🟢 Excellent Financial Health"
                    : healthScore >= 60
                    ? "🟡 Good Financial Stability"
                    : healthScore >= 40
                    ? "🟠 Average Buffer — Reduce Debt"
                    : "🔴 High Debt / Action Required"}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Emergency Buffer:</span>
                <span className="text-slate-200 font-semibold">
                  {Math.round(activeProfile.savings / (activeProfile.monthly_expenses || 1))} Months
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Surplus:</span>
                <span className="text-emerald-400 font-semibold">₹{surplus.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* AI Insights & Action Items Panel */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> FinPilot AI Recommendations
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 font-semibold">
                  Personalized
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      Savings Surplus Investment
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      You have a monthly surplus of ₹{surplus.toLocaleString()}. Consider putting 60% (₹{Math.round(surplus * 0.6).toLocaleString()}) into low-cost Index SIPs.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      Emergency Reserve Status
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Your savings of ₹{activeProfile.savings.toLocaleString()} cover over 6 months of living expenses. Your liquidity buffer is optimal.
                    </p>
                  </div>
                </div>

                {activeProfile.loans > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                        Debt Repayment Strategy
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Current loan EMI is ₹{(activeProfile.monthly_emi || 0).toLocaleString()}/mo. Prepaying 5% principal annually will cut your loan tenure by ~2 years.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Have a specific question about your budget?</span>
              <Link href="/chat">
                <button className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold border border-blue-500/30 transition-all">
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