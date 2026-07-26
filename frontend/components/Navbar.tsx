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
  FileText
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [hasProfile, setHasProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("financialProfile");
      if (stored) {
        setTimeout(() => setHasProfile(true), 0);
      }
    }
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/", icon: TrendingUp },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Copilot", href: "/chat", icon: MessageSquareText },
    { name: "Upload Doc", href: "/upload", icon: UploadCloud },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight glow-text-gradient">
                FinPilot <span className="text-blue-400 font-bold">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider font-semibold uppercase -mt-1">
                Financial Copilot
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Profile Status Pill & Quick Action */}
          <div className="hidden sm:flex items-center gap-3">
            {hasProfile ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Profile Loaded</span>
              </div>
            ) : (
              <Link
                href="/upload"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-medium transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Upload Statement</span>
              </Link>
            )}

            <Link
              href="/chat"
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-[1px] shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 transition-shadow duration-300"
            >
              <div className="px-4 py-2 rounded-[11px] bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:bg-opacity-0 transition-all duration-300 text-white text-sm font-semibold flex items-center gap-2">
                <span>Ask AI</span>
                <MessageSquareText className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}