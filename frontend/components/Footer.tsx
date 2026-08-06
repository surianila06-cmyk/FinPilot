import Link from "next/link";
import { TrendingUp, ShieldCheck, Cpu, Lock, Github, Mail } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Copilot", href: "/chat" },
  { label: "Upload Doc", href: "/upload" },
];

const FEATURES = [
  "AI PDF Document Parsing",
  "Financial Health Index (0–100)",
  "Goal & Purchase Affordability",
  "SIP & Investment Projections",
  "Gold Investment Strategy",
  "Loan EMI Affordability Check",
];

const TRUST = [
  { icon: ShieldCheck, label: "256-bit Encrypted", color: "text-emerald-400" },
  { icon: Cpu, label: "LLM Powered", color: "text-blue-400" },
  { icon: Lock, label: "Local Privacy", color: "text-purple-400" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/60 bg-[#060a15]/95 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xl font-extrabold text-slate-100 tracking-tight">
                Prospera AI
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Your intelligent AI copilot for financial health diagnosis, salary slip parsing,
              loan analysis, SIP projections, and personalized Indian investment strategy.
            </p>
            <div className="flex items-center gap-5 text-xs text-slate-500">
              {TRUST.map(({ icon: Icon, label, color }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3">
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-3 text-xs">
              {NAV.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-blue-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features Column */}
          <div className="md:col-span-4">
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Prospera AI. Built for smarter financial decisions.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:support@prospera.ai" className="hover:text-slate-400 transition-colors flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> support@prospera.ai
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors flex items-center gap-1">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
