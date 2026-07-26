"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  PieChart as PieChartIcon, 
  Calculator, 
  Bot
} from "lucide-react";

export default function Home() {
  // Interactive Live Score Simulator State
  const [simIncome, setSimIncome] = useState(75000);
  const [simExpenses, setSimExpenses] = useState(25000);
  const [simSavings, setSimSavings] = useState(300000);

  const surplus = simIncome - simExpenses;
  const savingsRatio = simIncome > 0 ? (surplus / simIncome) * 100 : 0;
  
  // Calculate simulated health score
  const simScore = Math.min(
    100,
    Math.round(
      (savingsRatio > 40 ? 50 : savingsRatio * 1.25) +
      (simSavings > simExpenses * 6 ? 40 : (simSavings / (simExpenses * 6)) * 40) +
      10
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        {/* Background Decorative Glow Blobs */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          {/* HERO SECTION */}
          <section className="pt-20 pb-16 text-center space-y-8">
            
            {/* Version Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-inner text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-slate-300">Agentic AI Financial Copilot</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                v2.0 Active
              </span>
            </div>

            {/* Main Headline */}
            <div className="max-w-4xl mx-auto space-y-4">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
                Your Intelligent <br />
                <span className="glow-text-gradient">Financial Health Copilot</span>
              </h1>
              <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
                Upload your salary slips or bank statements. Get instant AI financial extraction, health index diagnosis, and personalized loan & investment guidance.
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/upload"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-blue-600/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Upload Statement</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/chat"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card hover:bg-slate-800/80 text-slate-200 font-semibold text-base border border-slate-800 flex items-center justify-center gap-2 transition-all"
              >
                <Bot className="w-5 h-5 text-blue-400" />
                <span>Try AI Copilot Chat</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400 border-t border-slate-900 max-w-3xl mx-auto">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Automated PDF Parsing</span>
              </div>
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-emerald-400" />
                <span>Interactive Wealth Charts</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>100% Private Local Storage</span>
              </div>
            </div>

          </section>

          {/* INTERACTIVE FINANCIAL HEALTH SIMULATOR SHOWCASE */}
          <section className="py-12">
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden shadow-2xl">
              
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                  Live Calculator Preview
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
                  Test Your Financial Health Score
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Adjust the parameters below to see how FinPilot calculates your financial stability in real-time.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Sliders Input Column */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Monthly Income Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Monthly Income</span>
                      <span className="text-blue-400">₹{simIncome.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="20000"
                      max="300000"
                      step="5000"
                      value={simIncome}
                      onChange={(e) => setSimIncome(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Monthly Expenses Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Monthly Expenses</span>
                      <span className="text-amber-400">₹{simExpenses.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="150000"
                      step="2500"
                      value={simExpenses}
                      onChange={(e) => setSimExpenses(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Total Savings Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Liquid Savings / Reserve</span>
                      <span className="text-emerald-400">₹{simSavings.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={simSavings}
                      onChange={(e) => setSimSavings(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Quick stats summary */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly Surplus</span>
                      <span className="text-sm font-bold text-emerald-400">₹{surplus.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Savings Rate</span>
                      <span className="text-sm font-bold text-blue-400">{savingsRatio.toFixed(1)}%</span>
                    </div>
                  </div>

                </div>

                {/* Score Output Gauge Column */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-inner">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Calculated Health Index
                  </span>
                  
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-8 border-slate-800" />
                    <div 
                      className="absolute inset-0 rounded-full border-8 border-emerald-500 transition-all duration-500"
                      style={{
                        clipPath: `inset(0 0 0 0)`,
                        opacity: simScore / 100
                      }}
                    />
                    <div className="text-center">
                      <span className="text-5xl font-black text-slate-100 glow-text-emerald">
                        {simScore}
                      </span>
                      <span className="block text-xs font-medium text-slate-400 mt-1">/ 100</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-center text-slate-300">
                    {simScore >= 80 ? "🟢 Excellent Financial Stability" : simScore >= 60 ? "🟡 Healthy Savings Buffer" : "🟠 High Expense Burden"}
                  </p>
                  
                  <Link
                    href="/upload"
                    className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
                  >
                    Analyze Real PDF File
                  </Link>
                </div>

              </div>

            </div>
          </section>

          {/* FEATURE HIGHLIGHT GRID */}
          <section className="py-16 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold text-slate-100">
                Designed for Smarter Financial Decisions
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Everything you need to analyze your financial health, plan major purchases, and optimize savings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="glass-card rounded-2xl p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">AI Document Parser</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Upload salary slips or bank statements. FinPilot&apos;s document engine extracts income, tax deductions, expenses, and loan EMIs automatically.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card rounded-2xl p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Health Index Score</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Instantly compute your financial health index out of 100 based on savings ratio, emergency buffer months, and debt-to-income limits.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card rounded-2xl p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Conversational AI Advisor</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Ask questions like &quot;Can I buy a vehicle?&quot;, &quot;Should I buy gold?&quot;, or &quot;Can I take a home loan?&quot; and get instant data-backed answers.
                </p>
              </div>

            </div>
          </section>

          {/* QUICK PROMPT SHOWCASE BANNER */}
          <section className="pb-20">
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-blue-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-slate-100">Ready to test your financial profile?</h3>
                <p className="text-slate-400 text-sm">
                  Upload your document or jump straight into the AI Copilot chat.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/upload"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg"
                >
                  Upload Statement
                </Link>
                <Link
                  href="/chat"
                  className="px-6 py-3 rounded-xl glass-card text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all"
                >
                  Ask Copilot
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}