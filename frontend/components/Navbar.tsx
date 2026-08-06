"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  LayoutDashboard,
  MessageSquareText,
  UploadCloud,
  Menu,
  X,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/", icon: TrendingUp },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Copilot", href: "/chat", icon: MessageSquareText },
  { name: "Upload Doc", href: "/upload", icon: UploadCloud },
];

export default function Navbar() {
  const pathname = usePathname();
  const [hasProfile, setHasProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("financialProfile");
    if (stored) {
      const id = setTimeout(() => setHasProfile(true), 0);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel border-b border-slate-800/80"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-extrabold tracking-tight glow-text-gradient">
                Prospera
              </span>
              <span className="text-lg font-extrabold text-slate-400"> AI</span>
              <p className="text-[9px] text-slate-500 tracking-widest uppercase font-medium -mt-0.5">
                Financial Copilot
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 px-1.5 py-1.5 rounded-2xl border border-slate-800/80">
            {NAV_LINKS.map(({ name, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-400" : "text-slate-500"}`} />
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {hasProfile ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Profile Loaded
              </div>
            ) : (
              <Link
                href="/upload"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/80 hover:border-slate-600 text-slate-300 text-xs font-medium transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Upload Statement
              </Link>
            )}

            <Link
              href="/chat"
              className="relative group overflow-hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.02] transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              Ask AI
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1 animate-fade-in">
          {NAV_LINKS.map(({ name, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800">
            <Link
              href="/chat"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold"
            >
              <Sparkles className="w-4 h-4" />
              Ask Prospera AI
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}