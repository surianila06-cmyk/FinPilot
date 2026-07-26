import Link from "next/link";
import { TrendingUp, ShieldCheck, Cpu, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-lg font-bold text-slate-100 tracking-tight">
                FinPilot AI
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Your next-generation agentic AI copilot for financial health diagnosis, document parsing, loan calculations, and personalized wealth advice.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-bit Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-blue-400" /> AI LLM Powered
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-purple-400" /> Local Storage Privacy
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-blue-400 transition-colors">
                  Upload Statement
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                  Financial Dashboard
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-blue-400 transition-colors">
                  Ask AI Copilot
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>PDF Salary & Bank Statement Parsing</li>
              <li>Financial Health Index Calculation</li>
              <li>Goal & Vehicle Affordability Checker</li>
              <li>Gold & Investment Strategy Advisor</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FinPilot AI. All rights reserved.</p>
          <p className="text-slate-500">
            Designed for smart personal financial management.
          </p>
        </div>
      </div>
    </footer>
  );
}
