import Link from "next/link";
import { TrendingUp, LayoutDashboard, MessageSquareText, UploadCloud } from "lucide-react";

export default function Sidebar() {
  const navLinks = [
    { name: "Home", href: "/", icon: TrendingUp },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Copilot", href: "/chat", icon: MessageSquareText },
    { name: "Upload Doc", href: "/upload", icon: UploadCloud },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 p-6 hidden lg:block">
      <div className="mb-8">
        <span className="text-xl font-extrabold text-slate-100 glow-text-gradient">
          FinPilot <span className="text-blue-400">AI</span>
        </span>
      </div>
      <nav className="space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <Icon className="w-4 h-4 text-blue-400" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
