import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinPilot AI - Intelligent Financial Copilot",
  description: "Analyze your financial health, parse salary slips & bank statements with AI, and get personalized financial recommendations in real-time.",
  keywords: ["Financial Planning", "AI Copilot", "Salary Analysis", "Loan EMI Calculator", "Gold Investment", "Budget Planner"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
